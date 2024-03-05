import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RespuestaService } from '../shared/services/respuesta.service';
import {
  ParClasificador,
  ParClasificadorDetalle,
  //ParGrupoInstitucion,
  ParGrupoProfesion,
  ParInstitucion,
  ParSistema,
  ParTipoRecurso,
} from './core/domains/entities/';

import {
  ParClasificadorController,
  ParClasificadorDetalleController,
  //ParGrupoInstitucionController,
  ParGrupoProfesionController,
  ParInstitucionController,
  ParSistemaController,
  ParTipoRecursoController,
} from './controller/';

import {
  ParSistemaService,
  ParClasificadorService,
  ParClasificadorDetalleService,
  //ParGrupoInstitucionService,
  ParGrupoProfesionService,
  ParInstitucionService,
  ParTipoRecursoService,
} from './services/impl/';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ParClasificador,
      ParClasificadorDetalle,
      ParGrupoProfesion,
      ParTipoRecurso,
      //ParGrupoInstitucion,
      ParInstitucion,
      ParSistema,
    ]),
  ],
  controllers: [
    ParClasificadorController,
    ParClasificadorDetalleController,
    //ParGrupoInstitucionController,
    ParGrupoProfesionController,
    ParInstitucionController,
    ParSistemaController,
    ParTipoRecursoController,
  ],
  providers: [
    ParClasificadorService,
    ParClasificadorDetalleService,
    RespuestaService,
    ParGrupoProfesionService,
    //ParGrupoInstitucionService,
    ParInstitucionService,
    ParSistemaService,
    ParTipoRecursoService,
  ],
  exports: [
    TypeOrmModule,
    ParSistemaService,
    ParTipoRecursoService,
    ParGrupoProfesionService,
  ],
})
export class ParametrosModule {}
