import { FaInfoCircle } from 'react-icons/fa';

export default function PolitiqueAnnulation() {
  return (
    <div className="bg-white border-l-4 border-[#1F60FF] shadow-md px-6 py-5 rounded-xl flex flex-col md:flex-row items-start gap-4 mx-4 md:mx-auto max-w-4xl mt-12 mb-12">
      <div className="text-[#1F60FF] text-2xl">
        <FaInfoCircle />
      </div>
      <div className="text-sm md:text-base text-[#111] leading-relaxed">
        <p className="font-semibold mb-2">📌 Politique d’annulation</p>
        <p>
          Veuillez annuler votre rendez-vous au moins <strong>24 heures à l'avance</strong> si vous ne pouvez plus venir.
        </p>
        <p className="mt-2">
          Cela permettra à d'autres clients de réserver ce créneau, et vous offrira la possibilité de <strong>reprogrammer ultérieurement</strong>.
        </p>
      </div>
    </div>
  );
}
