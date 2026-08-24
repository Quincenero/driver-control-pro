import Trip from '../models/Trip.js';

// -------------------------------------------
// @desc    Obtener viajes del usuario autenticado
// @route   GET /api/trips
// @query   periodo: 'hoy' | 'semana' | 'mes' (opcional)
// -------------------------------------------
export const getTrips = async (req, res, next) => {
  try {
    const { periodo } = req.query;
    let fechaInicio = new Date();
    fechaInicio.setHours(0, 0, 0, 0);

    if (periodo === 'semana') {
      fechaInicio = new Date();
      fechaInicio.setDate(fechaInicio.getDate() - 7);
      fechaInicio.setHours(0, 0, 0, 0);
    } else if (periodo === 'mes') {
      fechaInicio = new Date();
      fechaInicio.setMonth(fechaInicio.getMonth() - 1);
      fechaInicio.setHours(0, 0, 0, 0);
    }
    // si es 'hoy' o no se especifica, filtramos desde hoy a las 00:00

    const trips = await Trip.find({
      user: req.user.id,
      fecha: { $gte: fechaInicio },
    }).sort({ fecha: -1 }).limit(50); // últimos 50 viajes

    res.status(200).json({
      success: true,
      count: trips.length,
      trips,
    });
  } catch (error) {
    next(error);
  }
};

// -------------------------------------------
// @desc    Crear un nuevo viaje
// @route   POST /api/trips
// -------------------------------------------
export const createTrip = async (req, res, next) => {
  try {
    const { hora, plataforma, ruta, distancia, monto, fecha, duracion, calificacion } = req.body;

    const trip = await Trip.create({
      user: req.user.id,
      hora,
      plataforma,
      ruta,
      distancia,
      monto,
      fecha: fecha || Date.now(),
      duracion,
      calificacion,
    });

    res.status(201).json({
      success: true,
      trip,
    });
  } catch (error) {
    next(error);
  }
};

// -------------------------------------------
// @desc    Obtener estadísticas resumidas (para el Dashboard)
// @route   GET /api/trips/stats
// -------------------------------------------
export const getTripStats = async (req, res, next) => {
  try {
    const { periodo } = req.query;
    let fechaInicio = new Date();
    fechaInicio.setHours(0, 0, 0, 0);

    if (periodo === 'semana') {
      fechaInicio.setDate(fechaInicio.getDate() - 7);
    } else if (periodo === 'mes') {
      fechaInicio.setMonth(fechaInicio.getMonth() - 1);
    }

    const trips = await Trip.find({
      user: req.user.id,
      fecha: { $gte: fechaInicio },
    });

    const totalIngresos = trips.reduce((sum, t) => sum + t.monto, 0);
    const totalViajes = trips.length;
    const promedio = totalViajes > 0 ? totalIngresos / totalViajes : 0;

    // Aquí podrías agregar más estadísticas (por plataforma, etc.)

    res.status(200).json({
      success: true,
      stats: {
        totalIngresos,
        totalViajes,
        promedio,
      },
    });
  } catch (error) {
    next(error);
  }
};