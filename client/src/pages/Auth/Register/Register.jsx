// src/pages/Register/Register.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Register.module.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [localError, setLocalError] = useState('');
  const { register, error: authError } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    // Validaciones básicas
    if (!formData.name || !formData.email || !formData.password) {
      setLocalError('Todos los campos son obligatorios');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setLocalError('Las contraseñas no coinciden');
      return;
    }
    if (formData.password.length < 6) {
      setLocalError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    const result = await register(formData.name, formData.email, formData.password);
    if (result.success) {
      navigate('/profile');
    } else {
      setLocalError(result.message);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2>Registro</h2>
        {(localError || authError) && (
          <div className={styles.error}>{localError || authError}</div>
        )}
        <div className={styles.inputGroup}>
          <label>Nombre de usuario</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Tu nombre"
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="tu@email.com"
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label>Contraseña</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Mínimo 6 caracteres"
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label>Confirmar contraseña</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Repite la contraseña"
            required
          />
        </div>
        <button type="submit" className={styles.button}>Registrarse</button>
        <p className={styles.loginLink}>
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;