import { Box, Typography, Container, Card, CardContent } from '@mui/material';

export default function ReportesPage() {
  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', mb: 1 }}>
          Reportes y Estadísticas
        </Typography>
        <Typography color="text.secondary">Métricas, vacancia, estados de cuenta y morosos.</Typography>
      </Box>
      <Card sx={{ p: 2 }}>
        <CardContent>
          <Typography>Implementación de centro de reportes en progreso...</Typography>
        </CardContent>
      </Card>
    </Container>
  );
}
