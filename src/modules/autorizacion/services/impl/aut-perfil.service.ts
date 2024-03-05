import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AutPerfil } from '../../core/domains/entities';
import { Repository } from 'typeorm';
import { Client } from 'pg';
import { AutPerfilRespository } from '../../repositories/impl/aut-perfil.repository';
import { AutUsuarioPerfilRespository } from '../../repositories/impl/aut-usuario-perfil.repository';
import { PaginationDto } from '../../../../core/domain/dtos/pagination.dto';
import { RespuestaM } from '../../../../core/domain/models/respuesta.model';
import { formatoFecha } from '../../../../common/utility/all.utill';
import { RespuestaService } from '../../../shared/services/respuesta.service';

import {
  CreateAutPerfilDto,
  UpdateAutPerfilDto,
  CreateUpdateAutPerfilDto, ContextoDto
} from "../../core/domains/dtos";

import { ParSistemaService } from '../../../parametros/services/impl';
import { AutUsuarioService } from './aut-usuario.service';
import { RespuestaConsultaEnum } from '../../../../core/enum/respuesta-consulta.enum';
import { UpdateParClasificadorDetalleDto } from '../../../parametros/core/domains/dtos/par-clasificador-detalle.dto';
import { AutPerfilRecursoMapper_EntitiesToDtos } from '../../mapper/aut-perfil-recurso.mapper';
import { AutUsuarioPerfilRecursoMapper_EntitiesToDtos } from '../../mapper/aut-usuario-perfil-recurso.mapper';
import { AutPerfilRecursoService } from '../../services/impl/aut-perfil-recurso.service';
import { AutUsuarioPerfilMapper_EntitiesToDtos } from '../../mapper/aut-usuario-perfil.mapper';
import { AutPersonaService } from "./aut-persona.service";
import { FindUsuariosDto } from "../../core/domains/dtos/aut-usuario-restriccion.dto";
import { AutUsuarioRestriccionService } from "./aut-usuario-restriccion.service";

@Injectable()
export class AutPerfilService {
  _autPerfilRepository: AutPerfilRespository;
  _autUsuarioPerfilRepository: AutUsuarioPerfilRespository;
  _main = 'AutPerfilService';
  private logger = new Logger('AutPerfilService');
  constructor(
    @Inject('PG') private _client: Client,
    @InjectRepository(AutPerfil)
    private _autPerfil: Repository<AutPerfil>,
    private _respuestaService: RespuestaService,
    private _parSistemaService: ParSistemaService,
    private _autPerfilRecursoService: AutPerfilRecursoService,
    private _autUsuarioService: AutUsuarioService,
    private _autUsuarioRestriccionService:AutUsuarioRestriccionService,

  ) {
    this._autPerfilRepository = new AutPerfilRespository(_client);
    this._autUsuarioPerfilRepository = new AutUsuarioPerfilRespository(_client);
  }
  /**
   * Lista los Registros en caso de llegar nulos los datos del paginador
   * por defecto se asigna un limit=10
   * @param paginadorDto
   */
  async findAllAutPerfil(paginadorDto: PaginationDto): Promise<RespuestaM> {
    const ruta = this._main + '/ findAllAutPerfil';
    const { limit = 10, offset = 0 } = paginadorDto;
    let data = null;
    try {
      data = await this._autPerfil.find({
        select: {
          idPerfil: true,
          idSistema: true,
          nombrePerfil: true,
          descripcionPerfil: true,
        },
        where: {
          bajaLogicaRegistro: false,
        },
        take: limit,
        skip: offset,
        order: {
          idPerfil: 'DESC',
        },
      });
      if (data) {
        data.map((datos) => {
          datos.fechaRegistro = formatoFecha(datos.fechaRegistro);
        });
        return this._respuestaService.respuestaHttp(
          true,
          data,
          ruta,
          RespuestaConsultaEnum.LISTADO_EXITOSO,
        );
      } else {
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          RespuestaConsultaEnum.SIN_REGISTRO,
        );
      }
    } catch (e) {
      this.logger.error(e);
      return this._respuestaService.respuestaHttp(
        false,
        null,
        ruta,
        `Error ${e.code}`,
      );
    }
  }

  async findByIdAutPerfil(idAutPerfil: number): Promise<RespuestaM> {
    const ruta = this._main + ' /findByIdAutPerfil';
    let autPerfil = null;
    try {
      autPerfil = await this._autPerfil.findOne({
        select: {
          idPerfil: true,
          idSistema: true,
          nombrePerfil: true,
          descripcionPerfil: true,
          idcNivelRestriccion:true,
          fechaRegistro: true,
        },
        where: {
          idPerfil: idAutPerfil,
        },
      });
      if (autPerfil) {
        autPerfil.fechaRegistro = formatoFecha(autPerfil.fechaRegistro);
        return this._respuestaService.respuestaHttp(
          true,
          autPerfil,
          ruta,
          RespuestaConsultaEnum.LISTADO_EXITOSO,
        );
      } else {
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          RespuestaConsultaEnum.SIN_REGISTRO,
        );
      }
    } catch (error) {
      this.logger.error(error);
      return this._respuestaService.respuestaHttp(
        false,
        null,
        ruta,
        `Error ${error.code}`,
      );
    }
  }

  async findByIdAutPerfilByIdSistema(idSistema: number): Promise<RespuestaM> {
    const ruta = this._main + ' /findByIdAutPerfil';
    let autPerfil = null;
    try {
      autPerfil = await this._autPerfil.find({
        select: {
          idPerfil: true,
          idSistema: true,
          idcNivelRestriccion: true,
          nombrePerfil: true,
          descripcionPerfil: true,
          fechaRegistro: true,
        },
        where: {
          idSistema: idSistema,
          bajaLogicaRegistro: false
        },
        order: {
          idPerfil: 'DESC',
        },
      });
      if (autPerfil) {
        autPerfil.fechaRegistro = formatoFecha(autPerfil.fechaRegistro);

        return this._respuestaService.respuestaHttp(
          true,
          autPerfil,
          ruta,
          RespuestaConsultaEnum.LISTADO_EXITOSO,
        );
      } else {
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          RespuestaConsultaEnum.SIN_REGISTRO,
        );
      }
    } catch (error) {
      this.logger.error(error);
      return this._respuestaService.respuestaHttp(
        false,
        null,
        ruta,
        `Error ${error.code}`,
      );
    }
  }

  async createAutPerfil(autPerfilDto: CreateUpdateAutPerfilDto): Promise<RespuestaM> {
    const ruta = this._main + ' /createAutPerfil';
    try {
      //Verificamos que exista el id del sistema enviado para registro
      const parSistema = await this._parSistemaService.findByIdSistema(
        autPerfilDto.idSistema,
      );
      const { data } = parSistema;
      //const { datos } = parClasificador;
      if (!data)
        //if (!datos)
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          'No existe el Identificador de Par Sistema',
        );
      const newAutPerfil = await this._autPerfil.create(autPerfilDto);
      const createAutPerfil = await this._autPerfil.save(newAutPerfil);
      if (createAutPerfil) {
        const resp = {
          idPerfil: createAutPerfil.idPerfil,
          idSistema: createAutPerfil.idSistema,
          idcNivelRestriccion: createAutPerfil.idcNivelRestriccion,
          nombrePerfil: createAutPerfil.nombrePerfil,
        };
        return this._respuestaService.respuestaHttp(
          true,
          resp,
          ruta,
          'Perfil agregado exitosamente',
        );
      } else {
        return this._respuestaService.respuestaHttp(
          true,
          null,
          ruta,
          'Error en el Registro',
        );
      }
    } catch (error) {
      return this._respuestaService.respuestaHttp(
        false,
        null,
        ruta,
        `Error ${error.message}`,
      );
    }
  }

  async updateAutPerfil(idPerfil: number, updateAutPerfil: CreateUpdateAutPerfilDto): Promise<RespuestaM> {
    const ruta = this._main + '/ updateAutPerfil';
    try {
      const perfil = await this._autPerfil.findOneBy({
        idPerfil: idPerfil,
      });
      if (!perfil)
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          'Registro no Encontrado ',
        );
      this._autPerfil.merge(perfil, updateAutPerfil);

      const updateConsolidado = await this._autPerfil.save(perfil);

      if (!updateConsolidado)
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          'Error en el Registro',
        );

      const resp = {
        idPerfil: updateConsolidado.idPerfil,
        nombrePerfil: updateConsolidado.nombrePerfil,
        descripcionPerfil: updateAutPerfil.descripcionPerfil,
      };
      return this._respuestaService.respuestaHttp(
        true,
        resp,
        ruta,
        'Modificacion Correcta ',
      );
    } catch (error) {
      return this._respuestaService.respuestaHttp(
        false,
        null,
        ruta,
        `Error ${error.message}`,
      );
    }
  }

  async createUpdateAutPerfil(idPerfil: number, dto: CreateUpdateAutPerfilDto): Promise<RespuestaM> {
    let result = null;
    try {
      if (idPerfil > 0) {
        result = await this.updateAutPerfil(idPerfil, dto);
        await this._autPerfilRecursoService.createListAutPerfilRecurso(idPerfil, dto.colIdRecurso);
      } else {
        result = await this.createAutPerfil(dto);
        console.log(result.data.idPerfil);
        await this._autPerfilRecursoService.createListAutPerfilRecurso(result.data.idPerfil, dto.colIdRecurso);
      }

      console.log("entity createUpdate", result);

      return this._respuestaService.respuestaHttp(
        result.status,
        result.data,
        null,
        'Perfil agregado exitosamente con recursos',
      );
    } catch (error) {
      return this._respuestaService.respuestaHttp(
        false,
        null,
        null,
        `Error ${error.message}`,
      );
    }
  }

  async deleteLogicoAutPerfil(
    idPerfil: number,
    usuario: string,
  ): Promise<RespuestaM> {
    const ruta = this._main + '/ deleteLogicoAutPerfil';
    const updateAutPerfil = new UpdateAutPerfilDto();

    try {
      const perfil = await this._autPerfil.findOneBy({
        idPerfil: idPerfil,
      });

      if (!perfil)
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          'Registro no Encontrado ',
        );
      updateAutPerfil.bajaLogicaRegistro = true;
      updateAutPerfil.usuarioModificacion = usuario;
      this._autPerfil.merge(perfil, updateAutPerfil);

      const updateConsolidado = await this._autPerfil.save(perfil);

      if (!updateConsolidado)
        return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          'Error en el Registro',
        );

      const resp = {
        idPerfil: updateConsolidado.idPerfil,
      };
      return this._respuestaService.respuestaHttp(
        true,
        resp,
        ruta,
        'Eliminacion Correcta',
      );
    } catch (error) {
      return this._respuestaService.respuestaHttp(
        false,
        null,
        ruta,
        `Error ${error.message}`,
      );
    }
  }

  async listarAutRecursoByIdPerfil(idPerfil: number, idSistema: number) {

    try{
      const valorIdSistema = await this._parSistemaService.findByIdSistema(
        idSistema,
      );
      if (!valorIdSistema.data) {
        return this._respuestaService.respuestaHttp(
          false,
          null,
          null,
          `No Existe el ID Sistema`,
        );
      }

      const resultado = [];
      const idRecursosPadres =
        await this._autPerfilRepository.obtenerIdSuperiorAutRecurso(
          idSistema,
        );
      for (let i = 0; i < idRecursosPadres.length; i++) {
        resultado.push(
          await this._autPerfilRepository.listarAutRecursoByIdPerfil(
            idRecursosPadres[i].id_recurso, idPerfil
          ),
        );
      }
      const resp = [];
      resultado.map((datos, index) => {
        datos.map((data) => {
          resp.push(data);
        });
      });

      const ruta = this._main + ' / listarAutRecursoByIdPerfil';
      const data = AutPerfilRecursoMapper_EntitiesToDtos(resp);
      return this._respuestaService.respuestaHttp(
        true,
        data,
        ruta,
        RespuestaConsultaEnum.LISTADO_EXITOSO,
      );
    } catch (e) {
      return null;
    }
  }

  async listarPerfilByIdSistema(idSistema:number){
    const ruta = this._main + ' / listarPerfilByIdSistema';
    try {
      const valor = await this._autPerfil.find({
        select:{
          idSistema:true,
          nombrePerfil:true,
          descripcionPerfil:true,
        },
        where:{
          idSistema:idSistema
        }
      });
      return this._respuestaService.respuestaHttp(
          true,
          valor,
          ruta,
          RespuestaConsultaEnum.LISTADO_EXITOSO,
      );
    }catch (e){
      return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          'Error',
      );
    }
  }
  async listarPerfilByIdSistemaByIdPerfil( idSistema:number,idPerfil:number){
    const ruta = this._main + ' / listarPerfilByIdSistema';
    try {
      const valor = await this._autPerfil.find({
        select:{
          idSistema:true,
          nombrePerfil:true,
          descripcionPerfil:true,
        },
        where:{
          idSistema:idSistema,
          idPerfil:idPerfil,
        }
      });
      return this._respuestaService.respuestaHttp(
          true,
          valor,
          ruta,
          RespuestaConsultaEnum.LISTADO_EXITOSO,
      );
    }catch (e){
      return this._respuestaService.respuestaHttp(
          false,
          null,
          ruta,
          'Error',
      );
    }
  }

  async listarUsuarioPerfilByIdSistema(idSistema: number, usuario: string): Promise<RespuestaM>{
		const ruta = this._main + '/ AutUsuarioPerfil';
		try{
        //Verificamos que exista el id del sistema enviado para registro
        let sistema = null;
        sistema = await this._parSistemaService.findByIdSistema(idSistema);
        if (sistema.data){
          const resultado = await this._autUsuarioPerfilRepository.listaUsuarioPerfil(idSistema, usuario);
          const ruta = this._main + ' / listaUsuarioPerfil';
          const data = AutUsuarioPerfilMapper_EntitiesToDtos(resultado);
          return this._respuestaService.respuestaHttp(
          true,
          data,
          ruta,
          RespuestaConsultaEnum.LISTADO_EXITOSO,
          );
        }
        else {
          return this._respuestaService.respuestaHttp(
            false,
            null,
            ruta,
            'Id de Sistema no encontrato',
          );
        }

      } catch (e) {
        return null;
      }
  }

  async listarUsuarioPerfilByIdSistemaByIdUsuarioRestriccion(idSistema: number, idUsuarioRestriccion: number): Promise<RespuestaM>{
    const ruta = this._main + '/ AutUsuarioPerfil';
    try{
      //Verificamos que exista el id del sistema enviado para registro
      let sistema = null;
      sistema = await this._parSistemaService.findByIdSistema(idSistema);
      if (sistema.data){
        const resultado = await this._autUsuarioPerfilRepository.listaUsuarioPerfilByIdUsuarioRestriccion(idSistema, idUsuarioRestriccion);
        const data = AutUsuarioPerfilMapper_EntitiesToDtos(resultado);
        return this._respuestaService.respuestaHttp(
            true,
            data,
            ruta,
            RespuestaConsultaEnum.LISTADO_EXITOSO,
        );
      }
      else {
        return this._respuestaService.respuestaHttp(
            false,
            null,
            ruta,
            'Id de Sistema no encontrato',
        );
      }
    } catch (e) {
      return null;
    }
  }

    async listarPerfilRecursoByUsuario(dto:ContextoDto) {
    //async listarPerfilRecursoByUsuario(usuario: string) {
      const ruta = this._main + ' / listarPerfilRecursoByUsuario';
      try{
        const valorIdSistema = await this._autUsuarioService.findUsuario(
          dto.usuario
        );
        if (!valorIdSistema.data) {
          return this._respuestaService.respuestaHttp(
            false,
            null,
            null,
            `No Existe el Usuario`,
          );
        }
        const resultado = [];
        const idPerfilesUsuario =
          await this._autUsuarioPerfilRepository.listaUsuarioPerfilAsignado(
            dto.usuario,
          );
        for (let i = 0; i < idPerfilesUsuario.length; i++) {
          resultado.push(
            await this._autPerfilRepository.listarPerfilRecursoByUsuario(
              idPerfilesUsuario[i].id_recurso_superior
            ),
          );
        }


        const resp = [];
        resultado.map((datos, index) => {
          datos.map((data) => {
            resp.push(data);
          });
        });
        const listaRecursos = AutUsuarioPerfilRecursoMapper_EntitiesToDtos(resp);
        return this._respuestaService.respuestaHttp(
          true,
          listaRecursos,
          ruta,
          RespuestaConsultaEnum.LISTADO_EXITOSO,);

        const array ={usuario:await this._autPerfilRepository.findByPersonaByUsuario(dto.usuario)}
        const prueba={usuarioRestriccion:await this._autPerfilRepository.usuarioRestriccion(dto.usuario)};
        const data2={listaRecursos};
        const fusion={...array.usuario,...prueba,...data2};
        /*return this._respuestaService.respuestaHttp(
          true,
          fusion,
          ruta,
          RespuestaConsultaEnum.LISTADO_EXITOSO,
        );*/
      } catch (e) {
        return e;
      }
    }

  async usuarioFindByIdAll(dto:FindUsuariosDto){
    try {
      const resultado = await this._autUsuarioRestriccionService.usuarioFindByIdAll(dto);
      const resp = [];
      const result = resultado.data.reduce( ( accumulator, element, index ) => ( {
        ...accumulator,
        [ element.id ]: element
      } ), {} );
      console.log(result)
      return this._respuestaService.respuestaHttp(true,result,null,'Lista correcta');
    }catch (e){
      return null;
    }
  }
}
