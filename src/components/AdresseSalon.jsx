import { FaMapMarkerAlt } from 'react-icons/fa';

export default function AdresseSalon() {
  return (
    <div className="bg-[#FAF9F6] mt-16 md:mt-20 px-4 py-2 md:px-8 md:py-3 shadow-sm">
  <div className="max-w-7xl mx-auto flex flex-col items-center justify-center text-center gap-3 md:gap-4">
    
    {/* Promo */}
    <div className="text-sm md:text-base text-gray-800 font-medium">
      🎁 Prenez un <span className="text-[#1F60FF] font-semibold">rendez-vous en ligne</span> et bénéficiez de <strong>10 % de réduction</strong>
    </div>

    {/* Adresse */}
    <div className="flex items-center justify-center gap-2 text-[#1F60FF] text-base md:text-lg">
      <FaMapMarkerAlt className="text-xl" />
      <span className="text-[#111] font-semibold">
        55 rue saint Luc, Chicoutimi
      </span>
    </div>

  </div>
</div>

  );
}
