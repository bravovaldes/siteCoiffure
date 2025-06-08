import { useState } from 'react';
import { FaQuoteLeft } from 'react-icons/fa';

const temoignagesInitial = [
  {
    nom: "Sarah K.",
    message: "Service au top ! Je suis ressortie ravie de ma coupe. Je recommande à 100%.",
    ville: "Montréal",
  },
  {
    nom: "Julien M.",
    message: "Accueil chaleureux, ambiance détendue et résultats impeccables.",
    ville: "Laval",
  },
  {
    nom: "Aminata D.",
    message: "Merci pour votre professionnalisme et votre écoute. Je reviendrai sans hésiter.",
    ville: "Longueuil",
  },
];

export default function Temoignages() {
  const [temoignages, setTemoignages] = useState(temoignagesInitial);
  const [current, setCurrent] = useState(0);
  const [formData, setFormData] = useState({ nom: '', message: '', ville: '' });

  const suivant = () => setCurrent((current + 1) % temoignages.length);
  const precedent = () => setCurrent((current - 1 + temoignages.length) % temoignages.length);

  const handleSubmit = (e) => {
    e.preventDefault();
    const nouveau = { ...formData };
    setTemoignages([...temoignages, nouveau]);
    setFormData({ nom: '', message: '', ville: '' });
    setCurrent(temoignages.length); // aller au dernier témoignage
  };

  return (
    <div className="bg-[#FAF9F6] py-12 px-4 md:px-10">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-[#1F60FF]">Témoignages</h2>

      {/* Slider Témoignage */}
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-2xl px-6 py-8 text-center relative">
        <FaQuoteLeft className="text-[#1F60FF] text-2xl mb-4 mx-auto" />
        <p className="text-[#333] text-sm md:text-base italic">"{temoignages[current].message}"</p>
        <p className="mt-4 font-semibold text-[#1F60FF]">{temoignages[current].nom}</p>
        <p className="text-xs text-[#777]">{temoignages[current].ville}</p>

        {/* Points de pagination */}
        <div className="mt-6 flex justify-center gap-2">
          {temoignages.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full ${
                index === current ? 'bg-[#1F60FF]' : 'bg-gray-300'
              } transition`}
            />
          ))}
        </div>

        
      </div>

      {/* Formulaire ajout de témoignage */}
      <div className="max-w-2xl mx-auto mt-12 bg-white border-l-4 border-[#1F60FF] rounded-xl p-6 shadow">
        <h3 className="text-xl font-bold mb-4 text-[#1F60FF]">Ajouter un témoignage</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Votre nom"
            className="w-full border rounded px-4 py-2"
            value={formData.nom}
            onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Votre ville"
            className="w-full border rounded px-4 py-2"
            value={formData.ville}
            onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
            required
          />
          <textarea
            placeholder="Votre message"
            className="w-full border rounded px-4 py-2 h-24"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            required
          />
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-[#1F60FF] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#174dcc] transition"
            >
              Soumettre
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
