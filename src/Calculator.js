import React, { useState, useEffect, useCallback } from 'react';
import './Calculator.css';

const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [firstNum, setFirstNum] = useState(null);
  const [operation, setOperation] = useState(null);
  const [isNewInput, setIsNewInput] = useState(true);
  const [history, setHistory] = useState([]);
  const [theme, setTheme] = useState('dark');
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setTimeout(() => setLoaded(true), 100); 
  }, []);

  const getRandomResult = useCallback((num1, num2, op) => {
    let actualResult;
    switch (op) {
      case '+':
        actualResult = num1 + num2;
        break;
      case '-':
        actualResult = num1 - num2;
        break;
      case '×':
        actualResult = num1 * num2;
        break;
      case ':':
        actualResult = num2 !== 0 ? num1 / num2 : 'Error';
        break;
      case '^2':
        actualResult = num1 * num1;
        break;
      case '1/x':
        actualResult = num1 !== 0 ? 1 / num1 : 'Error';
        break;
      case '√':
        actualResult = num1 >= 0 ? Math.sqrt(num1) : 'Error';
        break;
      default:
        actualResult = 0;
    }

    if (actualResult === 'Error') return 'Error';

    let reasonableResult;
    if (Math.abs(actualResult) < 10) {
      const deviationOptions = [-2, -1, 1, 2];
      const deviation = deviationOptions[Math.floor(Math.random() * deviationOptions.length)];
      reasonableResult = actualResult + deviation;
      if (reasonableResult === actualResult) {
        reasonableResult = actualResult - deviation;
      }
    } else {
      let deviation = actualResult * 0.2 * (Math.random() * 2 - 1);
      if (Math.abs(deviation) < 0.1) {
        deviation = deviation >= 0 ? 0.1 : -0.1;
      }
      reasonableResult = actualResult + deviation;
    }

    const isDecimal = Math.random() < 0.2;
    return isDecimal
      ? Number(reasonableResult.toFixed(Math.floor(Math.random() * 3) + 1))
      : Math.round(reasonableResult);
  }, []);

  const calculate = useCallback(() => {
    if (firstNum === null || operation === null) return;

    const num1 = firstNum;
    const num2 = parseFloat(display) || 0;
    const absurdResult = getRandomResult(num1, num2, operation);

    setHistory([...history, `${num1} ${operation} ${num2} = ${absurdResult}`]);

    setDisplay(absurdResult.toString());
    setFirstNum(null);
    setOperation(null);
    setIsNewInput(true);
  }, [firstNum, operation, display, history, getRandomResult]);

  const handleNumber = useCallback(
    (num) => {
      if (isNewInput) {
        setDisplay(num);
        setIsNewInput(false);
      } else {
        setDisplay(display === '0' ? num : display + num);
      }
    },
    [display, isNewInput]
  );

  const handleOperation = useCallback(
    (op) => {
      if (firstNum === null) {
        setFirstNum(parseFloat(display));
        setOperation(op);
        setIsNewInput(true);
      } else {
        calculate();
        setOperation(op);
        setFirstNum(parseFloat(display));
        setIsNewInput(true);
      }
    },
    [firstNum, display, calculate]
  );

  const handleSquare = useCallback(() => {
    const num = parseFloat(display) || 0;
    const absurdResult = getRandomResult(num, num, '^2');
    setHistory([...history, `${num}² = ${absurdResult}`]);
    setDisplay(absurdResult.toString());
    setIsNewInput(true);
  }, [display, history, getRandomResult]);

  const handleInverse = useCallback(() => {
    const num = parseFloat(display) || 0;
    if (num === 0) {
      setDisplay('Error');
      return;
    }
    const absurdResult = getRandomResult(num, null, '1/x');
    setHistory([...history, `1/${num} = ${absurdResult}`]);
    setDisplay(absurdResult.toString());
    setIsNewInput(true);
  }, [display, history, getRandomResult]);

  const handleSquareRoot = useCallback(() => {
    const num = parseFloat(display) || 0;
    if (num < 0) {
      setDisplay('Error');
      return;
    }
    const absurdResult = getRandomResult(num, null, '√');
    setHistory([...history, `√${num} = ${absurdResult}`]);
    setDisplay(absurdResult.toString());
    setIsNewInput(true);
  }, [display, history, getRandomResult]);

  const handleClear = useCallback(() => {
    setDisplay('0');
    setFirstNum(null);
    setOperation(null);
    setIsNewInput(true);
  }, []);

  const handleClearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  }, []);

  useEffect(() => {
    const handleKeyPress = (e) => {
      const key = e.key;
      if (/[0-9]/.test(key)) {
        handleNumber(key);
      } else if (key === '.') {
        handleNumber('.');
      } else if (key === '+') {
        handleOperation('+');
      } else if (key === '-') {
        handleOperation('-');
      } else if (key === 'x' || key === '*') {
        handleOperation('×');
      } else if (key === ':' || key === '/') {
        handleOperation(':');
      } else if (key === 'Enter' || key === '=') {
        calculate();
      } else if (key === 'c' || key === 'C') {
        handleClear();
      } else if (key === '^') {
        handleSquare();
      } else if (key === 'i') {
        handleInverse();
      } else if (key === 'r') {
        handleSquareRoot();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleNumber, handleOperation, calculate, handleSquare, handleInverse, handleSquareRoot, handleClear]);

  return (
    <div className={`calculator-container ${theme} ${loaded ? 'loaded' : ''}`}>
      <h1 className="title">A Calculator That Is Never Right</h1>
      <button className="theme-toggle-button" onClick={toggleTheme}>
        Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode
      </button>
      <div className="calculator-wrapper">
        <div className="calculator">
          <div className="display">
            {operation && (
              <div className="operation-display">
                {firstNum} {operation}
              </div>
            )}
            <div className="main-display">{display}</div>
          </div>
          <div className="buttons">
            <button className="button clear" onClick={handleClear}>C</button>
            <button className="button function" onClick={handleSquare}>x²</button>
            <button className="button function" onClick={handleInverse}>1/x</button>
            <button className="button function" onClick={handleSquareRoot}>√</button>
            <button className="button" onClick={() => handleNumber('7')}>7</button>
            <button className="button" onClick={() => handleNumber('8')}>8</button>
            <button className="button" onClick={() => handleNumber('9')}>9</button>
            <button className="button operation" onClick={() => handleOperation(':')}>÷</button>
            <button className="button" onClick={() => handleNumber('4')}>4</button>
            <button className="button" onClick={() => handleNumber('5')}>5</button>
            <button className="button" onClick={() => handleNumber('6')}>6</button>
            <button className="button operation" onClick={() => handleOperation('×')}>×</button>
            <button className="button" onClick={() => handleNumber('1')}>1</button>
            <button className="button" onClick={() => handleNumber('2')}>2</button>
            <button className="button" onClick={() => handleNumber('3')}>3</button>
            <button className="button operation" onClick={() => handleOperation('-')}>-</button>
            <button className="button" onClick={() => handleNumber('0')}>0</button>
            <button className="button" onClick={() => handleNumber('.')}>.</button>
            <button className="button equals" onClick={calculate}>=</button>
            <button className="button operation" onClick={() => handleOperation('+')}>+</button>
          </div>
        </div>
        <div className="history">
          <h3>History</h3>
          <div className="history-content">
            {history.length === 0 ? (
              <p>No history</p>
            ) : (
              <ul>
                {history.map((entry, index) => (
                  <li key={index} className="history-item">
                    {entry}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button className="clear-history" onClick={handleClearHistory}>
            Clear History
          </button>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
