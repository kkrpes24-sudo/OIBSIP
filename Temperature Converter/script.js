// ===== DOM ELEMENTS =====
const tempInput  = document.getElementById('tempInput');
const convertBtn = document.getElementById('convertBtn');
const errorMsg   = document.getElementById('errorMsg');
const unitBadge  = document.getElementById('unitBadge');
const res1       = document.getElementById('res1');
const res2       = document.getElementById('res2');
const radioInputs = document.querySelectorAll('input[name="unit"]');

// ===== UNIT SYMBOLS =====
const symbols = { C: '°C', F: '°F', K: 'K' };

// ===== UPDATE UNIT BADGE ON RADIO CHANGE =====
radioInputs.forEach(radio => {
  radio.addEventListener('change', () => {
    unitBadge.textContent = symbols[radio.value];
    clearResults();
    clearError();
  });
});

// ===== CLEAR HELPERS =====
function clearError() {
  errorMsg.classList.remove('visible');
  tempInput.classList.remove('error');
}

function clearResults() {
  res1.classList.remove('visible');
  res2.classList.remove('visible');
}

// ===== CONVERSION LOGIC =====
function convert(value, fromUnit) {
  let celsius;

  // Convert input → Celsius first
  switch (fromUnit) {
    case 'C': celsius = value; break;
    case 'F': celsius = (value - 32) * 5 / 9; break;
    case 'K': celsius = value - 273.15; break;
  }

  return {
    C: celsius,
    F: celsius * 9 / 5 + 32,
    K: celsius + 273.15
  };
}

function formatVal(num) {
  return parseFloat(num.toFixed(2)).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

// ===== MAIN HANDLER =====
function handleConvert() {
  const raw  = tempInput.value.trim();
  const unit = document.querySelector('input[name="unit"]:checked').value;

  // Validate
  if (raw === '' || isNaN(Number(raw))) {
    errorMsg.classList.add('visible');
    tempInput.classList.add('error');
    clearResults();
    tempInput.focus();
    return;
  }

  clearError();

  const value  = parseFloat(raw);
  const result = convert(value, unit);

  // Build the two "other" units to display
  const others = Object.keys(symbols).filter(u => u !== unit);

  // Populate result cards
  const items = [res1, res2];
  others.forEach((u, i) => {
    const labelEl = items[i].querySelector('.res-label');
    const valueEl = items[i].querySelector('.res-value');
    labelEl.textContent = `${symbols[u]}  ·  ${u === 'C' ? 'Celsius' : u === 'F' ? 'Fahrenheit' : 'Kelvin'}`;
    valueEl.textContent = formatVal(result[u]) + ' ' + symbols[u];
  });

  // Animate in with slight stagger
  res1.classList.remove('visible');
  res2.classList.remove('visible');

  requestAnimationFrame(() => {
    setTimeout(() => res1.classList.add('visible'), 30);
    setTimeout(() => res2.classList.add('visible'), 130);
  });
}

// ===== EVENT LISTENERS =====
convertBtn.addEventListener('click', handleConvert);

tempInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') handleConvert();
});

tempInput.addEventListener('input', () => {
  clearError();
});