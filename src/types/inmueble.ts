export interface Inmueble {
  idInmueble?: string;
  idDireccion: string;
  descripcion: string;
  estado?: string;
  fechaCreacion?: string;
  idPersonaPropietario: string;
  idRolClientePropietario: string;
  disponibilidad: boolean;
  idTipoInmueble: string;
  direccion?: string;
  propietarioNombreCompleto?: string;
}