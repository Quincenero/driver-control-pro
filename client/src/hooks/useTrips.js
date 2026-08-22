// src/hooks/useTrips.js
import { useState, useEffect } from 'react';
import axios from 'axios';

export function useTrips() {
  const [trips, setTrips] = useState([]); // ✅ Siempre un array
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/trips')
      .then(res => {
        // ✅ Si la respuesta no es un array, usa un array vacío
        setTrips(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error al cargar viajes:', err);
        setTrips([]); // ✅ En caso de error, array vacío
        setLoading(false);
      });
  }, []);

  return { trips, loading };
}