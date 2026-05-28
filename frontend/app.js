const API_URL = 'http://localhost:8080/api/bank';
let currentSessionUser = null;

function switchPortal(portal) {
    document.getElementById('user-login').classList.add('hidden');
    document.getElementById('user-dashboard').classList.add('hidden');
    document.getElementById('admin-portal').classList.add('hidden');

    if (portal === 'user') {
        if (currentSessionUser) {
            document.getElementById('user-dashboard').classList.remove('hidden');
        } else {
            document.getElementById('user-login').classList.remove('hidden');
        }
    } else if (portal === 'admin') {
        const pass = prompt("Enter Manager Password:");
        if (pass === 'admin') {
            document.getElementById('admin-portal').classList.remove('hidden');
            loadMasterLedger();
        } else {
            alert("Access Denied: Invalid Password.");
            switchPortal('user');
        }
    }
}

async function handleUserLogin() {
    const accountNumber = document.getElementById('login-acc').value;
    const pin = document.getElementById('login-pin').value;

    const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountNumber, pin })
    });

    if (res.ok) {
        currentSessionUser = await res.json();
        updateUserDashboard();
        switchPortal('user');
    } else {
        alert('Access Denied: Incorrect Account details or PIN.');
    }
}

function updateUserDashboard() {
    document.getElementById('user-name').innerText = currentSessionUser.customerName;
    document.getElementById('user-acc-display').innerText = `Acc #: ${currentSessionUser.accountNumber}`;
    document.getElementById('user-balance').innerText = `$${currentSessionUser.balance.toFixed(2)}`;
    
    const historyList = document.getElementById('tx-history');
    historyList.innerHTML = '';
    currentSessionUser.transactionHistory.reverse().forEach(log => {
        const li = document.createElement('li');
        li.className = "border-b border-slate-700/50 py-1";
        li.innerText = `• ${log}`;
        historyList.appendChild(li);
    });
}

async function executeTx(type) {
    const amount = document.getElementById('tx-amount').value;
    if (!amount || amount <= 0) return alert('Invalid amount requested.');

    const res = await fetch(`${API_URL}/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountNumber: currentSessionUser.accountNumber, amount: amount })
    });

    if (res.ok) {
        alert('Transaction authorized and synced to storage.');
        // Refresh session
        const refresh = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ accountNumber: currentSessionUser.accountNumber, pin: currentSessionUser.pin })
        });
        currentSessionUser = await refresh.json();
        updateUserDashboard();
        document.getElementById('tx-amount').value = '';
    } else {
        alert('Transaction failed.');
    }
}

async function loadMasterLedger() {
    const res = await fetch(`${API_URL}/accounts`);
    const accounts = await res.json();
    const tbody = document.getElementById('admin-ledger-body');
    tbody.innerHTML = '';
    
    accounts.forEach(acc => {
        const row = `<tr>
            <td class="py-2.5 font-mono">${acc.getAccountNumber || acc.accountNumber}</td>
            <td class="py-2.5">${acc.customerName}</td>
            <td class="py-2.5 text-right font-semibold text-emerald-400">$${acc.balance.toFixed(2)}</td>
        </tr>`;
        tbody.innerHTML += row;
    });
}

async function createAccount() {
    const accountNumber = document.getElementById('adm-acc').value;
    const customerName = document.getElementById('adm-name').value;
    const pin = document.getElementById('adm-pin').value;
    const balance = document.getElementById('adm-bal').value;

    const res = await fetch(`${API_URL}/account`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountNumber, customerName, pin, balance })
    });

    if (res.ok) {
        alert('Account profile created inside Excel storage engine!');
        loadMasterLedger();
        document.getElementById('adm-acc').value = '';
        document.getElementById('adm-name').value = '';
        document.getElementById('adm-pin').value = '';
        document.getElementById('adm-bal').value = '';
    } else {
        alert('Failed to register account profile.');
    }
}

async function applyMassInterest() {
    await fetch(`${API_URL}/interest`, { method: 'POST' });
    alert('All operational registers recalculated with 4.5% annual yield.');
    loadMasterLedger();
}