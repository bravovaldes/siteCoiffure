import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'


import PageAccueilClient from './components/PageAccueilClient';
import Navbar  from './components/Navbar';
import PolitiqueAnnulation from './components/PolitiqueAnnulation';
import Temoignages from './components/Temoignages';
import WhatsAppButton from './components/WhatsAppButton';
function App() {
  return (
    <div>
      <Navbar />
      <PageAccueilClient />
      <PolitiqueAnnulation />
      <Temoignages />
      <WhatsAppButton />
    </div>
  );
}


export default App;


