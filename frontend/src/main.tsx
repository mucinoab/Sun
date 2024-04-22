import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App.tsx';
import NavBar from './components/NavBar.tsx';

import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NavBar />
    <App />
  </React.StrictMode>,
)
