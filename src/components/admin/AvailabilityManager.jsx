import { useState } from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa';

const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

export default function AvailabilityManager() {
  const [slots, setSlots] = useState([]);
  const [form, setForm] = useState({ day: 'Lun', start: '', end: '' });
  const [error, setError] = useState('');

  const validateSlot = () => {
    if (!form.start || !form.end) {
      setError("Veuillez remplir tous les champs.");
      return false;
    }
    if (form.start >= form.end) {
      setError("L'heure de fin doit être après l'heure de début.");
      return false;
    }
    const startH = parseInt(form.start.split(":")[0]);
    const endH = parseInt(form.end.split(":")[0]);
    if (endH - startH < 1) {
      setError("La durée doit être d'au moins 1 heure.");
      return false;
    }
    setError('');
    return true;
  };

  const addSlot = (e) => {
    e.preventDefault();
    if (!validateSlot()) return;
    setSlots([...slots, { ...form }]);
    setForm({ ...form, start: '', end: '' });
  };

  const deleteSlot = (index) => {
    const updated = [...slots];
    updated.splice(index, 1);
    setSlots(updated);
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-2xl">
      <h2 className="text-xl font-bold mb-4">Gestion des Disponibilités</h2>

      <form
        onSubmit={addSlot}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end mb-6"
      >
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Jour</label>
          <select
            value={form.day}
            onChange={(e) => setForm({ ...form, day: e.target.value })}
            className="border border-gray-300 rounded-md px-3 py-2"
          >
            {days.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Heure de début</label>
          <input
            type="time"
            value={form.start}
            onChange={(e) => setForm({ ...form, start: e.target.value })}
            className="border border-gray-300 rounded-md px-3 py-2"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Heure de fin</label>
          <input
            type="time"
            value={form.end}
            onChange={(e) => setForm({ ...form, end: e.target.value })}
            className="border border-gray-300 rounded-md px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Ajouter
        </button>
      </form>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {slots.length > 0 ? (
          slots.map((s, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-md border"
            >
              <div>
                <p className="font-semibold">{s.day}</p>
                <p className="text-sm text-gray-700">
                  {s.start} — {s.end}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => deleteSlot(i)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
                <button
                  className="text-gray-400 cursor-not-allowed"
                  disabled
                  title="Modification à venir"
                >
                  <FaEdit />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-full">
            Aucune disponibilité ajoutée.
          </p>
        )}
      </div>
    </div>
  );
}
