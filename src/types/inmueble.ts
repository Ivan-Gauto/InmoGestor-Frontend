export interface Inmueble {
  id?: string;
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