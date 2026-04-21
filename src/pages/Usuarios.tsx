import { Container, Card, CardContent, Typography } from '@mui/material';
import { PageHeader } from '../components/common/PageHeader';

export default function UsuariosPage() {
  return (
    <Container maxWidth="xl">
      <PageHeader 
        title="Gestión de Usuarios" 
        subtitle="Control de acceso y cuentas de usuario internas." 
      />
      <Card sx={{ border: '1px solid rgba(255,255,255,0.1)', bgcolor: '#0A0A0A', borderRadius: 2 }}>
        <CardContent sx={{ py: 10, textAlign: 'center', opacity: 0.5 }}>
          <Typography variant="h6">Próximamente</Typography>
          <Typography variant="body2">El módulo de gestión de permisos está en desarrollo.</Typography>
        </CardContent>
      </Card>
    </Container>
  );
}
