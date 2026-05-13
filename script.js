const display = document.getElementById('display');
const history = document.getElementById('history');
const keys = document.querySelector('.keys');

const state = {
  current: '0',
  previous: '',
  operator: '',
  overwrite: false,
};

const formatResult = (value) => {
  if (!Number.isFinite(value)) {
    return 'Error';
  }

  const rounded = Math.round((value + Number.EPSILON) * 100000000) / 100000000;
  return rounded.toString();
};

const updateScreen = () => {
  display.textContent = state.current;
  history.textContent = state.previous && state.operator
    ? `${state.previous} ${state.operator}`
    : '';
};

const calculate = () => {
  const prev = Number(state.previous);
  const current = Number(state.current);

  if (!state.operator || Number.isNaN(prev) || Number.isNaN(current)) {
    return;
  }

  let result;

  switch (state.operator) {
    case '+':
      result = prev + current;
      break;
    case '-':
      result = prev - current;
      break;
    case '*':
      result = prev * current;
      break;
    case '/':
      result = current === 0 ? NaN : prev / current;
      break;
    default:
      return;
  }

  state.current = formatResult(result);
  state.previous = '';
  state.operator = '';
  state.overwrite = true;
};

const handleNumber = (value) => {
  if (state.current === 'Error') {
    state.current = '0';
  }

  if (state.overwrite) {
    state.current = value;
    state.overwrite = false;
    return;
  }

  state.current = state.current === '0' ? value : state.current + value;
};

const handleDecimal = () => {
  if (state.overwrite) {
    state.current = '0.';
    state.overwrite = false;
    return;
  }

  if (!state.current.includes('.')) {
    state.current += '.';
  }
};

const handleOperator = (value) => {
  if (state.operator && !state.overwrite) {
    calculate();
  }

  state.previous = state.current;
  state.operator = value;
  state.overwrite = true;
};

const clearAll = () => {
  state.current = '0';
  state.previous = '';
  state.operator = '';
  state.overwrite = false;
};

const deleteLast = () => {
  if (state.overwrite || state.current === 'Error') {
    state.current = '0';
    state.overwrite = false;
    return;
  }

  state.current = state.current.length > 1 ? state.current.slice(0, -1) : '0';
};

const convertPercent = () => {
  const current = Number(state.current);

  if (Number.isNaN(current)) {
    return;
  }

  state.current = formatResult(current / 100);
};

keys.addEventListener('click', (event) => {
  const button = event.target.closest('button');

  if (!button) {
    return;
  }

  const { action, value } = button.dataset;

  switch (action) {
    case 'number':
      handleNumber(value);
      break;
    case 'decimal':
      handleDecimal();
      break;
    case 'operator':
      handleOperator(value);
      break;
    case 'calculate':
      calculate();
      break;
    case 'clear':
      clearAll();
      break;
    case 'delete':
      deleteLast();
      break;
    case 'percent':
      convertPercent();
      break;
    default:
      return;
  }

  updateScreen();
});

window.addEventListener('keydown', (event) => {
  const { key } = event;

  if (/^[0-9]$/.test(key)) {
    handleNumber(key);
  } else if (key === '.') {
    handleDecimal();
  } else if (['+', '-', '*', '/'].includes(key)) {
    handleOperator(key);
  } else if (key === 'Enter' || key === '=') {
    event.preventDefault();
    calculate();
  } else if (key === 'Backspace') {
    deleteLast();
  } else if (key === 'Escape') {
    clearAll();
  } else if (key === '%') {
    convertPercent();
  } else {
    return;
  }

  updateScreen();
});

updateScreen();
