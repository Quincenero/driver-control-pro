import { useState, useMemo } from 'react';
import { useTrips } from '../../hooks/useTrips';
import {
  Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import {
  TrendingUp, DollarSign, Clock, Car, Fuel,
  Award, Calendar, ChevronRight, Zap, LayoutDashboard, Wrench
} from 'lucide-react';
import logoImg from '../../assets/logo.svg';
import styles from './Dashboard.module.css';

// 📊 DATOS MOCK (fallback si no hay API)
const MOCK_TRIPS = [
  { hora: '14:22', plataforma: 'UberX', ruta: 'Polanco → Condesa', distancia: '5.4 km', monto: 185.00 },
  { hora: '13:45', plataforma: 'Didi', ruta: 'Santa Fe → Aeropuerto', distancia: '22.1 km', monto: 420.50 },
  { hora: '12:10', plataforma: 'Taxi', ruta: 'Centro → Roma Norte', distancia: '3.8 km', monto: 95.00 },
  { hora: '11:30', plataforma: 'Cabify', ruta: 'Insurgentes → Satélite', distancia: '15.2 km', monto: 288.00 },
  { hora: '10:15', plataforma: 'UberX', ruta: 'Coyoacán → UNAM', distancia: '4.2 km', monto: 112.50 },
  { hora: '09:45', plataforma: 'Taxi', ruta: 'Zona Rosa → Polanco', distancia: '3.1 km', monto: 78.00 },
  { hora: '08:30', plataforma: 'Didi', ruta: 'Condesa → Santa Fe', distancia: '12.5 km', monto: 245.00 },
];

// 📊 Datos mock de gastos (estos no vienen de la API)
const MOCK_GASTOS = [
  { name: 'Combustible', value: 72 },
  { name: 'Comisión App', value: 20 },
  { name: 'Limpieza', value: 8 },
];

const COLORS = ['#4ade80', '#60a5fa', '#fbbf24'];

export default function Dashboard() {
  // 1️⃣ Obtener viajes desde la API
  const { trips, loading } = useTrips();

  // 2️⃣ Estado para el período seleccionado
  const [periodo, setPeriodo] = useState('hoy');

  // 3️⃣ Asegurar que datosMostrar siempre sea un array
  // Si trips tiene datos reales, úsalos; si no, usa MOCK_TRIPS (que sabemos que es array)
  const datosMostrar = Array.isArray(trips) && trips.length > 0
    ? trips
    : MOCK_TRIPS;

  // 4️⃣ Cálculo de estadísticas con useMemo
  const stats = useMemo(() => {
    const totalIngresos = datosMostrar.reduce((sum, t) => sum + (t.monto || 0), 0);
    const totalGastos = 845.20; // Valor fijo para pruebas (luego se conectará a API)
    const utilidad = totalIngresos - totalGastos;
    const viajes = datosMostrar.length;
    const promedio = viajes > 0 ? totalIngresos / viajes : 0;
    const tiempoEnLinea = '6h 45m';

    return { totalIngresos, totalGastos, utilidad, viajes, promedio, tiempoEnLinea };
  }, [datosMostrar]);

  // 5️⃣ Estado de carga
  if (loading) {
    return <div className={styles.dashboardContainer}>⏳ Cargando viajes...</div>;
  }

  // Si no hay viajes (y MOCK_TRIPS está vacío por algún motivo)
  if (datosMostrar.length === 0) {
    return <div className={styles.dashboardContainer}>📭 No hay viajes registrados.</div>;
  }

  // 6️⃣ Renderizado principal
  return (
    <div className={styles.dashboardContainer}>
      {/* ============ HEADER ============ */}
      <header className={styles.dashboardHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.logoContainer}>
            <img src={logoImg} alt="Driver Control Pro" style={{ height: 48 }} />
          </div>
          <div className={styles.conductorStatus}>
            <span className={`${styles.statusDot} ${styles.online}`}></span>
            <span className={styles.statusText}>Carlos Rodríguez</span>
            <span className={styles.statusBadge}>Online</span>
          </div>
        </div>
        <div className={styles.headerRight}>
          <button
            className={`${styles.periodBtn} ${periodo === 'hoy' ? styles.active : ''}`}
            onClick={() => setPeriodo('hoy')}
          >
            Hoy
          </button>
          <button
            className={`${styles.periodBtn} ${periodo === 'semana' ? styles.active : ''}`}
            onClick={() => setPeriodo('semana')}
          >
            Semana
          </button>
          <button
            className={`${styles.periodBtn} ${periodo === 'mes' ? styles.active : ''}`}
            onClick={() => setPeriodo('mes')}
          >
            Mes
          </button>
        </div>
      </header>

      {/* ============ MÉTRICAS ============ */}
      <div className={styles.metricsGrid}>
        {/* Tarjeta 1: Ingresos Brutos */}
        <div className={styles.metricCard}>
          <div className={styles.metricIcon} style={{ background: 'rgba(74, 222, 128, 0.15)' }}>
            <DollarSign size={22} color="#4ade80" />
          </div>
          <div className={styles.metricContent}>
            <span className={styles.metricLabel}>Ingresos Brutos Hoy</span>
            <span className={styles.metricValue}>${stats.totalIngresos.toFixed(2)}</span>
            <span className={`${styles.metricChange} ${styles.positive}`}>
              <TrendingUp size={14} />
              12.5% (vs ayer)
            </span>
          </div>
        </div>

        {/* Tarjeta 2: Gastos Totales */}
        <div className={styles.metricCard}>
          <div className={styles.metricIcon} style={{ background: 'rgba(251, 191, 36, 0.15)' }}>
            <Fuel size={22} color="#fbbf24" />
          </div>
          <div className={styles.metricContent}>
            <span className={styles.metricLabel}>Gastos Totales</span>
            <span className={styles.metricValue}>${stats.totalGastos.toFixed(2)}</span>
            <span className={styles.metricSub}>Gasolina: $600.00</span>
          </div>
        </div>

        {/* Tarjeta 3: Utilidad Neta */}
        <div className={styles.metricCard}>
          <div className={styles.metricIcon} style={{ background: 'rgba(96, 165, 250, 0.15)' }}>
            <TrendingUp size={22} color="#60a5fa" />
          </div>
          <div className={styles.metricContent}>
            <span className={styles.metricLabel}>Utilidad Neta</span>
            <span className={`${styles.metricValue} ${styles.positive}`}>${stats.utilidad.toFixed(2)}</span>
            <span className={styles.metricSub}>Margen: 65.5%</span>
          </div>
        </div>

        {/* Tarjeta 4: Viajes Realizados */}
        <div className={styles.metricCard}>
          <div className={styles.metricIcon} style={{ background: 'rgba(244, 63, 94, 0.15)' }}>
            <Clock size={22} color="#f43f5e" />
          </div>
          <div className={styles.metricContent}>
            <span className={styles.metricLabel}>Viajes Realizados</span>
            <span className={styles.metricValue}>{stats.viajes}</span>
            <span className={styles.metricSub}>Meta: 18 viajes/día</span>
          </div>
        </div>

        {/* Tarjeta 5: Promedio por Viaje */}
        <div className={styles.metricCard}>
          <div className={styles.metricIcon} style={{ background: 'rgba(168, 85, 247, 0.15)' }}>
            <Award size={22} color="#a855f7" />
          </div>
          <div className={styles.metricContent}>
            <span className={styles.metricLabel}>Promedio por Viaje</span>
            <span className={styles.metricValue}>${stats.promedio.toFixed(2)}</span>
            <span className={styles.metricSub}>Tiempo en línea: {stats.tiempoEnLinea}</span>
          </div>
        </div>

        {/* Tarjeta 6: Nivel de Energía */}
        <div className={styles.metricCard}>
          <div className={styles.metricIcon} style={{ background: 'rgba(52, 211, 153, 0.15)' }}>
            <Zap size={22} color="#34d399" />
          </div>
          <div className={styles.metricContent}>
            <span className={styles.metricLabel}>Nivel de Energía</span>
            <div className={styles.energyBar}>
              <div className={styles.energyFill} style={{ width: '85%' }}></div>
            </div>
            <span className={styles.metricSub}>85% - Modo Ahorro Activo</span>
          </div>
        </div>
      </div>

      {/* ============ DOS COLUMNAS: Viajes + Gráfico ============ */}
      <div className={styles.twoColumns}>
        {/* Columna 1: Tabla de viajes recientes */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>Últimos Viajes Registrados</h3>
            <button className={styles.seeAll}>
              Ver todos <ChevronRight size={16} />
            </button>
          </div>
          <div className={styles.tableResponsive}>
            <table className={styles.tripsTable}>
              <thead>
                <tr>
                  <th>Hora</th>
                  <th>Plataforma</th>
                  <th>Ruta</th>
                  <th>Distancia</th>
                  <th>Monto</th>
                </tr>
              </thead>
              <tbody>
                {datosMostrar.map((trip, idx) => (
                  <tr key={idx}>
                    <td>{trip.hora || 'N/A'}</td>
                    <td><span className={styles.platformTag}>{trip.plataforma || 'N/A'}</span></td>
                    <td>{trip.ruta || 'N/A'}</td>
                    <td>{trip.distancia || 'N/A'}</td>
                    <td className={styles.amount}>${(trip.monto || 0).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Columna 2: Gráfico de gastos + Estado del vehículo */}
        <div className={styles.card}>
          <h3>Distribución de Gastos</h3>
          <div className={styles.pieChartContainer}>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={MOCK_GASTOS}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                >
                  {MOCK_GASTOS.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => `${value}%`}
                  contentStyle={{ background: '#1a1a2e', border: '1px solid #2a2a3a', borderRadius: '8px' }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => <span style={{ color: '#c8d0d8', fontSize: '0.75rem' }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className={styles.vehicleStatus}>
            <div className={styles.statusItem}>
              <span className={styles.statusLabel}>Próximo Aceite</span>
              <span className={styles.statusValue}>2,450 km</span>
            </div>
            <div className={styles.statusItem}>
              <span className={styles.statusLabel}>Nivel Tanque</span>
              <span className={styles.statusValue}>85%</span>
            </div>
            <div className={styles.statusItem}>
              <span className={styles.statusLabel}>Estado Vehículo</span>
              <span className={`${styles.statusValue} ${styles.ok}`}>✓ Operativo</span>
            </div>
          </div>
        </div>
      </div>

      {/* ============ ACCIONES RÁPIDAS ============ */}
      <div className={styles.quickActions}>
        <button className={`${styles.actionBtn} ${styles.secondary}`}>
          <LayoutDashboard size={18} />
          Panel Principal
        </button>
        <button className={`${styles.actionBtn} ${styles.primary}`}>
          <Car size={18} />
          Nuevo Viaje
        </button>
        <button className={`${styles.actionBtn} ${styles.secondary}`}>
          <Fuel size={18} />
          Registrar Gasto
        </button>
        <button className={`${styles.actionBtn} ${styles.secondary}`}>
          <Calendar size={18} />
          Ver Reporte
        </button>
        <button className={`${styles.actionBtn} ${styles.secondary}`}>
          <Wrench size={18} />
          Mantenimiento
        </button>
      </div>
    </div>
  );
}