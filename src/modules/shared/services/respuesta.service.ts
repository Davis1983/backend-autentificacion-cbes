import { Injectable, Logger } from '@nestjs/common';
import { RespuestaM } from 'src/core/domain/models/respuesta.model';
@Injectable()
export class RespuestaService {
  logger = new Logger();
  respuesta = new RespuestaM();

  constructor() {}

  respuestaHttp(status: boolean, data: any, ruta = '', message = '') {
    this.respuesta.status = status;
    this.respuesta.data = data;
    this.respuesta.message = message;
    //this.logger.debug(this.respuesta.error + ruta);
    this.logger.debug(ruta);
    return this.respuesta;
  }

  /*respuestaHttp(estado: boolean, datos: any, ruta = '', mensaje = '') {
    this.respuesta.estado = estado;
    this.respuesta.datos = datos;
    this.respuesta.mensaje = [mensaje];
    this.logger.debug(this.respuesta.error + ruta);
    return this.respuesta;
  }*/
}
