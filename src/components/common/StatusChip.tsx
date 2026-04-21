import { Chip } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';

interface StatusChipProps {
  label: string;
  type?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  variant?: 'filled' | 'outlined';
}

const colorMap = {
  success: { bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#10B981', borderColor: '#10B981' },
  warning: { bgcolor: 'rgba(255, 167, 38, 0.1)', color: '#FFA726', borderColor: '#FFA726' },
  error: { bgcolor: 'rgba(255, 77, 79, 0.05)', color: '#ff4d4f', borderColor: '#ff4d4f' },
  info: { bgcolor: 'rgba(67, 97, 238, 0.1)', color: '#4361ee', borderColor: '#4361ee' },
  neutral: { bgcolor: 'transparent', color: 'text.secondary', borderColor: 'rgba(255,255,255,0.2)' },
};

export const StatusChip = ({ label, type = 'neutral', variant = 'filled' }: StatusChipProps) => {
  const styles = colorMap[type];
  
  const sx: SxProps<Theme> = {
    fontWeight: 600,
    fontSize: '0.75rem',
    borderRadius: '4px',
    ...styles,
    ...(variant === 'outlined' ? { bgcolor: 'transparent' } : {})
  };

  return <Chip label={label} size="small" variant={variant} sx={sx} />;
};
