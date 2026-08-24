// src/pages/Profile/Profile.jsx
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import styles from './Profile.module.css';

const Profile = () => {
  const { user, updateProfile, logout } = useAuth();
  const [formData, setFormData] = useState({
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    birthDate: user?.birthDate || '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await updateProfile(formData);
    setMessage(result.success ? 'Perfil actualizado ✅' : result.message);
  };

  if (!user) return <div>Cargando...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.profileCard}>
        <h2>Mi Perfil</h2>
        <p><strong>Usuario:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <hr />
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label>Apellido</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Tu apellido"
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Teléfono</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+34 600 000 000"
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Fecha de nacimiento</label>
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
            />
          </div>
          {message && <div className={styles.message}>{message}</div>}
          <button type="submit" className={styles.button}>Actualizar perfil</button>
        </form>
        <button onClick={logout} className={styles.logoutButton}>Cerrar sesión</button>
      </div>
    </div>
  );
};

export default Profile;