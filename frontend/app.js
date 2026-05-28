const API_URL = 'https://javaproject-1i9k.onrender.com/api/bank';

let currentSessionUser = null;

window.addEventListener('DOMContentLoaded', () => {
  goHome();
});

function goHome() {
  currentSessionUser = null;

  document.getElementById('login-view').classList.remove('hidden');
  document.getElementById('dashboard-view').classList.add('hidden');

  document.getElementById('login-acc').value = '';
  document.getElementById('login-pin').value = '';
}

function switchPortal(type) {
  if(type === 'user') {
    goHome();
  }

  if(type === 'admin') {
    const pass = prompt('Enter Admin Passkey');

    if(pass === 'admin') {
      alert('Admin Portal Connected');
    } else {
      alert('Invalid Admin Key');
    }
  }
}

async function handleUserLogin() {

  const accountNumber =
    document.getElementById('login-acc').value.trim();

  const pin =
    document.getElementById('login-pin').value.trim();

  if(!accountNumber || !pin) {
    return alert('Enter login credentials');
  }

  try {

    const response = await fetch(`${API_URL}/login`, {
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body: JSON.stringify({
        accountNumber,
        pin
      })
    });

    if(response.ok) {

      currentSessionUser = await response.json();

      currentSessionUser.pin = pin;

      loadDashboard();

    } else {
      alert('Invalid credentials');
    }

  } catch(error) {
    alert('Server connection failed');
  }

}

function loadDashboard() {

  document.getElementById('login-view').classList.add('hidden');
  document.getElementById('dashboard-view').classList.remove('hidden');

  document.getElementById('user-name').innerText =
    currentSessionUser.customerName;

  document.getElementById('balance').innerText =
    `₹${currentSessionUser.balance.toLocaleString('en-IN')}`;

  loadTransactions();

}

function loadTransactions() {

  const history =
    document.getElementById('tx-history');

  history.innerHTML = '';

  if(
    !currentSessionUser.transactionHistory ||
    currentSessionUser.transactionHistory.length === 0
  ) {

    history.innerHTML = `
      <div class="glass rounded-2xl p-4 text-slate-400">
        No transactions available
      </div>
    `;

    return;
  }

  [...currentSessionUser.transactionHistory]
  .reverse()
  .forEach(tx => {

    const card = document.createElement('div');

    card.className =
      'glass rounded-2xl p-4 flex items-center justify-between';

    card.innerHTML = `
      <div>
        <p class="font-medium text-white">
          ${tx}
        </p>

        <span class="text-xs text-slate-400">
          Transaction Processed
        </span>
      </div>

      <div class="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-xl">
        💰
      </div>
    `;

    history.appendChild(card);

  });

}

async function executeTx(type) {

  const amount =
    parseFloat(document.getElementById('tx-amount').value);

  if(isNaN(amount) || amount <= 0) {
    return alert('Enter valid amount');
  }

  try {

    const response = await fetch(`${API_URL}/${type}`, {

      method:'POST',

      headers:{
        'Content-Type':'application/json'
      },

      body: JSON.stringify({
        accountNumber: currentSessionUser.accountNumber,
        amount: amount
      })

    });

    if(response.ok) {

      refreshUser();

      document.getElementById('tx-amount').value = '';

    } else {

      const msg = await response.text();

      alert(msg);

    }

  } catch(error) {

    alert('Transaction failed');

  }

}

async function refreshUser() {

  const response = await fetch(`${API_URL}/login`, {

    method:'POST',

    headers:{
      'Content-Type':'application/json'
    },

    body: JSON.stringify({
      accountNumber: currentSessionUser.accountNumber,
      pin: currentSessionUser.pin
    })

  });

  currentSessionUser = await response.json();

  loadDashboard();

}

function logout() {
  goHome();
}
