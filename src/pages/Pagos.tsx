import { useEffect, useState, useMemo } from 'react';
import { 
  Box, Typography, Container, Card, CardContent, TextField, InputAdornment, 
  Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Chip, IconButton, Tooltip, CircularProgress, Alert, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Snackbar,
  MenuItem, Select
} from '@mui/material';
import {
  Search as SearchIcon,
  ReceiptOutlined as ReceiptIcon,
  CancelOutlined as CancelIcon,
  PaymentOutlined as PaymentIcon,
  CloseOutlined as CloseIcon,
  PersonOutlined as PersonIcon,
  HomeWorkOutlined as HomeWorkIcon,
  EditOutlined as EditIcon,
  CalendarTodayOutlined as CalendarIcon,
  AttachMoneyOutlined as MoneyIcon,
  CheckCircleOutlined as ApproveIcon,
  RemoveCircleOutlined as RejectIcon
} from '@mui/icons-material';
import { pagosApi } from '../api/pagos';
import { contratosApi } from '../api/contratos';
import { inquilinosApi } from '../api/inquilinos';
import { useAuth } from '../context/AuthContext';
import type { Pago, CuotaParaPago, RegistrarPagoRequest } from '../types/pago';
import type { Contrato } from '../types/contrato';
import type { Inquilino } from '../types/inquilino';

const initialFormData: RegistrarPagoRequest = {
  contratoId: 0,
  cuotaId: 0,
  nroCuota: 0,
  montoTotal: 0,
  fechaPago: new Date().toISOString().split('T')[0],
  metodoPagoId: 1,
  moraCobrada: 0,
  otrosAdicionales: 0,
  descAdicionales: ''
};

export default function PagosPage() {
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filtering state
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  // Dialog state for confirming void
  const [anularDialog, setAnularDialog] = useState<{ open: boolean; id: number | null }>({ open: false, id: null });
  const [dialogLoading, setDialogLoading] = useState(false);

  // Dialog state for confirm/reject
  const [actionDialog, setActionDialog] = useState<{ open: boolean; id: number | null; action: 'confirmar' | 'rechazar' | null }>({ open: false, id: null, action: null });

  // Dialog state for registering payment
  const [registrarDialog, setRegistrarDialog] = useState(false);
  const [registrarLoading, setRegistrarLoading] = useState(false);
  const [formData, setFormData] = useState<RegistrarPagoRequest>(initialFormData);
  const [formError, setFormError] = useState<string | null>(null);
  
  const [selectedInquilino, setSelectedInquilino] = useState<string>('');
  const [otrosAdicionales, setOtrosAdicionales] = useState<number>(0);

  // Success snackbar
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({ open: false, message: '' });

  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [inquilinos, setInquilinos] = useState<Inquilino[]>([]);
  const [, setCuotasContrato] = useState<CuotaParaPago[]>([]);
  const [cuotaActiva, setCuotaActiva] = useState<CuotaParaPago | null>(null);

  const { canConfirmar, canRechazar, isOperador } = useAuth();

  const fetchPagos = async () => {
    try {
      setLoading(true);
      setError(null);
      const dataPagos = await pagosApi.listar();
      setPagos(dataPagos);
      const dataContratos = await contratosApi.listar();
      setContratos(dataContratos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar pagos');
    } finally {
      setLoading(false);
    }
  };

  const openRegistrarDialog = async () => {
    try {
      setLoading(true);
      const [dataInquilinos, dataContratos] = await Promise.all([
        inquilinosApi.listarConContratos(),
        contratosApi.listar()
      ]);
      setInquilinos(dataInquilinos);
      setContratos(dataContratos);
      setCuotasContrato([]);
      setCuotaActiva(null);
      setSelectedInquilino('');
      setFormData(initialFormData);
      setRegistrarDialog(true);
    } catch (err) {
      console.error('Error al cargar datos:', err);
      alert('Error al cargar datos. Intente de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPagos();
  }, []);

  const handleAnular = async () => {
    if (!anularDialog.id) return;
    try {
      setDialogLoading(true);
      await pagosApi.anular(anularDialog.id);
      setAnularDialog({ open: false, id: null });
      fetchPagos();
      setSnackbar({ open: true, message: 'Pago anulado exitosamente' });
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al anular pago');
    } finally {
      setDialogLoading(false);
    }
  };

  const handleConfirmar = async () => {
    if (!actionDialog.id) return;
    try {
      setDialogLoading(true);
      await pagosApi.confirmar(actionDialog.id);
      setActionDialog({ open: false, id: null, action: null });
      fetchPagos();
      setSnackbar({ open: true, message: 'Pago confirmado exitosamente' });
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al confirmar el pago');
    } finally {
      setDialogLoading(false);
    }
  };

  const handleRechazar = async () => {
    if (!actionDialog.id) return;
    try {
      setDialogLoading(true);
      await pagosApi.rechazar(actionDialog.id);
      setActionDialog({ open: false, id: null, action: null });
      fetchPagos();
      setSnackbar({ open: true, message: 'Pago rechazado' });
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al rechazar el pago');
    } finally {
      setDialogLoading(false);
    }
  };

  const handleRegistrarPago = async () => {
    setFormError(null);
    
    if (formData.contratoId <= 0) {
      setFormError('Debe seleccionar un contrato');
      return;
    }
    if (formData.cuotaId <= 0) {
      setFormError('Debe seleccionar una cuota');
      return;
    }
    if (totalPagar <= 0) {
      setFormError('El monto debe ser mayor a 0');
      return;
    }
    if (!formData.fechaPago) {
      setFormError('La fecha de pago es obligatoria');
      return;
    }

    const pagoFinal: RegistrarPagoRequest = {
      contratoId: formData.contratoId,
      cuotaId: formData.cuotaId,
      nroCuota: formData.nroCuota,
      montoTotal: totalPagar,
      fechaPago: formData.fechaPago,
      metodoPagoId: formData.metodoPagoId,
      moraCobrada: moraCalculada,
      otrosAdicionales: otrosAdicionales || 0,
      descAdicionales: ''
    };

    try {
      setRegistrarLoading(true);
      await pagosApi.registrar(pagoFinal);
      setRegistrarDialog(false);
      setFormData(initialFormData);
      fetchPagos();
      setSnackbar({ 
        open: true, 
        message: isOperador 
          ? 'Solicitud de pago enviada para aprobacion' 
          : 'Pago registrado y confirmado exitosamente' 
      });
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Error al registrar el pago');
    } finally {
      setRegistrarLoading(false);
    }
  };

  const filteredPagos = useMemo(() => {
    let result = pagos;

    // Filter by Tab (Pago estado: 0=Anulado, 1=Confirmado, 2=Solicitud)
    if (tabValue === 1) result = result.filter(p => p.estado === 2);
    else if (tabValue === 2) result = result.filter(p => p.estado === 1);
    else if (tabValue === 3) result = result.filter(p => p.estado === 0);

    // Filter by Search Term
    if (searchTerm) {
      const lowerSrc = searchTerm.toLowerCase();
      result = result.filter(p => 
        p.inquilino.toLowerCase().includes(lowerSrc) ||
        p.inmueble.toLowerCase().includes(lowerSrc) ||
        p.contratoId.toString().includes(lowerSrc)
      );
    }

    return result;
  }, [pagos, tabValue, searchTerm]);

  // Selected contrato logic
  const contratoActivo = useMemo(() => contratos.find(c => c.id === formData.contratoId), [contratos, formData.contratoId]);
  const importeBase = cuotaActiva ? cuotaActiva.importeBase : (contratoActivo ? contratoActivo.precioCuota : 0);
  const moraCalculada = cuotaActiva ? cuotaActiva.moraCalculada : 0;
  const totalPagar = importeBase + moraCalculada + (Number(otrosAdicionales) || 0);

  const resetDialogForm = () => {
    setRegistrarDialog(false);
    setFormData(initialFormData);
    setSelectedInquilino('');
    setOtrosAdicionales(0);
    setCuotaActiva(null);
    setFormError(null);
  };



  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', mb: 1 }}>
            Gestión de Pagos
          </Typography>
          <Typography color="text.secondary">
            Administra cobros, emite recibos y controla vencimientos.
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<PaymentIcon />}
          onClick={openRegistrarDialog}
          sx={{ borderRadius: '6px', px: 3, py: 1, bgcolor: '#fff', color: '#000', fontWeight: 600, boxShadow: 'none', '&:hover': { bgcolor: '#f0f0f0' } }}
        >
          Registrar Pago
        </Button>
      </Box>

      <Card sx={{ mb: 4, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', bgcolor: '#0A0A0A', boxShadow: 'none', borderRadius: 2 }}>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ p: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              placeholder="Buscar por inquilino, inmueble o ID de contrato..."
              variant="outlined"
              size="small"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
              sx={{ maxWidth: 400, '& fieldset': { border: 'none' } }}
            />
            <Select
              size="small"
              value={tabValue}
              onChange={(e) => setTabValue(e.target.value as number)}
              sx={{ minWidth: 150, borderRadius: 2, bgcolor: '#0A0A0A', border: '1px solid rgba(255,255,255,0.1)', '& fieldset': { border: 'none' } }}
            >
              <MenuItem value={0}>Todos</MenuItem>
              <MenuItem value={1}>Solicitudes</MenuItem>
              <MenuItem value={2}>Confirmados</MenuItem>
              <MenuItem value={3}>Anulados</MenuItem>
            </Select>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Box sx={{ p: 3 }}>
              <Alert severity="error">{error}</Alert>
            </Box>
          ) : (
            <TableContainer>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ pl: 4 }}>Inmueble</TableCell>
                    <TableCell>Inquilino</TableCell>
                    <TableCell align="center">Cuota</TableCell>
                    <TableCell>Vencimiento</TableCell>
                    <TableCell align="right">Monto</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell align="center" sx={{ pr: 4 }}>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredPagos.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} sx={{ textAlign: 'center', py: 10 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.5 }}>
                          <PaymentIcon sx={{ fontSize: 48, mb: 1.5 }} />
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>No hay pagos</Typography>
                          <Typography variant="body2" sx={{ mt: 0.5 }}>No se encontraron registros con estos filtros.</Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPagos.map((pago) => (
                      <TableRow key={pago.id} hover>
                        <TableCell sx={{ pl: 4 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{pago.inmueble || 'N/A'}</Typography>
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>{pago.inquilino}</TableCell>
                        <TableCell align="center">
                          <Chip label={`Cuota ${pago.nroCuota}`} size="small" variant="outlined" sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.primary">
                            {pago.fechaVencimiento.split('T')[0]}
                          </Typography>
                          {pago.fechaPago && (
                            <Typography variant="caption" color="text.secondary">
                              Pago: {pago.fechaPago.split('T')[0]}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                            ${pago.monto.toLocaleString('es-AR')}
                          </Typography>
                          {pago.mora > 0 && (
                            <Typography variant="caption" color="error.main">
                              + ${pago.mora.toLocaleString('es-AR')} mora
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          {pago.estado === 0 && <Chip label="Anulado" size="small" variant="outlined" sx={{ fontWeight: 600, color: '#ff4d4f', borderColor: 'rgba(255,77,79,0.5)' }} />}
                          {pago.estado === 1 && <Chip label="Confirmado" size="small" sx={{ fontWeight: 600, bgcolor: '#10B981', color: '#fff' }} />}
                          {pago.estado === 2 && <Chip label="Solicitud" size="small" sx={{ fontWeight: 600, bgcolor: '#FFA726', color: '#fff' }} />}
                        </TableCell>
                        <TableCell align="center" sx={{ pr: 4 }}>
                          {pago.estado === 1 && (
                            <>
                              <Tooltip title="Descargar Recibo">
                                <IconButton color="primary" sx={{ mr: 1, bgcolor: 'rgba(67, 97, 238, 0.1)' }}>
                                  <ReceiptIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Anular Pago">
                                <IconButton 
                                  color="error" 
                                  sx={{ bgcolor: 'rgba(239, 68, 68, 0.1)' }}
                                  onClick={() => setAnularDialog({ open: true, id: pago.id })}
                                >
                                  <CancelIcon />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                          {pago.estado === 2 && (canConfirmar || canRechazar) && (
                            <>
                              <Tooltip title="Confirmar Pago">
                                <IconButton 
                                  color="success" 
                                  sx={{ mr: 1, bgcolor: 'rgba(16, 185, 129, 0.1)' }}
                                  onClick={() => setActionDialog({ open: true, id: pago.id, action: 'confirmar' })}
                                >
                                  <ApproveIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Rechazar Solicitud">
                                <IconButton 
                                  color="error" 
                                  sx={{ bgcolor: 'rgba(239, 68, 68, 0.1)' }}
                                  onClick={() => setActionDialog({ open: true, id: pago.id, action: 'rechazar' })}
                                >
                                  <RejectIcon />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog for Anular */}
      <Dialog 
        open={anularDialog.open} 
        onClose={() => !dialogLoading && setAnularDialog({ open: false, id: null })}
        slotProps={{ paper: { sx: { borderRadius: 3, bgcolor: 'background.paper', p: 1 } } }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>Anular Pago</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro que deseas anular este pago? El estado volverá a pendiente y de ser necesario deberás emitir notas de crédito correspondientes si fue facturado electrónicamente.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button 
            onClick={() => setAnularDialog({ open: false, id: null })} 
            color="inherit" 
            disabled={dialogLoading}
            sx={{ fontWeight: 600 }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleAnular} 
            color="error" 
            variant="contained" 
            disabled={dialogLoading}
            sx={{ fontWeight: 600, px: 3, borderRadius: 2 }}
          >
            {dialogLoading ? <CircularProgress size={24} color="inherit" /> : 'Confirmar Anulación'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog for Confirm/Reject */}
      <Dialog 
        open={actionDialog.open} 
        onClose={() => !dialogLoading && setActionDialog({ open: false, id: null, action: null })}
        slotProps={{ paper: { sx: { borderRadius: 3, bgcolor: 'background.paper', p: 1 } } }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>
          {actionDialog.action === 'confirmar' ? 'Confirmar Pago' : 'Rechazar Solicitud'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {actionDialog.action === 'confirmar' 
              ? '¿Estás seguro que deseas confirmar este pago? Una vez confirmado, el pago quedará registrado como efectivo.'
              : '¿Estás seguro que deseas rechazar esta solicitud de pago? El pago volverá al estado pendiente.'}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button 
            onClick={() => setActionDialog({ open: false, id: null, action: null })} 
            color="inherit" 
            disabled={dialogLoading}
            sx={{ fontWeight: 600 }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={actionDialog.action === 'confirmar' ? handleConfirmar : handleRechazar} 
            color={actionDialog.action === 'confirmar' ? 'success' : 'error'} 
            variant="contained" 
            disabled={dialogLoading}
            sx={{ fontWeight: 600, px: 3, borderRadius: 2 }}
          >
            {dialogLoading ? <CircularProgress size={24} color="inherit" /> : (actionDialog.action === 'confirmar' ? 'Confirmar' : 'Rechazar')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for Registrar Pago */}
      <Dialog 
        open={registrarDialog} 
        onClose={() => !registrarLoading && resetDialogForm()}
        maxWidth="md"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: 3, bgcolor: 'background.paper', p: 1 } } }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 800 }}>
          Registrar pago
          <IconButton onClick={() => !registrarLoading && resetDialogForm()} size="small" sx={{ color: 'text.secondary' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ px: 4 }}>
          {formError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {formError}
            </Alert>
          )}

          <Box sx={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 3, mb: 3, mt: 1 }}>
            <Box>
              <Typography sx={{ mb: 1, fontWeight: 700, fontSize: '0.875rem' }}>Inquilino</Typography>
              <Select
                fullWidth
                size="small"
                value={selectedInquilino}
                onChange={(e) => {
                  const dni = e.target.value as string;
                  setSelectedInquilino(dni);
                  setFormData((prev: RegistrarPagoRequest) => ({ ...prev, contratoId: 0 }));
                }}
              >
                {inquilinos.map(inq => (
                  <MenuItem key={inq.dni} value={inq.dni}>
                    {inq.nombreCompleto}
                  </MenuItem>
                ))}
              </Select>
            </Box>
            <Box>
              <Typography sx={{ mb: 1, fontWeight: 700, fontSize: '0.875rem' }}>Contrato</Typography>
              <Select
                fullWidth
                size="small"
                disabled={!selectedInquilino}
                value={formData.contratoId || ''}
                onChange={async (e) => {
                  const cId = e.target.value as number;
                  
                  if (cId <= 0) {
                    setCuotasContrato([]);
                    setCuotaActiva(null);
                    setFormData(prev => ({ ...prev, contratoId: 0, cuotaId: 0, nroCuota: 0 }));
                    return;
                  }
                  
                  try {
                    const cuotasData = await pagosApi.obtenerCuotasPorContrato(cId);
                    setCuotasContrato(cuotasData);
                    
                    const cuotaPendiente = cuotasData.find(c => c.estado !== 2);
                    if (cuotaPendiente) {
                      setCuotaActiva(cuotaPendiente);
                      setFormData(prev => ({ 
                        ...prev, 
                        contratoId: cId, 
                        cuotaId: cuotaPendiente.cuotaId,
                        nroCuota: cuotaPendiente.nroCuota
                      }));
                    } else {
                      setCuotaActiva(null);
                      setFormData(prev => ({ ...prev, contratoId: cId, cuotaId: 0, nroCuota: 0 }));
                    }
                  } catch (err) {
                    console.error('Error al cargar cuotas:', err);
                    setCuotasContrato([]);
                    setCuotaActiva(null);
                  }
                }}
              >
                {!selectedInquilino ? (
                  <MenuItem value="" disabled>Seleccione un inquilino primero</MenuItem>
                ) : contratos
                  .filter(c => c.dniInquilino === selectedInquilino)
                  .length === 0 ? (
                  <MenuItem value="" disabled>Sin contratos para este inquilino</MenuItem>
                ) : (
                  contratos
                    .filter(c => c.dniInquilino === selectedInquilino)
                    .map(c => (
                      <MenuItem key={c.id} value={c.id}>
                        Contrato #{c.id} - {c.direccion || c.inmueble}
                      </MenuItem>
                    ))
                )}
              </Select>
            </Box>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography sx={{ mb: 1, fontWeight: 700, fontSize: '0.875rem' }}>Otros adicionales</Typography>
            <TextField
              size="small"
              fullWidth
              type="number"
              value={otrosAdicionales || ''}
              onChange={(e) => setOtrosAdicionales(parseFloat(e.target.value) || 0)}
            />
          </Box>

          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>Datos del pago</Typography>
            <Typography sx={{ color: 'error.main', fontWeight: 800, fontSize: '0.875rem', mb: 3 }}>
              ATENCION! verificar los datos antes de registrar el pago, en caso contrario debera anular y rehacer el mismo
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">Inquilino</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{contratoActivo?.inquilino || '-'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <HomeWorkIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">Propietario</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>-</Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 200 }}>
                  <EditIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">Nro. de cuota</Typography>
                  <TextField 
                    variant="standard" 
                    value={formData.nroCuota} 
                    slotProps={{ input: { readOnly: true, disableUnderline: true } }}
                    sx={{ width: 40, '& input': { p: 0, fontWeight: 700, fontSize: '0.875rem' } }}
                  />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">Vencimiento</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {cuotaActiva?.fechaVencimiento ? new Date(cuotaActiva.fechaVencimiento).toLocaleDateString('es-AR') : '-'}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 200 }}>
                  <CalendarIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">Periodo de cuota</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{cuotaActiva?.periodo || '-'}</Typography>
                </Box>
                <Chip 
                  label={cuotaActiva?.estado === 1 ? 'Vencida' : cuotaActiva?.estado === 2 ? 'Pagada' : 'Pendiente'} 
                  sx={{ 
                    bgcolor: cuotaActiva?.estado === 1 ? '#ff4d4f' : cuotaActiva?.estado === 2 ? '#10B981' : '#FFFF00', 
                    color: '#000', 
                    fontWeight: 800, 
                    borderRadius: 1 
                  }} 
                  size="small" 
                />
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <MoneyIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary" sx={{ minWidth: 150 }}>Importe base</Typography>
                <Typography variant="body2" sx={{ fontWeight: 800 }}>$ {importeBase.toLocaleString('es-AR')}</Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <MoneyIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary" sx={{ minWidth: 150 }}>Adicional por mora</Typography>
                <Typography variant="body2" sx={{ fontWeight: 800 }}>$ {moraCalculada.toLocaleString('es-AR')}</Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <MoneyIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary" sx={{ minWidth: 150 }}>Otros adicionales</Typography>
                <Typography variant="body2" sx={{ fontWeight: 800 }}>$ {(otrosAdicionales || 0).toLocaleString('es-AR')}</Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <MoneyIcon fontSize="small" color="action" />
                <Typography variant="body2" sx={{ minWidth: 150, color: 'text.secondary' }}>Total a pagar</Typography>
                <Typography variant="body2" sx={{ fontWeight: 800 }}>$ {totalPagar.toLocaleString('es-AR')}</Typography>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 4, pt: 2, display: 'flex', gap: 2 }}>
          <Button 
            onClick={handleRegistrarPago}
            color="primary" 
            variant="contained" 
            fullWidth
            disabled={registrarLoading}
            sx={{ fontWeight: 600, py: 1.5, opacity: 0.8 }}
          >
            {registrarLoading ? <CircularProgress size={24} color="inherit" /> : (isOperador ? 'Solicitar aprobacion' : 'Registrar pago')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ open: false, message: '' })}
        message={snackbar.message}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Container>
  );
}
