export interface Pago {
  id: number;
  contratoId: number;
  cuotaId: number;
  inquilino: string;
  inmueble: string;
  nroCuota: number;
  periodo: string;
  fechaVencimiento: string;
  fechaPago?: string;
  monto: number;
  mora: number;
  diasAtraso: number;
  totalPagado: number;
  estado: number;
  estadoTexto: string;
}

export interface CuotaParaPago {
  cuotaId: string;
  nroCuota: number;
  periodo: string;
  fechaVencimiento: string;
  importeBase: number;
  tasaMoraMensual: number;
  diasAtraso: number;
  moraCalculada: number;
  totalAPagar: number;
  estado: number;
  estadoTexto: string;
}

export interface RegistrarPagoRequest {
  contratoId: string;
  cuotaId: string;
  nroCuota: number;
  montoTotal: number;
  fechaPago: string;
  metodoPagoId: string;
  moraCobrada: number;
  otrosAdicionales: number;
  descAdicionales: string;
}

export interface RegistrarPagoInternal {
  contratoId: number;
  cuotaId: number;
  nroCuota: number;
  montoTotal: number;
  fechaPago: string;
  metodoPagoId: number;
  moraCobrada: number;
  otrosAdicionales: number;
  descAdicionales: string;
}
