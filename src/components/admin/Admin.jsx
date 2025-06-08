// src/pages/Admin.jsx
import { useState } from 'react';
import { FaCalendarAlt, FaUserCheck, FaBan } from 'react-icons/fa';
import AvailabilityManager from './AvailabilityManager';
import ReservationList from './ReservationList';
import CancellationList from './CancellationList';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('disponibilites');

  const tabs = [
    { id: 'disponibilites', label: 'Disponibilités', icon: <FaCalendarAlt /> },
    { id: 'reservations',   label: 'Réservations',   icon: <FaUserCheck /> },
    { id: 'annulations',    label: 'Annulations',    icon: <FaBan /> },
  ];

  return (
    <div className="min-h-screen w-screen bg-gray-100 p-4 md:px-10 md:py-8 text-gray-800">
      <h1 className="text-xl md:text-2xl font-semibold text-center mb-8">
        🎛️ Tableau de bord
      </h1>

      {/* Onglets */}
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-sm md:text-base border transition ${
              activeTab === tab.id
                ? 'bg-gray-800 text-white shadow'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Contenu */}
      <div className="bg-white w-full rounded-2xl shadow-md p-4 md:p-6">
        {activeTab === 'disponibilites' && <AvailabilityManager />}
        {activeTab === 'reservations'   && <ReservationList />}
        {activeTab === 'annulations'    && <CancellationList />}
      </div>
    </div>
  );
}
