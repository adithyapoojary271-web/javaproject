const API_URL = 'https://javaproject-1i9k.onrender.com/api/bank';
let currentSessionUser = null;

// Initialize layout on script execution
window.addEventListener('DOMContentLoaded', () => {
    goToHome();
});

function goToHome() {
    currentSessionUser = null; // Clean session state context out completely
    
    // Reset Navigation View Classes
    document.getElementById('home-screen').classList.remove('hidden');
    document.getElementById('user-login').classList.add('hidden');
    document.getElementById('user-dashboard').classList.add('hidden');
    document.getElementById('admin-portal').classList.add('hidden');
    document.getElementById('nav-actions').classList.remove('hidden');
    
    // Purge input array data
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
        const pass = prompt("Provide Admin Cluster Verification Passkey:");
        if (pass === 'admin') {
            document.getElementById('admin-portal').classList.remove('hidden');
            document.getElementById('nav-actions').classList.add('hidden');
            loadMasterLedger();
        } else {
            alert("Security Denied: Invalid Administrative Signature.");
            goToHome();
        }
    }
}

async function handleUserLogin() {
    const accountNumber = document.getElementById('login-acc').value.trim();
    const pin = document.getElementById('login-pin').value.trim();

    if (!accountNumber || !pin) {
        return alert('System fault: Empty security payloads detected.');
    }

    try {
        const res = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ accountNumber, pin })
        });

        if (res.ok) {
            currentSessionUser = await res.json();
            currentSessionUser.pin = pin; // Cache layer code for automatic updates
            updateUserDashboard();
            switchPortal('user');
        } else {
            alert('Security Rejected: Invalid operational parameters.');
        }
    } catch (err) {
        alert('Server network timeout. Cluster cold instance boot configuration active.');
    }
}

function updateUserDashboard() {
    document.getElementById('user-name').innerText = currentSessionUser.customerName.toUpperCase();
    document.getElementById('user-acc-display').innerText = `ACCOUNT CARD REFERENCE ID: ${currentSessionUser.accountNumber}`;
    document.getElementById('user-balance').innerText = `$${currentSessionUser.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    
    const historyList = document.getElementById('tx-history');
    historyList.innerHTML = '';
    
    if (!currentSessionUser.transactionHistory || currentSessionUser.transactionHistory.length === 0) {
        historyList.innerHTML = `<li class="text-slate-500 italic py-2">No past ledger transactions located.</li>`;
        return;
    }

    [...currentSessionUser.transactionHistory].reverse().forEach(log => {
        const li = document.createElement('li');
        li.className = "py-2.5 border-b border-slate-800 tracking-wide text-slate-300 flex items-center";
        li.innerText = `[RECORD] > ${log}`;
        historyList.appendChild(li);
    });
}

async function executeTx(type) {
    const amountInput = document.getElementById('tx-amount');
    const amount = parseFloat(amountInput.value);
    
    if (isNaN(amount) || amount <= 0) {
        return alert('Value allocation parsing error.');
    }

    try {
        const res = await fetch(`${API_URL}/${type}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ accountNumber: currentSessionUser.accountNumber, amount: amount })
        });

        if (res.ok) {
            amountInput.value = ''; 
            const refresh = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ accountNumber: currentSessionUser.accountNumber, pin: currentSessionUser.pin })
            });
            currentSessionUser = await refresh.json();
            updateUserDashboard();
        } else {
            const errorMsg = await res.text();
            alert(`Process Canceled: ${errorMsg}`);
        }
    } catch (err) {
        alert('Data bus connection error.');
    }
}

async function loadMasterLedger() {
    try {
        const res = await fetch(`${API_URL}/accounts`);
        const accounts = await res.json();
        const tbody = document.getElementById('admin-ledger-body');
        tbody.innerHTML = '';
        
        accounts.forEach(acc => {
            const row = `<tr class="hover:bg-slate-800/40 border-b border-slate-800">
                <td class="p-3 text-slate-400 font-mono tracking-wider">${acc.accountNumber}</td>
                <td class="p-3 text-slate-200 font-sans tracking-wide uppercase">${acc.customerName}</td>
                <td class="p-3 text-right text-slate-100 font-semibold font-mono">$${acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            </tr>`;
            tbody.innerHTML += row;
        });
    } catch (err) {
        alert('Master matrix compilation exception.');
    }
}

async function createAccount() {
    const accountNumber = document.getElementById('adm-acc').value.trim();
    const customerName = document.getElementById('adm-name').value.trim();
    const pinStr = document.getElementById('adm-pin').value.trim();
    const balanceStr = document.getElementById('adm-bal').value.trim();

    if (!accountNumber || !customerName || !pinStr || !balanceStr) {
        return alert('Incomplete structural record attributes.');
    }

    try {
        const res = await fetch(`${API_URL}/account`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ accountNumber, customerName, pin: parseInt(pinStr), balance: parseFloat(balanceStr) })
        });

        if (res.ok) {
            alert('Row committed securely to permanent filesystem arrays.');
            loadMasterLedger();
            document.getElementById('adm-acc').value = '';
            document.getElementById('adm-name').value = '';
            document.getElementById('adm-pin').value = '';
            document.getElementById('adm-bal').value = '';
        } else {
            const errorMsg = await res.text();
            alert(`Execution Exception: ${errorMsg}`);
        }
    } catch (err) {
        alert('Row append transmission error.');
    }
}

async function applyMassInterest() {
    try {
        const res = await fetch(`${API_URL}/interest`, { method: 'POST' });
        if (res.ok) {
            alert('Interest calculations applied and logged uniformly across system indexes.');
            loadMasterLedger();
        }
    } catch (err) {
        alert('Macro parser runtime error.');
    }
}
