import { Box, Typography, Container, Card, CardContent } from '@mui/material';

export default function InmueblesPage() {
  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', mb: 1 }}>
          Gestión de Inmuebles
        </Typography>
        <Typography color="text.secondary">Propiedades disponibles y alquiladas del sistema.</Typography>
      </Box>
      <Card sx={{ p: 2 }}>
        <CardContent>
          <Typography>Implementación de la lista de inmuebles en progreso...</Typography>
        </CardContent>
      </Card>
    </Container>
  );
}
