export class RespuestaM {
  status: boolean;
  message: string;
  data: any;
  //error: string;

  constructor() {
    this.status = true;
    this.message = 'ok';
    this.data = null;
  }

  setAll(message: string, status: boolean, data: any) {
    this.message = message;
    this.status = status;
    this.data = data;
  }
}
/*export class RespuestaM {
  estado: boolean;
  mensaje: string[];
  datos: any;
  error: string;

  constructor() {
    this.estado = true;
    this.mensaje = [`Ok`];
    this.datos = null;
  }

  setAll(mensaje: string, estado: boolean, datos: any) {
    this.mensaje = [mensaje];
    this.estado = estado;
    this.datos = datos;
  }
}*/
