export interface Contrato {
  id: number;
  inquilino: string;
  dniInquilino: string;
  direccion: string;
  inmueble: string;
  precioCuota: number;
  cantCuotas: number;
  fechaInicio: string;
  fechaFin: string;
  moraMensual: number;
  moraDiaria: number;
  moraDiariaMonto: number;
  estado: number;
}

export interface CrearContratoRequest {
  fechaInicio: string;
  fechaFin: string;
  cantidadCuotas: number;
  precioCuota: number;
  tasaMoraMensual: number;
  condiciones: string;
  inmuebleId: number;
  dniInquilino: string;
  rolInquilinoId: number;
  usuarioCreador: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  mensaje?: string;
  error?: string;
  count?: number;
}

export interface Kpis {
  total: number;
  activos: number;
  porVencer: number;
}
