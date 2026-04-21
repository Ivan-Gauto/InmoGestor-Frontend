import { 
  Container, Typography, Box, Card, CardActionArea, Avatar
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PropertyIcon from '@mui/icons-material/HomeWorkOutlined';
import ContactsIcon from '@mui/icons-material/ContactsOutlined';
import ContractIcon from '@mui/icons-material/DescriptionOutlined';
import PaymentIcon from '@mui/icons-material/PaymentOutlined';
import AssessmentIcon from '@mui/icons-material/AssessmentOutlined';

const Dashboard = () => {
  const navigate = useNavigate();

  const shortcuts = [
    {
      title: 'Contratos',
      description: 'Gestione los contratos de alquiler vigentes y vencidos.',
      icon: <ContractIcon fontSize="large" />,
      path: '/contratos',
      color: '#4361EE'
    },
    {
      title: 'Inmuebles',
      description: 'Administre su catálogo de propiedades disponibles y ocupadas.',
      icon: <PropertyIcon fontSize="large" />,
      path: '/inmuebles',
      color: '#3A0CA3'
    },
    {
      title: 'Inquilinos',
      description: 'Consulte y gestione la información de su cartera de inquilinos.',
      icon: <ContactsIcon fontSize="large" />,
      path: '/inquilinos',
      color: '#4CC9F0'
    },
    {
      title: 'Pagos',
      description: 'Registre y verifique los pagos y cuotas de alquileres.',
      icon: <PaymentIcon fontSize="large" />,
      path: '/pagos',
      color: '#10B981'
    },
    {
      title: 'Propietarios',
      description: 'Administre los dueños de los inmuebles en cartera.',
      icon: <ContactsIcon fontSize="large" />,
      path: '/propietarios',
      color: '#F72585'
    },
    {
      title: 'Reportes',
      description: 'Métricas, proyecciones y estado general del negocio.',
      icon: <AssessmentIcon fontSize="large" />,
      path: '/reportes',
      color: '#F59E0B'
    }
  ];

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', pb: 8, pt: 4, bgcolor: 'background.default' }}>
      <Container maxWidth="xl">
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: 'text.primary' }}>
          Accesos Rápidos
        </Typography>

        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, 
          gap: 3 
        }}>
          {shortcuts.map((shortcut, index) => (
            <Box key={index}>
              <Card sx={{ 
                height: '100%', 
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: 'none',
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: shortcut.color,
                  bgcolor: 'action.hover'
                }
              }}>
                <CardActionArea 
                  onClick={() => navigate(shortcut.path)}
                  sx={{ height: '100%', p: 3, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start' }}
                >
                  <Avatar sx={{ bgcolor: `${shortcut.color}15`, color: shortcut.color, width: 64, height: 64, mb: 2 }}>
                    {shortcut.icon}
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                    {shortcut.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {shortcut.description}
                  </Typography>
                </CardActionArea>
              </Card>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default Dashboard;