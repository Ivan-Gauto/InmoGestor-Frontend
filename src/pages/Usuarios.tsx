import { Box, Typography, Container, Card, CardContent } from '@mui/material';

export default function UsuariosPage() {
  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', mb: 1 }}>
          Gestión de Usuarios
        </Typography>
        <Typography color="text.secondary">Control de acceso y cuentas de usuario internas.</Typography>
      </Box>
      <Card sx={{ p: 2 }}>
        <CardContent>
          <Typography>Implementación de la lista de usuarios en progreso...</Typography>
        </CardContent>
      </Card>
    </Container>
  );
}
