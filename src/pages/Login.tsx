import { useState } from 'react';
import { Box, Typography, Card, CardContent, TextField, Button, Avatar, Alert, CircularProgress } from '@mui/material';
import HomeWorkIcon from '@mui/icons-material/HomeWorkOutlined';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [dni, setDni] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(dni, password);
    
    setIsLoading(false);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', p: 3 }}>
      <Card sx={{ maxWidth: 400, width: '100%', p: 2 }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 64, height: 64, mb: 2 }}>
            <HomeWorkIcon fontSize="large" />
          </Avatar>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
            InmoGestor
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
            Ingresa tus credenciales para acceder al sistema
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleLogin} style={{ width: '100%' }}>
            <TextField 
              fullWidth 
              label="DNI" 
              variant="outlined" 
              margin="normal"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              autoComplete="username"
            />
            <TextField 
              fullWidth 
              label="Contraseña" 
              type="password" 
              variant="outlined" 
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              sx={{ mb: 3 }}
            />
            <Button 
              fullWidth 
              type="submit" 
              variant="contained" 
              color="primary"
              size="large"
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Iniciar Sesión'}
            </Button>
            <Button 
              fullWidth 
              variant="text" 
              sx={{ mt: 1 }}
              onClick={() => navigate('/register')}
            >
              ¿No tienes cuenta? Regístrate
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
