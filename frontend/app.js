// Paste your verified live Render host API URL here
const API_URL = 'https://javaproject-1i9k.onrender.com/api/bank';
let currentSessionUser = null;

// Initialize view state on boot
window.addEventListener('DOMContentLoaded', () => {
    goToHome();
});

// Clean Global Return Navigation Flow
function goToHome() {
    currentSessionUser = null; // Flush user token state out
    
    // Toggle View State Elements
    document.getElementById('home-screen').classList.remove('hidden');
    document.getElementById('user-login').classList.add('hidden');
    document.getElementById('user-dashboard').classList.add('hidden');
    document.getElementById('admin-portal').classList.add('hidden');
    
    // Adjust Header Buttons context
    document.getElementById('nav-actions').classList.remove('hidden');
    
    // Clear inputs safely
    document.getElementById('login-acc').value = '';
    document.getElementById('login-pin').value = '';
}

async function switchPortal(portal) {
    document.getElementById('home-screen').classList.add('hidden');
    document.getElementById('user-login').classList.add('hidden');
    document.getElementById('user-dashboard').classList.add('hidden');
    document.getElementById('admin-portal').classList.add('hidden');

    if (portal === 'user') {
        if (currentSessionUser) {
            document.getElementById('user-dashboard').classList.remove('hidden');
            document.getElementById('nav-actions').classList.add('hidden');
        } else {
            document.getElementById('user-login').classList.remove('hidden');
        }
    } else if (portal === 'admin') {
        const pass = prompt("Enter Administrative Manager Password:");
        if (pass === 'admin') {
            document.getElementById('admin-portal').classList.remove('hidden');
            document.getElementById('nav-actions').classList.add('hidden');
            loadMasterLedger();
        } else {
            alert("Access Denied: Invalid Password Configuration.");
            goToHome();
        }
    }
}

async function handleUserLogin() {
    const accountNumber = document.getElementById('login-acc').value.trim();
    const pin = document.getElementById('login-pin').value.trim();

    if (!accountNumber || !pin) {
        return alert('Please fill out all credentials.');
    }

    try {
        const res = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ accountNumber, pin })
        });

        if (res.ok) {
            currentSessionUser = await res.json();
            // Cache pin value internally inside state for sync refreshes later
            currentSessionUser.pin = pin; 
            updateUserDashboard();
            switchPortal('user');
        } else {
            alert('Access Denied: Invalid Account Number or PIN record.');
        }
    } catch (err) {
        alert('Server network error. The free cloud engine might be sleeping; give it 1 minute to wake up.');
    }
}

function updateUserDashboard() {
    document.getElementById('user-name').innerText = currentSessionUser.customerName;
    document.getElementById('user-acc-display').innerText = `Acc ID Ref: ${currentSessionUser.accountNumber}`;
    document.getElementById('user-balance').innerText = `$${currentSessionUser.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    
    const historyList = document.getElementById('tx-history');
    historyList.innerHTML = '';
    
    if (!currentSessionUser.transactionHistory || currentSessionUser.transactionHistory.length === 0) {
        historyList.innerHTML = `<li class="text-slate-500 italic py-2">No historical transaction operations found.</li>`;
        return;
    }

    // Loop backward so latest updates appear at the top
    [...currentSessionUser.transactionHistory].reverse().forEach(log => {
        const li = document.createElement('li');
        li.className = "py-3 text-slate-300 flex items-center gap-2 border-b border-slate-700/30";
        li.innerHTML = `<i class="fa-solid fa-caret-right text-emerald-500"></i> <span>${log}</span>`;
        historyList.appendChild(li);
    });
}

async function executeTx(type) {
    const amountInput = document.getElementById('tx-amount');
    const amount = parseFloat(amountInput.value);
    
    if (isNaN(amount) || amount <= 0) {
        return alert('Please supply a valid operational decimal value.');
    }

    try {
        const res = await fetch(`${API_URL}/${type}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ accountNumber: currentSessionUser.accountNumber, amount: amount })
        });

        if (res.ok) {
            amountInput.value = ''; // Clean field layout
            // Perform automated session cache refresh
            const refresh = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ accountNumber: currentSessionUser.accountNumber, pin: currentSessionUser.pin })
            });
            currentSessionUser = await refresh.json();
            updateUserDashboard();
        } else {
            const errText = await res.text();
            alert(`Operation Aborted: ${errText || 'Transaction logic failure.'}`);
        }
    } catch (err) {
        alert('Failed to transmit balance payload data.');
    }
}

async function loadMasterLedger() {
    try {
        const res = await fetch(`${API_URL}/accounts`);
        const accounts = await res.json();
        const tbody = document.getElementById('admin-ledger-body');
        tbody.innerHTML = '';
        
        accounts.forEach(acc => {
            const row = `<tr class="hover:bg-slate-700/30 transition-colors">
                <td class="p-3 font-mono text-xs tracking-wider text-slate-400">${acc.accountNumber}</td>
                <td class="p-3 font-medium text-slate-200">${acc.customerName}</td>
                <td class="p-3 text-right font-bold text-emerald-400 font-mono">$${acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            </tr>`;
            tbody.innerHTML += row;
        });
    } catch (err) {
        alert('Could not synchronize data matrices from storage.');
    }
}

async function createAccount() {
    const accountNumber = document.getElementById('adm-acc').value.trim();
    const customerName = document.getElementById('adm-name').value.trim();
    const pinStr = document.getElementById('adm-pin').value.trim();
    const balanceStr = document.getElementById('adm-bal').value.trim();

    if (!accountNumber || !customerName || !pinStr || !balanceStr) {
        return alert('All system entry data fields are mandatory.');
    }

    const pin = parseInt(pinStr);
    const balance = parseFloat(balanceStr);

    try {
        const res = await fetch(`${API_URL}/account`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ accountNumber, customerName, pin, balance })
        });

        if (res.ok) {
            alert('New structural profile appended successfully into database ledger.');
            loadMasterLedger();
            document.getElementById('adm-acc').value = '';
            document.getElementById('adm-name').value = '';
            document.getElementById('adm-pin').value = '';
            document.getElementById('adm-bal').value = '';
        } else {
            const errText = await res.text();
            alert(`Registration Failed: ${errText}`);
        }
    } catch (err) {
        alert('Server write failure.');
    }
}

async function applyMassInterest() {
    try {
        const res = await fetch(`${API_URL}/interest`, { method: 'POST' });
        if (res.ok) {
            alert('Ledger matrices completely synchronized with 4.5% compound yields.');
            loadMasterLedger();
        }
    } catch (err) {
        alert('Failed to run calculation macros.');
    }
}
