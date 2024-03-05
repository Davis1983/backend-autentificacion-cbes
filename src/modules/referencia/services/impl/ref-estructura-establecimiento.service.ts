import { Inject, Injectable } from '@nestjs/common';
import { RefEstructuraEstablecimientoRepository } from '../../repositories/impl/ref-estructura-establecimiento.repository';
import { Client } from 'pg';
import { RespuestaService } from '../../../shared/services/respuesta.service';
import {
  RefEstructuraEstablecimientoMapper_EntitiesToDtos,
  RefEstructuraEstablecimientoMMapper_EntitiesToDto,
} from '../../mapper/ref-estructura-establecimiento.mapper';
import { RespuestaM } from '../../../../core/domain/models/respuesta.model';

@Injectable()
export class RefEstructuraEstablecimientoService {
  _refEstructuraEstablecimientoRepository: RefEstructuraEstablecimientoRepository;
  _main = 'RefEstructuraEstablecimientoService';
  constructor(
    @Inject('PG') private _client: Client,
    private _respuestaService: RespuestaService,
  ) {
    this._refEstructuraEstablecimientoRepository =
      new RefEstructuraEstablecimientoRepository(_client);
  }

  async findAllDepartamentos(): Promise<RespuestaM> {
    const ruta = this._main + '->findAllDepartamentos';
    try {
      const data =
        await this._refEstructuraEstablecimientoRepository.findAllDepartamentos();
      
        if(data == null){
          return this._respuestaService.respuestaHttp(
            false,
            null,
            null,
            'No existen registros',
          );
        }
      const dataMapper =
        RefEstructuraEstablecimientoMapper_EntitiesToDtos(data);
      return this._respuestaService.respuestaHttp(
        true,
        dataMapper,
        ruta,
        'Lista exitosa',
      );
    } catch (e) {
      return this._respuestaService.respuestaHttp(
        false,
        null,
        ruta,
        `Error comunicate con el administrador ${e.message}`,
      );
    }
  }

  async findAllRedByCodigoDepartamento(
    codigoDepartamento: number,
    idInstitucion: number,
    idSubsector: number,
  ): Promise<RespuestaM> {
    try {
      const data =
        await this._refEstructuraEstablecimientoRepository.findAllRedByCodigoDepartamento(
          codigoDepartamento,
          idInstitucion,
          idSubsector
        );
        if(data == null){
          return this._respuestaService.respuestaHttp(
            false,
            null,
            null,
            'No existen registros',
          );
        }
      const dataMapper =
        RefEstructuraEstablecimientoMapper_EntitiesToDtos(data);
      return this._respuestaService.respuestaHttp(
        true,
        dataMapper,
        null,
        'Lista exitosa',
      );
    } catch (e) {
      console.log(e);
    }
  }
  async findAllMunicipoByCodDeparamentoByCodArea(
    codDepartamento: number,
    codArea: number,
  ) {
    try {
      const data =
        await this._refEstructuraEstablecimientoRepository.findAllMunicipoByCodDeparamentoByCodArea(
          codDepartamento,
          codArea,
        );
        if(data == null){
          return this._respuestaService.respuestaHttp(
            false,
            null,
            null,
            'No existen registros',
          );
        }      
      const dataMapper =
        RefEstructuraEstablecimientoMapper_EntitiesToDtos(data);
      return this._respuestaService.respuestaHttp(
        true,
        dataMapper,
        null,
        'Lista exitosa',
      );
    } catch (e) {
      console.log(e);
    }
  }
  async findAllMunicipoByCodDeparamento(
    codDepartamento: number,
    idInstitucion: number,
    idSubsector: number
  ) {
    try {
      const data =
        await this._refEstructuraEstablecimientoRepository.findAllMunicipoByCodDeparamento(
          codDepartamento,
          idInstitucion,
          idSubsector,
        );
      if(data == null){
        return this._respuestaService.respuestaHttp(
          false,
          null,
          null,
          'No existen registros',
        );
      }
      const dataMapper =
        RefEstructuraEstablecimientoMapper_EntitiesToDtos(data);
        return this._respuestaService.respuestaHttp(
        true,
        dataMapper,
        null,
        'Lista exitosa',
      );
    } catch (e) {
      console.log(e);
    }
  }

  async findAllRedByCodigoMunicipio(
    codigoMunicipio: number,
  ): Promise<RespuestaM> {
    try {
      const data =
        await this._refEstructuraEstablecimientoRepository.findAllRedByMunicipio(
          codigoMunicipio,
        );
      if(data == null){
        return this._respuestaService.respuestaHttp(
          false,
          null,
          null,
          'No existen registros',
        );
      }
      const dataMapper =
        RefEstructuraEstablecimientoMapper_EntitiesToDtos(data);
      return this._respuestaService.respuestaHttp(
        true,
        dataMapper,
        null,
        'Lista exitosa',
      );
    } catch (e) {
      console.log(e);
    }
  }
  async findAllEstablecimientoByCodDeparamentoByCodAreaByCodeMunicipio(
    idSubsector: number,
    idInstitucion: number,
    codDepartamento: number,
    codArea: number,
    codMunicipio: number,
  ) {
    try {
      const data =
        await this._refEstructuraEstablecimientoRepository.findAllEstablecimientoByCodDeparamentoByCodAreaByCodeMunicipio(
          idSubsector,
          idInstitucion,
          codDepartamento,
          codArea,
          codMunicipio,
        );
        if(data == null){
          return this._respuestaService.respuestaHttp(
            false,
            null,
            null,
            'No existen registros',
          );
        }else{
          const dataMapper =
        RefEstructuraEstablecimientoMapper_EntitiesToDtos(data);
      return this._respuestaService.respuestaHttp(
        true,
        dataMapper,
        null,
        'Lista exitosa',
      );
        }
      
    } catch (e) {
      console.log(e);
    }
  }
}
