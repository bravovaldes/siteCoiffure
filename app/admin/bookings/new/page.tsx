'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateBooking } from '@/features/bookings/hooks/useBookings';
import { useAdminServices } from '@/features/services/hooks/useServices';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const schema = z.object({
  customerName: z.string().min(2, 'Nom requis'),
  customerPhone: z.string().min(10, 'Téléphone invalide'),
  customerEmail: z.string().email('Email invalide').optional().or(z.literal('')),
  serviceId: z.string().min(1, 'Service requis'),
  date: z.string().min(1, 'Date requise'),
  startTime: z.string().min(1, 'Heure requise'),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function NewBookingPage() {
  const router = useRouter();
  const createBooking = useCreateBooking();
  const { data: services = [] } = useAdminServices();
  const active = services.filter((s) => s.active);

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const selectedId = watch('serviceId');
  const selectedService = active.find((s) => s.id === selectedId);
  const startTime = watch('startTime');

  const endTime = (() => {
    if (!startTime || !selectedService) return '';
    const [h, m] = startTime.split(':').map(Number);
    const t = h * 60 + m + selectedService.duration;
    return `${Math.floor(t / 60).toString().padStart(2, '0')}:${(t % 60).toString().padStart(2, '0')}`;
  })();

  const onSubmit = async (data: FormData) => {
    if (!selectedService) return;
    await createBooking.mutateAsync({
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail || undefined,
      customerId: data.customerPhone,
      serviceId: data.serviceId,
      serviceName: selectedService.name,
      servicePrice: selectedService.price,
      date: new Date(data.date),
      startTime: data.startTime,
      endTime,
      notes: data.notes,
    });
    router.push('/admin/bookings');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/admin/bookings" className="p-2 rounded-lg hover:bg-white">
          <ArrowLeft size={18} className="text-gray-500" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Nouvelle réservation</h1>
          <p className="text-sm text-gray-500">Créer une réservation manuellement</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Card title="Client">
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Nom complet *" error={errors.customerName?.message}>
              <input {...register('customerName')} placeholder="Jean Dupont" className={iCls} />
            </Field>
            <Field label="Téléphone *" error={errors.customerPhone?.message}>
              <input {...register('customerPhone')} placeholder="514-555-1234" className={iCls} />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Email (optionnel)" error={errors.customerEmail?.message}>
                <input {...register('customerEmail')} type="email" placeholder="jean@example.com" className={iCls} />
              </Field>
            </div>
          </div>
        </Card>

        <Card title="Service">
          <Field label="Choisir un service *" error={errors.serviceId?.message}>
            <select {...register('serviceId')} className={iCls + ' bg-white'}>
              <option value="">-- Sélectionner --</option>
              {active.map((s) => (
                <option key={s.id} value={s.id}>{s.name} – {s.duration} min – {s.price} $</option>
              ))}
            </select>
          </Field>
          {selectedService && (
            <div className="mt-3 rounded-lg bg-amber-50 p-3">
              <p className="text-sm font-medium text-amber-900">{selectedService.name}</p>
              <p className="text-[11px] text-amber-700">Durée : {selectedService.duration} min · Prix : {selectedService.price} $</p>
            </div>
          )}
        </Card>

        <Card title="Date & Heure">
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Date *" error={errors.date?.message}>
              <input {...register('date')} type="date" className={iCls} />
            </Field>
            <Field label="Heure *" error={errors.startTime?.message}>
              <input {...register('startTime')} type="time" className={iCls} />
            </Field>
          </div>
          {endTime && <p className="mt-2 text-sm text-gray-500">Fin estimée : <span className="font-medium text-gray-700">{endTime}</span></p>}
        </Card>

        <Card title="Notes">
          <textarea {...register('notes')} rows={3} placeholder="Notes internes (optionnel)" className={iCls} />
        </Card>

        {selectedService && startTime && (
          <div className="rounded-xl bg-white p-4 space-y-1.5 text-sm">
            <h3 className="font-semibold text-gray-900 text-[13px] mb-2">Récapitulatif</h3>
            <p className="text-gray-600">Service : <span className="font-medium text-gray-900">{selectedService.name}</span></p>
            <p className="text-gray-600">Durée : <span className="font-medium text-gray-900">{selectedService.duration} min</span></p>
            <p className="text-gray-600">Montant : <span className="font-medium text-gray-900">{selectedService.price} $</span></p>
            {endTime && <p className="text-gray-600">Horaire : <span className="font-medium text-gray-900">{startTime} – {endTime}</span></p>}
          </div>
        )}

        <div className="flex gap-3 justify-end">
          <Link href="/admin/bookings" className="px-4 py-2.5 text-sm font-medium text-gray-600 rounded-lg hover:bg-white">Annuler</Link>
          <button
            type="submit"
            disabled={isSubmitting || createBooking.isPending}
            className="px-5 py-2.5 text-sm font-medium text-white bg-amber-500 rounded-lg hover:bg-amber-600 disabled:opacity-50 transition-colors"
          >
            {createBooking.isPending ? 'Création...' : 'Créer'}
          </button>
        </div>
      </form>
    </div>
  );
}

const iCls = 'w-full rounded-lg bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 border-0';

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-white p-5">
      <h2 className="text-[13px] font-semibold text-gray-900 mb-3">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] font-medium text-gray-500 mb-1.5">{label}</label>
      {children}
      {error && <p className="text-[11px] text-red-500 mt-1">{error}</p>}
    </div>
  );
}
