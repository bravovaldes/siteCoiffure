import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'


import PageAccueilClient from './components/PageAccueilClient';
import Navbar  from './components/Navbar';
import PolitiqueAnnulation from './components/PolitiqueAnnulation';
import Temoignages from './components/Temoignages';
import WhatsAppButton from './components/WhatsAppButton';
import AdresseSalon from './components/AdresseSalon';
function App() {
  return (
    <div>
      <Navbar />
      <AdresseSalon/>
      <PageAccueilClient />
      <PolitiqueAnnulation />
      <Temoignages />
      <WhatsAppButton />
    </div>
  );
}


export default App;


