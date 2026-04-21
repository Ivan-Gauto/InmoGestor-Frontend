import { TextField, InputAdornment } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

interface SearchInputProps {
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
  maxWidth?: number | string;
}

export const SearchInput = ({ placeholder, value, onChange, maxWidth = 400 }: SearchInputProps) => (
  <TextField
    placeholder={placeholder}
    variant="outlined"
    size="small"
    fullWidth
    value={value}
    onChange={(e) => onChange(e.target.value)}
    slotProps={{
      input: {
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon color="action" fontSize="small" />
          </InputAdornment>
        ),
        sx: { borderRadius: 2, bgcolor: '#0A0A0A', border: '1px solid rgba(255,255,255,0.1)' }
      }
    }}
    sx={{ maxWidth, '& fieldset': { border: 'none' } }}
  />
);
