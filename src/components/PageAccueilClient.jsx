import { useState } from 'react';
import logo from '../assets/logo.jpg';
import { FaRegClock, FaCut } from 'react-icons/fa';
import ImageSlider from './ImageSlider';
import { FaChevronRight } from 'react-icons/fa';

export default function PageAccueilClient() {
  const slots = [
    { id: 1, start: '10:00', end: '11:00', icon: <FaCut /> },
    { id: 2, start: '11:15', end: '12:15', icon: <FaRegClock /> },
    { id: 3, start: '13:00', end: '14:00', icon: <FaCut /> },
    { id: 4, start: '14:15', end: '15:15', icon: <FaRegClock /> },
  ];

  const daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  const todayIndex = new Date().getDay();
  const convertedIndex = todayIndex === 0 ? 6 : todayIndex - 1;

  const [selectedDay, setSelectedDay] = useState(convertedIndex);

  return (
    <div className="bg-[#FAF9F6] text-[#111] min-h-screen w-full px-4 md:px-10 pt-10 pb-10">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Slider d'images */}
        <ImageSlider />

        {/* Sélecteurs de dates */}
        <div className="flex justify-center">
          {/* Mobile */}
          <div className="flex flex-wrap gap-2 md:hidden">
            {['AUJOURD’HUI', 'DEMAIN', 'AUTRE'].map((label, i) => (
                <button
                key={i}
                className={`px-4 py-1.5 text-sm rounded-full font-medium border transition hover:scale-105
                    ${i === 0
                    ? 'bg-[#1F60FF] text-white shadow' // Actif : bien bleu
                    : 'bg-[#F0F0F0] text-gray-800 border-gray-300' // Inactifs : neutres
                    }`}
                >
                {label}
                </button>
            ))}
            </div>



          {/* Desktop */}
          <div className="hidden md:flex flex-wrap justify-center gap-3">
            {daysOfWeek.map((day, index) => (
              <button
                key={day}
                onClick={() => setSelectedDay(index)}
                className={`px-4 py-1.5 text-sm rounded-full font-medium border ${
                  selectedDay === index
                    ? 'bg-[#1F60FF] text-white shadow'
                    : 'bg-white text-[#1F60FF] border-[#1F60FF]'
                } transition hover:scale-105`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* Titre */}
        <h2 className="text-3xl md:text-4xl font-bold text-center">
          Créneaux disponibles
        </h2>

        <div className="space-y-6">
        {slots.map((slot) => (
            <div key={slot.id} className="flex justify-center">
            <div className="bg-white border-l-4 border-[#1F60FF] shadow-sm px-6 py-4 rounded-xl flex items-center justify-between w-full max-w-5xl gap-4">
                <div className="text-base md:text-lg font-medium">
                {slot.start} – {slot.end}
                </div>
                <button className="bg-[#1F60FF] text-white px-5 py-2 text-sm font-semibold rounded-full shadow hover:scale-105 hover:bg-[#174dcc] transition flex items-center gap-2 whitespace-nowrap">
                RÉSERVER <FaChevronRight size={14} />
                </button>
            </div>
            </div>
        ))}
        </div>


      </div>
    </div>
  );
}
