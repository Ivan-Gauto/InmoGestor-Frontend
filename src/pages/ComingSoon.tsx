import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function ComingSoon() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <Box 
        sx={{ 
          textAlign: 'center', 
          p: 6, 
          borderRadius: 2, 
          border: '1px solid',
          borderColor: 'divider', 
          background: 'transparent', 
          boxShadow: 'none',
          position: 'relative',
          overflow: 'hidden'
        }}
      >

        
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 800, background: 'linear-gradient(90deg, #FFFFFF 0%, #A1A1AA 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Próximamente
          </Typography>
          
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, maxWidth: 500, mx: 'auto', lineHeight: 1.6 }}>
            Este módulo aún está en construcción. Actualmente, nos estamos centrando en perfeccionar los módulos de <strong>Contratos</strong> y <strong>Pagos</strong> para ofrecerte la mejor experiencia posible.
          </Typography>
          
          <Button 
            variant="contained" 
            onClick={() => navigate('/')} 
            sx={{ 
              borderRadius: 3, 
              px: 4, 
              py: 1.5, 
              textTransform: 'none', 
              fontWeight: 600,
              background: '#FFFFFF',
              color: '#000000',
              '&:hover': {
                background: '#E5E7EB'
              }
            }}
          >
            Volver al Inicio
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
