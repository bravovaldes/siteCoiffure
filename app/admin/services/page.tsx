'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  useAdminServices,
  useCreateService,
  useUpdateService,
  useToggleServiceActive,
  useDeleteService,
} from '@/features/services/hooks/useServices';
import { Service } from '@/shared/types';
import { Plus, Pencil, Trash2, X, Scissors } from 'lucide-react';

interface ServiceForm {
  name: string;
  description: string;
  duration: number;
  price: number;
  order: number;
  active: boolean;
}

export default function ServicesPage() {
  const { data: services = [], isLoading } = useAdminServices();
  const createMut = useCreateService();
  const updateMut = useUpdateService();
  const toggleMut = useToggleServiceActive();
  const deleteMut = useDeleteService();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ServiceForm>({
    defaultValues: { active: true, order: 0, name: '', duration: 60, price: 0, description: '' },
  });

  function openCreate() {
    setEditing(null);
    reset({ name: '', duration: 60, price: 0, description: '', order: services.length, active: true });
    setShowForm(true);
  }

  function openEdit(s: Service) {
    setEditing(s);
    reset({ name: s.name, duration: s.duration, price: s.price, description: s.description, order: s.order, active: s.active });
    setShowForm(true);
  }

  async function onSubmit(data: ServiceForm) {
    if (editing) {
      await updateMut.mutateAsync({ id: editing.id, data });
    } else {
      await createMut.mutateAsync(data);
    }
    setShowForm(false);
    reset();
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Services</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {services.length} service{services.length > 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-amber-600 transition-colors"
        >
          <Plus size={16} /> Nouveau
        </button>
      </div>

      <div className="rounded-xl bg-white overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="h-6 w-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : services.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <Scissors size={40} strokeWidth={1.2} />
            <p className="mt-3 font-medium">Aucun service</p>
            <p className="text-sm mt-1">Commencez par en créer un</p>
          </div>
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden md:block">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/70">
                    <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Service</th>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Durée</th>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Prix</th>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
                    <th className="px-5 py-3 text-right text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {services.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <p className="text-sm font-medium text-gray-900">{s.name}</p>
                        <p className="text-[11px] text-gray-400 line-clamp-1">{s.description}</p>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-gray-600">{s.duration} min</td>
                      <td className="px-5 py-3.5 text-sm font-semibold text-gray-900">{s.price} $</td>
                      <td className="px-5 py-3.5">
                        <button
                          onClick={() => toggleMut.mutate({ id: s.id, active: !s.active })}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                            s.active ? 'bg-emerald-400' : 'bg-gray-200'
                          }`}
                        >
                          <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${
                            s.active ? 'translate-x-[18px]' : 'translate-x-[3px]'
                          }`} />
                        </button>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex justify-end gap-1">
                          <button onClick={() => openEdit(s)} className="p-1.5 rounded-md text-gray-400 hover:text-amber-600 hover:bg-amber-50"><Pencil size={14} /></button>
                          <button onClick={() => { if (confirm('Supprimer ?')) deleteMut.mutate(s.id); }} className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div className="md:hidden divide-y divide-gray-50">
              {services.map((s) => (
                <div key={s.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{s.name}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">{s.description}</p>
                      <div className="flex items-center gap-3 mt-2 text-[11px]">
                        <span className="text-gray-600">{s.duration} min</span>
                        <span className="font-semibold text-gray-900">{s.price} $</span>
                        <span className={s.active ? 'text-emerald-600' : 'text-gray-400'}>{s.active ? 'Actif' : 'Inactif'}</span>
                      </div>
                    </div>
                    <div className="flex gap-1 ml-3">
                      <button onClick={() => openEdit(s)} className="p-2 rounded-md text-gray-400 hover:bg-gray-100"><Pencil size={14} /></button>
                      <button onClick={() => { if (confirm('Supprimer ?')) deleteMut.mutate(s.id); }} className="p-2 rounded-md text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-gray-900">{editing ? 'Modifier' : 'Nouveau service'}</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded-md hover:bg-gray-100"><X size={18} className="text-gray-400" /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Fld label="Nom *" error={errors.name?.message}>
                <input {...register('name', { required: 'Requis' })} placeholder="Coupe Homme" className={iCls} />
              </Fld>
              <Fld label="Description *" error={errors.description?.message}>
                <textarea {...register('description', { required: 'Requis' })} rows={2} placeholder="Description..." className={iCls} />
              </Fld>
              <div className="grid grid-cols-2 gap-3">
                <Fld label="Durée (min) *"><input {...register('duration', { required: true, valueAsNumber: true })} type="number" className={iCls} /></Fld>
                <Fld label="Prix ($) *"><input {...register('price', { required: true, valueAsNumber: true })} type="number" step="0.01" className={iCls} /></Fld>
              </div>
              <Fld label="Ordre"><input {...register('order', { valueAsNumber: true })} type="number" className={iCls} /></Fld>
              <div className="flex items-center gap-2">
                <input {...register('active')} type="checkbox" id="active" className="h-4 w-4 rounded text-amber-500 focus:ring-amber-500/20" />
                <label htmlFor="active" className="text-sm text-gray-700">Service actif</label>
              </div>
              <div className="flex gap-3 justify-end pt-3 border-t border-gray-50">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100">Annuler</button>
                <button type="submit" disabled={createMut.isPending || updateMut.isPending} className="px-4 py-2 text-sm font-medium text-white bg-amber-500 rounded-lg hover:bg-amber-600 disabled:opacity-50">{editing ? 'Enregistrer' : 'Créer'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const iCls = 'w-full rounded-lg bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 border-0';

function Fld({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] font-medium text-gray-500 mb-1.5">{label}</label>
      {children}
      {error && <p className="text-[11px] text-red-500 mt-1">{error}</p>}
    </div>
  );
}
