'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSettings, useUpdateSettings } from '@/features/settings/hooks/useSettings';
import { SalonSettings } from '@/shared/types';
import { Save, Store, MapPin, Clock, Share2 } from 'lucide-react';

const DAYS: { key: keyof SalonSettings['hours']; label: string }[] = [
  { key: 'monday', label: 'Lundi' },
  { key: 'tuesday', label: 'Mardi' },
  { key: 'wednesday', label: 'Mercredi' },
  { key: 'thursday', label: 'Jeudi' },
  { key: 'friday', label: 'Vendredi' },
  { key: 'saturday', label: 'Samedi' },
  { key: 'sunday', label: 'Dimanche' },
];

interface FormValues {
  salonName: string;
  phone: string;
  whatsappNumber: string;
  street: string;
  city: string;
  postalCode: string;
  facebook: string;
  instagram: string;
  hours: Record<string, { open: string; close: string; closed: boolean }>;
}

export default function SettingsPage() {
  const { data: settings, isLoading } = useSettings();
  const updateMut = useUpdateSettings();

  const { register, handleSubmit, reset, watch } = useForm<FormValues>();

  useEffect(() => {
    if (!settings) return;
    const hours: FormValues['hours'] = {};
    for (const d of DAYS) {
      const v = settings.hours[d.key];
      hours[d.key] = v === 'closed'
        ? { open: '09:00', close: '18:00', closed: true }
        : { open: v.open, close: v.close, closed: false };
    }
    reset({
      salonName: settings.salonName,
      phone: settings.phone,
      whatsappNumber: settings.whatsappNumber,
      street: settings.address.street,
      city: settings.address.city,
      postalCode: settings.address.postalCode,
      facebook: settings.socialMedia?.facebook || '',
      instagram: settings.socialMedia?.instagram || '',
      hours,
    });
  }, [settings, reset]);

  const watchHours = watch('hours');

  function onSubmit(data: FormValues) {
    const hours: SalonSettings['hours'] = {} as SalonSettings['hours'];
    for (const d of DAYS) {
      const h = data.hours[d.key];
      (hours as Record<string, unknown>)[d.key] = h.closed ? 'closed' : { open: h.open, close: h.close };
    }
    updateMut.mutate({
      salonName: data.salonName,
      phone: data.phone,
      whatsappNumber: data.whatsappNumber,
      address: { street: data.street, city: data.city, postalCode: data.postalCode },
      hours,
      socialMedia: { facebook: data.facebook || undefined, instagram: data.instagram || undefined },
    });
  }

  if (isLoading) {
    return (
      <div className="space-y-5 animate-pulse">
        <div className="h-7 w-48 bg-gray-200 rounded-lg" />
        <div className="h-48 bg-white rounded-xl" />
        <div className="h-48 bg-white rounded-xl" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-sm text-gray-500 mt-0.5">Configuration générale du salon</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* General */}
        <Card icon={<Store size={16} />} title="Informations générales">
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <Lbl>Nom du salon</Lbl>
              <input {...register('salonName')} className={iCls} />
            </div>
            <div>
              <Lbl>Téléphone</Lbl>
              <input {...register('phone')} className={iCls} />
            </div>
            <div>
              <Lbl>WhatsApp</Lbl>
              <input {...register('whatsappNumber')} className={iCls} />
            </div>
          </div>
        </Card>

        {/* Address */}
        <Card icon={<MapPin size={16} />} title="Adresse">
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="sm:col-span-3">
              <Lbl>Rue</Lbl>
              <input {...register('street')} className={iCls} />
            </div>
            <div className="sm:col-span-2">
              <Lbl>Ville</Lbl>
              <input {...register('city')} className={iCls} />
            </div>
            <div>
              <Lbl>Code postal</Lbl>
              <input {...register('postalCode')} className={iCls} />
            </div>
          </div>
        </Card>

        {/* Hours */}
        <Card icon={<Clock size={16} />} title="Horaires d'ouverture">
          <div className="space-y-2.5">
            {DAYS.map((d) => {
              const isClosed = watchHours?.[d.key]?.closed;
              return (
                <div key={d.key} className="flex items-center gap-3">
                  <span className="w-20 text-[13px] font-medium text-gray-700">{d.label}</span>
                  <label className="flex items-center gap-1.5 shrink-0">
                    <input
                      {...register(`hours.${d.key}.closed`)}
                      type="checkbox"
                      className="h-4 w-4 rounded text-amber-500 focus:ring-amber-500/20"
                    />
                    <span className="text-[11px] text-gray-500">Fermé</span>
                  </label>
                  {!isClosed && (
                    <div className="flex items-center gap-2">
                      <input {...register(`hours.${d.key}.open`)} type="time" className={iCls + ' !w-28'} />
                      <span className="text-[11px] text-gray-400">–</span>
                      <input {...register(`hours.${d.key}.close`)} type="time" className={iCls + ' !w-28'} />
                    </div>
                  )}
                  {isClosed && (
                    <span className="text-[11px] text-gray-400 italic">Fermé toute la journée</span>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Social */}
        <Card icon={<Share2 size={16} />} title="Réseaux sociaux">
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <Lbl>Facebook</Lbl>
              <input {...register('facebook')} placeholder="https://facebook.com/..." className={iCls} />
            </div>
            <div>
              <Lbl>Instagram</Lbl>
              <input {...register('instagram')} placeholder="https://instagram.com/..." className={iCls} />
            </div>
          </div>
        </Card>

        {/* Submit */}
        <div className="flex justify-end pt-1">
          <button
            type="submit"
            disabled={updateMut.isPending}
            className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-amber-600 disabled:opacity-50 transition-colors"
          >
            <Save size={16} />
            {updateMut.isPending ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  );
}

const iCls = 'w-full rounded-lg bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 border-0';

function Card({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-white p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
          {icon}
        </div>
        <h2 className="text-[13px] font-semibold text-gray-900">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Lbl({ children }: { children: React.ReactNode }) {
  return <label className="block text-[11px] font-medium text-gray-500 mb-1.5">{children}</label>;
}
