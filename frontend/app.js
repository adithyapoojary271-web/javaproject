const API_URL = 'https://javaproject-1i9k.onrender.com/api/bank';
let currentSessionUser = null;

// Enforce consistent base view layer on execution
window.addEventListener('DOMContentLoaded', () => {
    goToHome();
});

function goToHome() {
    currentSessionUser = null; // Purge active authentication footprint
    
    // UI View Array State Switches
    document.getElementById('home-screen').classList.remove('hidden');
    document.getElementById('user-login').classList.add('hidden');
    document.getElementById('user-dashboard').classList.add('hidden');
    document.getElementById('admin-portal').classList.add('hidden');
    document.getElementById('nav-actions').classList.remove('hidden');
    
    // Clear Input Data Arrays
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
        const pass = prompt("Provide System Manager Authentication Token:");
        if (pass === 'admin') {
            document.getElementById('admin-portal').classList.remove('hidden');
            document.getElementById('nav-actions').classList.add('hidden');
            loadMasterLedger();
        } else {
            alert("Access Denied: Revoked Authorization Signature.");
            goToHome();
        }
    }
}

async function handleUserLogin() {
    const accountNumber = document.getElementById('login-acc').value.trim();
    const pin = document.getElementById('login-pin').value.trim();

    if (!accountNumber || !pin) {
        return alert('Incomplete parameter payloads provided.');
    }

    try {
        const res = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ accountNumber, pin })
        });

        if (res.ok) {
            currentSessionUser = await res.json();
            currentSessionUser.pin = pin; // Cache session layer access signature
            updateUserDashboard();
            switchPortal('user');
        } else {
            alert('Authentication Fault: Access Denied.');
        }
    } catch (err) {
        alert('Remote cluster connectivity error. System instance cold boot delay.');
    }
}

function updateUserDashboard() {
    document.getElementById('user-name').innerText = currentSessionUser.customerName.toUpperCase();
    document.getElementById('user-acc-display').innerText = `ACC ID LOG: ${currentSessionUser.accountNumber}`;
    document.getElementById('user-balance').innerText = `$${currentSessionUser.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    
    const historyList = document.getElementById('tx-history');
    historyList.innerHTML = '';
    
    if (!currentSessionUser.transactionHistory || currentSessionUser.transactionHistory.length === 0) {
        historyList.innerHTML = `<li class="text-slate-500 italic py-2">No transaction metadata files synced.</li>`;
        return;
    }

    [...currentSessionUser.transactionHistory].reverse().forEach(log => {
        const li = document.createElement('li');
        li.className = "py-2 border-b border-slate-800 tracking-wide text-slate-300";
        li.innerText = `>> ${log}`;
        historyList.appendChild(li);
    });
}

async function executeTx(type) {
    const amountInput = document.getElementById('tx-amount');
    const amount = parseFloat(amountInput.value);
    
    if (isNaN(amount) || amount <= 0) {
        return alert('Invalid numeric ledger assignment.');
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
            alert(`Rejected: ${errorMsg}`);
        }
    } catch (err) {
        alert('Network transmission layer fault.');
    }
}

async function loadMasterLedger() {
    try {
        const res = await fetch(`${API_URL}/accounts`);
        const accounts = await res.json();
        const tbody = document.getElementById('admin-ledger-body');
        tbody.innerHTML = '';
        
        accounts.forEach(acc => {
            const row = `<tr class="hover:bg-slate-800/50 border-b border-slate-800">
                <td class="p-3 text-slate-400">${acc.accountNumber}</td>
                <td class="p-3 text-slate-200 font-sans">${acc.customerName}</td>
                <td class="p-3 text-right text-slate-100 font-semibold">$${acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            </tr>`;
            tbody.innerHTML += row;
        });
    } catch (err) {
        alert('Failed to extract active data array allocations.');
    }
}

async function createAccount() {
    const accountNumber = document.getElementById('adm-acc').value.trim();
    const customerName = document.getElementById('adm-name').value.trim();
    const pinStr = document.getElementById('adm-pin').value.trim();
    const balanceStr = document.getElementById('adm-bal').value.trim();

    if (!accountNumber || !customerName || !pinStr || !balanceStr) {
        return alert('All system payload values required.');
    }

    try {
        const res = await fetch(`${API_URL}/account`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ accountNumber, customerName, pin: parseInt(pinStr), balance: parseFloat(balanceStr) })
        });

        if (res.ok) {
            alert('New core registry profile verified and committed.');
            loadMasterLedger();
            document.getElementById('adm-acc').value = '';
            document.getElementById('adm-name').value = '';
            document.getElementById('adm-pin').value = '';
            document.getElementById('adm-bal').value = '';
        } else {
            const errorMsg = await res.text();
            alert(`Execution Aborted: ${errorMsg}`);
        }
    } catch (err) {
        alert('Failed to transmit registration configuration.');
    }
}

async function applyMassInterest() {
    try {
        const res = await fetch(`${API_URL}/interest`, { method: 'POST' });
        if (res.ok) {
            alert('Interest yield calculation formulas executed successfully.');
            loadMasterLedger();
        }
    } catch (err) {
        alert('Macro configuration runtime error.');
    }
}
