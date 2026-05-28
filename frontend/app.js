/**
 * Core Banking System Controller Engine
 * Managed Data Payload Synchronization
 */

const API_URL = 'https://javaproject-1i9k.onrender.com/api/bank';
let currentSessionUser = null;

window.addEventListener('DOMContentLoaded', () => {
  logout();
});

function logout() {
  currentSessionUser = null;

  // View Port Element Resets
  document.getElementById('login-view').classList.remove('hidden');
  document.getElementById('dashboard-view').classList.add('hidden');
  document.getElementById('admin-view').classList.add('hidden');
  
  // Outer Shell Global Opacity States
  document.getElementById('left-branding').classList.remove('opacity-20');
  document.getElementById('nav-actions').classList.remove('invisible');

  // Purge Form Elements
  document.getElementById('login-acc').value = '';
  document.getElementById('login-pin').value = '';
}

function switchPortal(type) {
  if (type === 'user') {
    logout();
  }

  if (type === 'admin') {
    const pass = prompt('Enter Admin Passkey');

    if (pass === 'admin') {
      document.getElementById('login-view').classList.add('hidden');
      document.getElementById('dashboard-view').classList.add('hidden');
      document.getElementById('admin-view').classList.remove('hidden');
      
      // Focus UI impact on the operational workspace card panel
      document.getElementById('left-branding').classList.add('opacity-20');
      document.getElementById('nav-actions').classList.add('invisible');
      
      loadMasterLedger();
    } else {
      alert('Invalid Administrative Verification Passkey');
      logout();
    }
  }
}

async function handleUserLogin() {
  const accountNumber = document.getElementById('login-acc').value.trim();
  const pin = document.getElementById('login-pin').value.trim();

  if (!accountNumber || !pin) {
    return alert('Enter complete login credential signatures.');
  }

  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accountNumber, pin })
    });

    if (response.ok) {
      currentSessionUser = await response.json();
      currentSessionUser.pin = pin; // Cache credential key configuration securely inside runtime state
      loadDashboard();
    } else {
      alert('Identity Verification Fault: Invalid configuration mismatch.');
    }
  } catch (error) {
    alert('Server data bus connection timeout. Instance starting up from cold standby.');
  }
}

function loadDashboard() {
  document.getElementById('login-view').classList.add('hidden');
  document.getElementById('admin-view').classList.add('hidden');
  document.getElementById('dashboard-view').classList.remove('hidden');

  document.getElementById('user-name').innerText = currentSessionUser.customerName.toUpperCase();
  document.getElementById('balance').innerText = `₹${currentSessionUser.balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  loadTransactions();
}

function loadTransactions() {
  const history = document.getElementById('tx-history');
  history.innerHTML = '';

  if (!currentSessionUser.transactionHistory || currentSessionUser.transactionHistory.length === 0) {
    history.innerHTML = `
      <div class="glass rounded-xl p-3 text-slate-500 italic text-center">
        No passbook ledger data elements generated yet.
      </div>
    `;
    return;
  }

  [...currentSessionUser.transactionHistory].reverse().forEach(tx => {
    const card = document.createElement('div');
    card.className = 'glass rounded-xl p-3 flex items-center justify-between border border-white/5';
    card.innerHTML = `
      <div>
        <p class="font-semibold text-slate-200 tracking-wide">${tx}</p>
        <span class="text-[10px] text-slate-500 font-mono uppercase mt-0.5 block">State: Synchronized</span>
      </div>
      <div class="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-sm select-none">
        💸
      </div>
    `;
    history.appendChild(card);
  });
}

async function executeTx(type) {
  const amountInput = document.getElementById('tx-amount');
  const amount = parseFloat(amountInput.value);

  if (isNaN(amount) || amount <= 0) {
    return alert('Supply a valid positive quantitative value parameter.');
  }

  try {
    const response = await fetch(`${API_URL}/${type}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        accountNumber: currentSessionUser.accountNumber,
        amount: amount
      })
    });

    if (response.ok) {
      amountInput.value = '';
      await refreshUser();
    } else {
      const msg = await response.text();
      alert(`Aborted: ${msg}`);
    }
  } catch (error) {
    alert('Failed to execute transmission payload.');
  }
}

async function refreshUser() {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      accountNumber: currentSessionUser.accountNumber,
      pin: currentSessionUser.pin
    })
  });
  currentSessionUser = await response.json();
  loadDashboard();
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
        <td class="p-2 text-right font-bold text-emerald-400 font-mono">₹${acc.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
      </tr>`;
      tbody.innerHTML += row;
    });
  } catch (err) {
    alert('Matrix array pull exception.');
  }
}

async function createAccount() {
  const accountNumber = document.getElementById('adm-acc').value.trim();
  const customerName = document.getElementById('adm-name').value.trim();
  const pinStr = document.getElementById('adm-pin').value.trim();
  const balanceStr = document.getElementById('adm-bal').value.trim();

  if (!accountNumber || !customerName || !pinStr || !balanceStr) {
    return alert('All user creation string fields are explicit requirements.');
  }

  try {
    const res = await fetch(`${API_URL}/account`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accountNumber, customerName, pin: parseInt(pinStr), balance: parseFloat(balanceStr) })
    });

    if (res.ok) {
      alert('Data row committed securely to storage registers.');
      loadMasterLedger();
      document.getElementById('adm-acc').value = '';
      document.getElementById('adm-name').value = '';
      document.getElementById('adm-pin').value = '';
      document.getElementById('adm-bal').value = '';
    } else {
      const errorMsg = await res.text();
      alert(`Aborted execution matrix: ${errorMsg}`);
    }
  } catch (err) {
    alert('System registry IO writing pipeline anomaly.');
  }
}

async function applyMassInterest() {
  try {
    const res = await fetch(`${API_URL}/interest`, { method: 'POST' });
    if (res.ok) {
      alert('Compound periodic yield formulas calculated and distributed safely across accounts.');
      loadMasterLedger();
    }
  } catch (err) {
    alert('Computation tracking anomaly detected.');
  }
}
