import { Box, Typography, Container, Card, CardContent } from '@mui/material';

export default function PropietariosPage() {
  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', mb: 1 }}>
          Gestión de Propietarios
        </Typography>
        <Typography color="text.secondary">Directorio de dueños/propietarios y sus inmuebles.</Typography>
      </Box>
      <Card sx={{ p: 2 }}>
        <CardContent>
          <Typography>Implementación de la lista de propietarios en progreso...</Typography>
        </CardContent>
      </Card>
    </Container>
  );
}
