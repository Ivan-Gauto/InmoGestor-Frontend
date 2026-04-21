import { Box, Typography, Container, Card, CardContent } from '@mui/material';

export default function InquilinosPage() {
  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', mb: 1 }}>
          Gestión de Inquilinos
        </Typography>
        <Typography color="text.secondary">Administración de clientes/inquilinos del sistema.</Typography>
      </Box>
      <Card sx={{ p: 2 }}>
        <CardContent>
          <Typography>Implementación de la lista de inquilinos en progreso...</Typography>
        </CardContent>
      </Card>
    </Container>
  );
}
