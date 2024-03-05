import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, lastValueFrom, map } from 'rxjs';
import { SegipDto, SegipRespDto } from '../../core/dto/segip.dto';
import { RespuestaService } from '../../../shared/services/respuesta.service';

@Injectable()
export class SegipService {
  constructor(
    private http: HttpService,
    private _respuesta: RespuestaService,
  ) {}
  async findBySegip(segip: SegipDto) {
    try {
      const complemento = segip.complento ? segip.complento : '';
      const data = await firstValueFrom(
        this.http.get(
          `http://servicio-segip.minsalud.gob.bo/api/persona/buscar_persona_segip?ci=${segip.numeroDocumento}&complemento=&${complemento}fechanacimiento=${segip.fechaNacimiento}`,
        ),
      );
      const newRespDto = new SegipRespDto();
      newRespDto.numeroDocumento = data.data.data.ci;
      newRespDto.fechaNacimiento = data.data.data.fechanacimiento;
      newRespDto.complemento = data.data.data.complemento;
      newRespDto.complementoVisible = data.data.data.complementovisible;
      newRespDto.nombres = data.data.data.nombres;
      newRespDto.primerApellido = data.data.data.primerapellido;
      newRespDto.segundoApellido = data.data.data.segundoapellido;
      newRespDto.direccion = data.data.data.direccion;
      if (data.data.data) {
        const dataPersona = await firstValueFrom(
            this.http.get(
              process.env.URL_RUES_APP+'/gabo-base-backend/api/v1/aut-persona/busca-persona/'+data.data.data.ci,
            ),
          );
          if(dataPersona.data.data == null){
            return this._respuesta.respuestaHttp(
              true,
              newRespDto,
              null,
              'Lista correcta',
            );
          }else{
            return this._respuesta.respuestaHttp(
              false,
              newRespDto,
              null,
              'La persona ya cuenta con usuario registrado',
            );
          }
      } else {
        return this._respuesta.respuestaHttp(
          false,
          null,
          null,
          'Registro no encontrado',
        );
      }
    } catch (e) {
      return this._respuesta.respuestaHttp(
        false,
        null,
        null,
        'Registro no encontrado',
      );
    }
  }
}
