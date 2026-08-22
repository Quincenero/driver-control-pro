import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import styles from './Register.module.css';

export default function Register() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  // Estado de validación de contraseña
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  const [nombreValid, setNombreValid] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(false);

  // Validar contraseña en tiempo real
  const validatePassword = (password) => {
    setPasswordChecks({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*()_+\-=[\]{};:'",.<>?/\\|]/.test(password),
    });
  };

  // Validar nombre en tiempo real
  const validateNombre = (nombre) => {
    setNombreValid(/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s0-9_-]{3,50}$/.test(nombre));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'password') {
      validatePassword(value);
      // Revalidar confirmación si existe
      if (formData.confirmPassword) {
        setPasswordsMatch(value === formData.confirmPassword && formData.confirmPassword.length > 0);
      }
    }
    if (name === 'nombre') {
      validateNombre(value);
    }
    if (name === 'confirmPassword') {
      setPasswordsMatch(value === formData.password && value.length > 0);
    }

    // Limpiar error del campo al escribir
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones finales
    const newErrors = {};
    if (!nombreValid) newErrors.nombre = 'Nombre inválido';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    const allChecks = Object.values(passwordChecks).every(Boolean);
    if (!allChecks) newErrors.password = 'La contraseña no cumple los requisitos';
    if (!passwordsMatch) newErrors.confirmPassword = 'Las contraseñas no coinciden';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await register({
        nombre: formData.nombre.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });
      navigate('/login', {
        state: { message: '✅ Cuenta creada exitosamente. Ahora inicia sesión.' },
      });
    } catch (err) {
      setErrors({
        general: err.response?.data?.error || 'Error al registrar. Intenta de nuevo.',
      });
    } finally {
      setLoading(false);
    }
  };

  const fulfilled = Object.values(passwordChecks).filter(Boolean).length;
  const total = Object.values(passwordChecks).length;

  return (
    <div className={styles.registerContainer}>
      <div className={styles.registerCard}>
        <div className={styles.header}>
          <h1>🚗 Driver Control Pro</h1>
          <p>Crea tu cuenta en segundos</p>
        </div>

        {errors.general && <div className={styles.error}>{errors.general}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Nombre */}
          <div className={styles.formGroup}>
            <label htmlFor="nombre">Nombre de usuario</label>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                placeholder="Ej: Carlos Rodríguez"
                className={`${styles.input} ${nombreValid ? styles.inputValid : formData.nombre ? styles.inputInvalid : ''}`}
              />
              {formData.nombre && (
                <span className={styles.inputIcon}>
                  {nombreValid ? '✅' : '❌'}
                </span>
              )}
            </div>
            {errors.nombre && <span className={styles.errorMessage}>{errors.nombre}</span>}
            <div className={styles.hint}>
              <span className={formData.nombre?.length >= 3 && formData.nombre?.length <= 50 ? styles.valid : styles.invalid}>
                {formData.nombre?.length >= 3 && formData.nombre?.length <= 50 ? '✅' : '❌'} 3-50 caracteres
              </span>
              <span className={/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s0-9_-]+$/.test(formData.nombre) ? styles.valid : styles.invalid}>
                {/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s0-9_-]+$/.test(formData.nombre) ? '✅' : '❌'} Solo letras, números, espacios y guiones
              </span>
            </div>
          </div>

          {/* Email */}
          <div className={styles.formGroup}>
            <label htmlFor="email">Correo electrónico</label>
            <div className={styles.inputWrapper}>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="correo@ejemplo.com"
                className={`${styles.input} ${/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ? styles.inputValid : formData.email ? styles.inputInvalid : ''}`}
              />
              {formData.email && (
                <span className={styles.inputIcon}>
                  {/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ? '✅' : '❌'}
                </span>
              )}
            </div>
            {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
          </div>

          {/* Contraseña */}
          <div className={styles.formGroup}>
            <label htmlFor="password">Contraseña</label>
            <div className={styles.inputWrapper}>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Mínimo 8 caracteres con mayúscula, número y especial"
                className={`${styles.input} ${fulfilled === total && formData.password ? styles.inputValid : formData.password ? styles.inputInvalid : ''}`}
              />
              {formData.password && (
                <span className={styles.inputIcon}>
                  {fulfilled === total ? '✅' : '⚠️'}
                </span>
              )}
            </div>
            {errors.password && <span className={styles.errorMessage}>{errors.password}</span>}

            <div className={styles.passwordRequirements}>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${(fulfilled / total) * 100}%` }}></div>
              </div>
              <ul>
                <li className={passwordChecks.length ? styles.valid : styles.invalid}>
                  {passwordChecks.length ? '✅' : '❌'} Mínimo 8 caracteres
                </li>
                <li className={passwordChecks.uppercase ? styles.valid : styles.invalid}>
                  {passwordChecks.uppercase ? '✅' : '❌'} Al menos una mayúscula (A-Z)
                </li>
                <li className={passwordChecks.lowercase ? styles.valid : styles.invalid}>
                  {passwordChecks.lowercase ? '✅' : '❌'} Al menos una minúscula (a-z)
                </li>
                <li className={passwordChecks.number ? styles.valid : styles.invalid}>
                  {passwordChecks.number ? '✅' : '❌'} Al menos un número (0-9)
                </li>
                <li className={passwordChecks.special ? styles.valid : styles.invalid}>
                  {passwordChecks.special ? '✅' : '❌'} Al menos un carácter especial (!@#$%^&*)
                </li>
              </ul>
            </div>
          </div>

          {/* Confirmar contraseña */}
          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">Confirmar contraseña</label>
            <div className={styles.inputWrapper}>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Repite la contraseña"
                className={`${styles.input} ${passwordsMatch ? styles.inputValid : formData.confirmPassword ? styles.inputInvalid : ''}`}
              />
              {formData.confirmPassword && (
                <span className={styles.inputIcon}>
                  {passwordsMatch ? '✅' : '❌'}
                </span>
              )}
            </div>
            {errors.confirmPassword && <span className={styles.errorMessage}>{errors.confirmPassword}</span>}
            {formData.confirmPassword && !passwordsMatch && (
              <span className={styles.errorMessage}>Las contraseñas no coinciden</span>
            )}
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        <div className={styles.footer}>
          <p>
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
}