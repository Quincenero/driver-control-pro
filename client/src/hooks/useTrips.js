// client/src/hooks/useTrips.js
import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

export const useTrips = (periodo = 'hoy') => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setLoading(true);
        const response = await api.get('/trips', {
          params: { periodo } // enviar filtro al backend
        });
        setTrips(response.data.trips);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Error al cargar viajes');
        // En caso de error, puedes optar por usar MOCK_TRIPS como fallback
        setTrips([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [periodo]); // se ejecuta cada vez que cambia el período

  return { trips, loading, error };
};