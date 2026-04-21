import { useState } from 'react';
import { Box, Typography, Card, CardContent, TextField, Button, Avatar, Alert, CircularProgress, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import HomeWorkIcon from '@mui/icons-material/HomeWorkOutlined';
import { useNavigate } from 'react-router-dom';
import { authService } from '../api/auth';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Dni: '',
    Password: '',
    ConfirmPassword: '',
    Nombre: '',
    Apellido: '',
    Email: '',
    RolNombre: 'Operador'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [roles, setRoles] = useState<{idRolUsuario: string, nombre: string}[]>([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await authService.getRoles();
        if (res.success && res.data) {
          setRoles(res.data);
          // Si hay roles, establecemos el primero como default si no hay uno
          if (res.data.length > 0 && !formData.RolNombre) {
            setFormData(prev => ({ ...prev, RolNombre: res.data[0].nombre }));
          }
        }
      } catch (err) {
        console.error("Error al cargar roles", err);
      }
    };
    fetchRoles();
  }, []);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | { value: unknown }>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!formData.Dni) {
      setError('El DNI es obligatorio');
      return;
    }
    if (!formData.Nombre) {
      setError('El nombre es obligatorio');
      return;
    }
    if (!formData.Apellido) {
      setError('El apellido es obligatorio');
      return;
    }
    if (!formData.Email) {
      setError('El email es obligatorio');
      return;
    }
    if (!formData.Password) {
      setError('La contraseña es obligatoria');
      return;
    }
    if (formData.Password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (formData.Password !== formData.ConfirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setIsLoading(true);

    const response = await authService.register({
      Dni: formData.Dni,
      Password: formData.Password,
      Nombre: formData.Nombre,
      Apellido: formData.Apellido,
      Email: formData.Email,
      RolNombre: formData.RolNombre
    });

    setIsLoading(false);

    if (response.success) {
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } else {
      setError(response.mensaje);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', p: 3 }}>
      <Card sx={{ maxWidth: 450, width: '100%', p: 2 }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 64, height: 64, mb: 2 }}>
            <HomeWorkIcon fontSize="large" />
          </Avatar>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
            Crear Cuenta
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
            Regístrate en InmoGestor
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
              Registro exitoso. Redirigiendo al login...
            </Alert>
          )}

          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <TextField 
              fullWidth 
              label="DNI" 
              variant="outlined" 
              margin="normal"
              value={formData.Dni}
              onChange={handleChange('Dni')}
            />
            <TextField 
              fullWidth 
              label="Nombre" 
              variant="outlined" 
              margin="normal"
              value={formData.Nombre}
              onChange={handleChange('Nombre')}
            />
            <TextField 
              fullWidth 
              label="Apellido" 
              variant="outlined" 
              margin="normal"
              value={formData.Apellido}
              onChange={handleChange('Apellido')}
            />
            <TextField 
              fullWidth 
              label="Email" 
              type="email"
              variant="outlined" 
              margin="normal"
              value={formData.Email}
              onChange={handleChange('Email')}
            />
            <FormControl fullWidth margin="normal">
                <InputLabel>Rol</InputLabel>
                <Select
                  value={formData.RolNombre}
                  label="Rol"
                  onChange={handleChange('RolNombre') as (e: unknown) => void}
                >
                  {roles.map((rol) => (
                    <MenuItem key={rol.idRolUsuario} value={rol.nombre}>
                      {rol.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            <TextField 
              fullWidth 
              label="Contraseña" 
              type="password" 
              variant="outlined" 
              margin="normal"
              value={formData.Password}
              onChange={handleChange('Password')}
            />
            <TextField 
              fullWidth 
              label="Confirmar Contraseña" 
              type="password" 
              variant="outlined" 
              margin="normal"
              value={formData.ConfirmPassword}
              onChange={handleChange('ConfirmPassword')}
              sx={{ mb: 2 }}
            />
            <Button 
              fullWidth 
              type="submit" 
              variant="contained" 
              color="primary"
              size="large"
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Registrarse'}
            </Button>
            <Button 
              fullWidth 
              variant="text" 
              sx={{ mt: 1 }}
              onClick={() => navigate('/login')}
            >
              ¿Ya tienes cuenta? Iniciar Sesión
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}