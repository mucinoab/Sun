import React from 'react';
import ReactDOM from 'react-dom/client';

import NavBar from './components/NavBar.tsx';
import Footer from './components/Footer.tsx';

import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import CardContainer from './components/dashboard/CardContainer.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NavBar />
    <CardContainer />
    <Footer />
  </React.StrictMode>,
)
