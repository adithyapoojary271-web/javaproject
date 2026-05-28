/**
 * Core Banking System State Controller
 * Enterprise Data Bus Communication Configuration
 */

const API_URL = 'https://javaproject-1i9k.onrender.com/api/bank';
let currentSessionUser = null;

// Enforce safe view context configuration on boot
window.addEventListener('DOMContentLoaded', () => {
    goToHome();
});

function goToHome() {
    currentSessionUser = null; // Clean active state context parameters completely
    
    // UI View Array State Switches
    document.getElementById('user-login-view').classList.remove('hidden');
    document.getElementById('user-dashboard-view').classList.add('hidden');
    document.getElementById('admin-portal-view').classList.add('hidden');
    document.getElementById('left-branding').classList.remove('opacity-30');
    document.getElementById('header-actions').classList.remove('invisible');

    // Wipe Old Inputs
    document.getElementById('login-acc').value = '';
    document.getElementById('login-pin').value = '';
}

function switchPortal(portal) {
    if (portal === 'user') {
        if (currentSessionUser) {
            document.getElementById('user-login-view').classList.add('hidden');
            document.getElementById('user-dashboard-view').classList.remove('hidden');
            document.getElementById('admin-portal-view').classList.add('hidden');
        } else {
            goToHome();
        }
    } else if (portal === 'admin') {
        const pass = prompt("Provide Administrative System Verification Passkey:");
        if (pass === 'admin') {
            document.getElementById('user-login-view').classList.add('hidden');
            document.getElementById('user-dashboard-view').classList.add('hidden');
            document.getElementById('admin-portal-view').classList.remove('hidden');
            document.getElementById('left-branding').classList.add('opacity-30');
            document.getElementById('header-actions').classList.add('invisible');
            loadMasterLedger();
        } else {
            alert("Authorization Denied: Revoked Security Token.");
            goToHome();
        }
    }
}

async function handleUserLogin() {
    const accountNumber = document.getElementById('login-acc').value.trim();
    const pin = document.getElementById('login-pin').value.trim();

    if (!accountNumber || !pin) return alert('Incomplete security authorization payload.');

    try {
        const res = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ accountNumber, pin })
        });

        if (res.ok) {
            currentSessionUser = await res.json();
            currentSessionUser.pin = pin; // Cache tracking credentials for data binding syncs
            updateUserDashboard();
            switchPortal('user');
        } else {
            alert('Identity Verification Aborted: Invalid Records.');
        }
    } catch (err) {
        alert('Connection timeout. Remote server instance is booting up from cold standby.');
    }
}

function updateUserDashboard() {
    document.getElementById('user-name').innerText = currentSessionUser.customerName.toUpperCase();
    document.getElementById('user-acc-display').innerText = `ACC ID REFS: ${currentSessionUser.accountNumber}`;
    document.getElementById('user-balance').innerText = `$${currentSessionUser.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    
    const historyList = document.getElementById('tx-history');
    historyList.innerHTML = '';
    
    if (!currentSessionUser.transactionHistory || currentSessionUser.transactionHistory.length === 0) {
        historyList.innerHTML = `<li class="text-slate-500 italic py-1">No transaction records logged.</li>`;
        return;
    }

    [...currentSessionUser.transactionHistory].reverse().forEach(log => {
        const li = document.createElement('li');
        li.className = "py-1 text-slate-300 border-b border-white/5";
        li.innerText = `> ${log}`;
        historyList.appendChild(li);
    });
}

async function executeTx(type) {
    const amountInput = document.getElementById('tx-amount');
    const amount = parseFloat(amountInput.value);
    
    if (isNaN(amount) || amount <= 0) return alert('Invalid numerical data array allocation.');

    try {
        const res = await fetch(`${API_URL}/${type}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ accountNumber: currentSessionUser.accountNumber, amount: amount })
        });

        if (res.ok) {
            amountInput.value = ''; 
            // Automated state container polling update sequence
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
        alert('Data payload bus transmission fault.');
    }
}

async function loadMasterLedger() {
    try {
        const res = await fetch(`${API_URL}/accounts`);
        const accounts = await res.json();
        const tbody = document.getElementById('admin-ledger-body');
        tbody.innerHTML = '';
        
        accounts.forEach(acc => {
            const row = `<tr class="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td class="p-2 text-slate-400 font-mono">${acc.accountNumber}</td>
                <td class="p-2 text-slate-200 uppercase">${acc.customerName}</td>
                <td class="p-2 text-right text-slate-100 font-bold font-mono">$${acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            </tr>`;
            tbody.innerHTML += row;
        });
    } catch (err) {
        alert('Data array parsing exception.');
    }
}

async function createAccount() {
    const accountNumber = document.getElementById('adm-acc').value.trim();
    const customerName = document.getElementById('adm-name').value.trim();
    const pinStr = document.getElementById('adm-pin').value.trim();
    const balanceStr = document.getElementById('adm-bal').value.trim();

    if (!accountNumber || !customerName || !pinStr || !balanceStr) return alert('Mandatory validation fields missing.');

    try {
        const res = await fetch(`${API_URL}/account`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ accountNumber, customerName, pin: parseInt(pinStr), balance: parseFloat(balanceStr) })
        });

        if (res.ok) {
            alert('Profile entry append successful.');
            loadMasterLedger();
            document.getElementById('adm-acc').value = '';
            document.getElementById('adm-name').value = '';
            document.getElementById('adm-pin').value = '';
            document.getElementById('adm-bal').value = '';
        } else {
            const errorMsg = await res.text();
            alert(`Aborted: ${errorMsg}`);
        }
    } catch (err) {
        alert('Storage commit serialization fault.');
    }
}

async function applyMassInterest() {
    try {
        const res = await fetch(`${API_URL}/interest`, { method: 'POST' });
        if (res.ok) {
            alert('Compound yield macros updated throughout cluster rows.');
            loadMasterLedger();
        }
    } catch (err) {
        alert('Macro evaluation runtime error.');
    }
}
