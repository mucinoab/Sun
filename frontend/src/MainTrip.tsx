import React from 'react';
import ReactDOM from 'react-dom/client';

import NavBar from './components/NavBar.tsx';
import Footer from './components/Footer.tsx';

import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Trip from './components/trip/Trip.tsx';

const tripId = (new URLSearchParams(window.location.search)).get("trip");

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NavBar />
    <Trip tripId={tripId} />
    <Footer />
  </React.StrictMode >,
)
