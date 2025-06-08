const mockCancels = [
  { id: 1, nom: 'Roger', service: 'Coupe', date: '10/06/25', heure: '11:00' },
  { id: 2, nom: 'Louise', service: 'Manucure', date: '11/06/25', heure: '15:00' },
];

export default function CancellationList() {
  return (
    <div className="p-4 bg-white rounded-2xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Annulations récentes</h2>

      {/* Table pour desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full text-sm border">
          <thead>
            <tr className="bg-gray-50 text-gray-600">
              <th className="px-4 py-2 text-left">Client</th>
              <th className="px-4 py-2 text-left">Service</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Heure</th>
            </tr>
          </thead>
          <tbody>
            {mockCancels.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="px-4 py-2">{c.nom}</td>
                <td className="px-4 py-2">{c.service}</td>
                <td className="px-4 py-2">{c.date}</td>
                <td className="px-4 py-2">{c.heure}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cartes pour mobile */}
      <div className="md:hidden flex flex-col gap-4">
        {mockCancels.map((c) => (
          <div key={c.id} className="p-4 border rounded-xl shadow-sm bg-gray-50">
            <h3 className="font-semibold text-lg mb-2">{c.nom}</h3>
            <p className="text-sm"><span className="font-medium">🧴 Service :</span> {c.service}</p>
            <p className="text-sm"><span className="font-medium">📅 Date :</span> {c.date}</p>
            <p className="text-sm"><span className="font-medium">🕘 Heure :</span> {c.heure}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
