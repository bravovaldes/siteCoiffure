import { FaTrash } from 'react-icons/fa';

const mockReservations = [
  { id: 1, nom: 'Sarah', service: 'Coupe', date: '12/06/25', heure: '10:00', tel: '514-123-4567' },
  { id: 2, nom: 'Julien', service: 'Barbe', date: '13/06/25', heure: '14:30', tel: '438-987-6543' },
  { id: 3, nom: 'Aminata', service: 'Coloration', date: '14/06/25', heure: '09:15', tel: '581-321-9999' },
];

export default function ReservationList() {
  const handleDelete = (id) => {
    alert(`Suppression de la réservation #${id} (fonctionnalité à implémenter)`);
  };

  return (
    <div className="p-4 bg-white rounded-2xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Réservations à venir</h2>

      {/* Table pour desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full text-sm border">
          <thead>
            <tr className="bg-gray-50 text-gray-600">
              <th className="px-4 py-2 text-left">Client</th>
              <th className="px-4 py-2 text-left">Téléphone</th>
              <th className="px-4 py-2 text-left">Service</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Créneau</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockReservations.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="px-4 py-2">{r.nom}</td>
                <td className="px-4 py-2">{r.tel}</td>
                <td className="px-4 py-2">{r.service}</td>
                <td className="px-4 py-2">{r.date}</td>
                <td className="px-4 py-2">{r.heure} – {addOneHour(r.heure)}</td>
                <td className="px-4 py-2 text-right">
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="text-red-500 hover:text-red-700"
                    title="Supprimer"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Version carte pour mobile */}
      <div className="md:hidden flex flex-col gap-4">
        {mockReservations.map((r) => (
          <div key={r.id} className="p-4 border rounded-xl shadow-sm bg-gray-50">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-lg">{r.nom}</h3>
              <button
                onClick={() => handleDelete(r.id)}
                className="text-red-500 hover:text-red-700"
                title="Supprimer"
              >
                <FaTrash />
              </button>
            </div>
            <p className="text-sm"><span className="font-medium">📞</span> {r.tel}</p>
            <p className="text-sm"><span className="font-medium">🧴 Service :</span> {r.service}</p>
            <p className="text-sm"><span className="font-medium">📅 Date :</span> {r.date}</p>
            <p className="text-sm"><span className="font-medium">🕘 Heure :</span> {r.heure} – {addOneHour(r.heure)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function addOneHour(timeStr) {
  const [h, m] = timeStr.split(":").map(Number);
  const newH = (h + 1) % 24;
  return `${newH.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}
