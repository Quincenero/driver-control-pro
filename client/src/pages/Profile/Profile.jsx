import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import styles from './Profile.module.css';

export default function Profile() {
  const { user, updateProfile, logout } = useAuth();
  const [formData, setFormData] = useState({
    lastName: '',
    phone: '',
    birthDate: '',
    vehicleModel: '',
    vehiclePlate: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const prevUserRef = useRef(user);

  useEffect(() => {
    if (user && user !== prevUserRef.current) {
      setFormData({
        lastName: user.lastName || '',
        phone: user.phone || '',
        birthDate: user.birthDate ? user.birthDate.split('T')[0] : '',
        vehicleModel: user.vehicleModel || '',
        vehiclePlate: user.vehiclePlate || '',
      });
      prevUserRef.current = user;
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await updateProfile(formData);
      setMessage('Perfil actualizado correctamente');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div>Cargando...</div>;

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileCard}>
        <h1>Mi Perfil</h1>
        <p>{user.email}</p>

        {message && <div className={styles.success}>{message}</div>}
        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Nombre</label>
            <input type="text" value={user.name} disabled />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="lastName">Apellido</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Apellido (opcional)"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="phone">Teléfono</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+123456789"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="birthDate">Fecha de nacimiento</label>
            <input
              type="date"
              id="birthDate"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="vehicleModel">Modelo de vehículo</label>
            <input
              type="text"
              id="vehicleModel"
              name="vehicleModel"
              value={formData.vehicleModel}
              onChange={handleChange}
              placeholder="Ej: Toyota Corolla"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="vehiclePlate">Placa</label>
            <input
              type="text"
              id="vehiclePlate"
              name="vehiclePlate"
              value={formData.vehiclePlate}
              onChange={handleChange}
              placeholder="ABC-1234"
            />
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </form>

        <button onClick={logout} className={styles.logoutBtn}>
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}