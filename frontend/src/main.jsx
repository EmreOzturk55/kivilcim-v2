import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import './App.css'
import './Module.css' /* <-- BU SATIR ŞART! */
import { playClick } from './utils';

document.addEventListener('click', (e) => {
  if (e.target.closest('button') || e.target.closest('.MenuCard') || e.target.closest('.SelectionCard') || e.target.closest('.CharCard')) {
    playClick();
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)