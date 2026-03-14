'use client';

import { useEffect, useState } from 'react';

/**
 * Hook pour debouncer une valeur
 * @param value - La valeur à debouncer
 * @param delay - Le délai en millisecondes (défaut: 500ms)
 * @returns La valeur debouncée
 *
 * @example
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearchTerm = useDebounce(searchTerm, 300);
 *
 * useEffect(() => {
 *   // Cette fonction ne sera appelée que 300ms après que l'utilisateur ait arrêté de taper
 *   searchAPI(debouncedSearchTerm);
 * }, [debouncedSearchTerm]);
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
