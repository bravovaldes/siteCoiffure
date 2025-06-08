import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PageAccueilClient from './components/PageAccueilClient';
import Navbar from './components/Navbar';
import PolitiqueAnnulation from './components/PolitiqueAnnulation';
import Temoignages from './components/Temoignages';
import WhatsAppButton from './components/WhatsAppButton';
import AdresseSalon from './components/AdresseSalon';
import Admin from './components/admin/Admin';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <AdresseSalon />
              <PageAccueilClient />
              <PolitiqueAnnulation />
              <Temoignages />
              <WhatsAppButton />
            </>
          }
        />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
