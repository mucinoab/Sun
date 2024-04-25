import React from 'react';
import ReactDOM from 'react-dom/client';

import NavBar from './components/NavBar.tsx';
import Footer from './components/Footer.tsx';
import SignUp from './components/SignUp.tsx';

import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NavBar />
    <SignUp />
    <Footer />
  </React.StrictMode>,
)
