// Calculator Logic
const display = document.getElementById('display');
const buttons = document.querySelectorAll('.button-grid button');
let currentInput = '';
let history = [];

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    const val = btn.textContent;
    if (btn.classList.contains('number') || val === '.') {
      currentInput += val;
      display.value = currentInput;
    } else if (btn.classList.contains('operator')) {
      currentInput += val;
      display.value = currentInput;
    } else if (btn.classList.contains('equals')) {
      try {
        const result = eval(currentInput);
        display.value = result;
        history.push(currentInput + ' = ' + result);
        currentInput = '' + result;
        showHistory();
      } catch {
        display.value = 'Error';
        currentInput = '';
      }
    } else if (btn.classList.contains('clear')) {
      currentInput = '';
      display.value = '';
    } else if (btn.classList.contains('scientific')) {
      // Example: sqrt of number
      try {
        const res = Math.sqrt(parseFloat(currentInput));
        display.value = res;
        history.push('√' + currentInput + ' = ' + res);
        currentInput = '' + res;
        showHistory();
      } catch {
        display.value = 'Error';
        currentInput = '';
      }
    }
  });
});

// Calculator History
function showHistory() {
  const histPane = document.getElementById('historyPane');
  histPane.innerHTML = history.slice(-5).map(h => `<div>${h}</div>`).join('');
  histPane.style.display = history.length ? 'block' : 'none';
}

// Keyboard Support
document.addEventListener('keydown', (e) => {
  if (/\d/.test(e.key) || '+-*/.'.includes(e.key)) {
    currentInput += e.key;
    display.value = currentInput;
  } else if (e.key === 'Enter') {
    try {
      const result = eval(currentInput);
      display.value = result;
      history.push(currentInput + ' = ' + result);
      currentInput = '' + result;
      showHistory();
    } catch {
      display.value = 'Error';
      currentInput = '';
    }
  } else if (e.key.toLowerCase() === 'c') {
    currentInput = '';
    display.value = '';
  } else if (e.key === 'Backspace') {
    currentInput = currentInput.slice(0, -1);
    display.value = currentInput;
  }
});

// Theme Toggle
document.getElementById('darkModeIcon').onclick = () =>
  document.body.className = 'theme-dark';
document.getElementById('lightModeIcon').onclick = () =>
  document.body.className = 'theme-light';
document.getElementById('glowing-background').onclick = () =>
  document.body.className = 'theme-glowing'; // Add retro theme to CSS 

// Currency API Integration (uses CoinGecko for demo)
const fiatDropdown = document.getElementById('fiatDropdown');
const cryptoDropdown = document.getElementById('cryptoDropdown');
const fiatPriceBox = document.getElementById('fiatPriceBox');
const cryptoPriceBox = document.getElementById('cryptoPriceBox');

function fetchPrices() {
  const fiat = fiatDropdown.value;
  const crypto = cryptoDropdown.value;

  // Crypto price
  fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${crypto}&vs_currencies=${fiat}`)
    .then(res => res.json())
    .then(data => {
      const price = data[crypto][fiat];
      cryptoPriceBox.textContent = price ? `${price} ${fiat.toUpperCase()}` : 'Error';
    }).catch(() => {
      cryptoPriceBox.textContent = 'Error';
    });

  // Fiat to USD/EUR using CoinGecko (for simplicity, shows USD/EUR value as "1")
  if (fiat === 'usd') {
    fiatPriceBox.textContent = "1 USD";
  } else if (fiat === 'eur') {
    fiatPriceBox.textContent = "1 EUR";
  }
}

// Fetch prices on selection change
fiatDropdown.onchange = fetchPrices;
cryptoDropdown.onchange = fetchPrices;

// Auto-refresh every 60 seconds
setInterval(fetchPrices, 60000);

// Initial fetch
fetchPrices();
