import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AutUsuario,
  AutPersona,
  AutPerfil,
  AutRecurso,
  AutPerfilRecurso,
  AutProfesionPersona,
  AutUsuarioRestriccion,
  AutUsuarioRestriccionPerfil,
} from './core/domains/entities';
import { RespuestaService } from '../shared/services/respuesta.service';
import { AutUsuarioController, AutPerfilController } from './controller';
import { AutUsuarioService, AutPerfilService } from './services/impl/';
import { ParametrosModule } from '../parametros/parametros.module';
import { AutRecursoController } from './controller/aut-recurso.controller';
import { AutRecursoService } from './services/impl/aut-recurso.service';
import { AutPersonaService } from './services/impl/aut-persona.service';
import { AutPersonaController } from './controller/aut-persona.controller';
import { AutPerfilRecursoService } from './services/impl/aut-perfil-recurso.service';
import { AutPerfilRecursoController } from './controller/aut-perfil-recurso.controller';
import { AuthService } from '../auth/services/auth.service';
import { AuthModule } from '../auth/auth.module';
import { AutProfesionPersonaService } from './services/impl/aut-profesion-persona.service';
import { AutProfesionPersonaController } from './controller/aut-profesion-persona.controller';
import { AutUsuarioRestriccionService } from './services/impl/aut-usuario-restriccion.service';
import { AutUsuarioRestriccionPerfilService } from './services/impl/aut-usuario-restriccion-perfil.service';
import {AutUsuarioRestriccionController} from "./controller/aut-usuario-restriccion.controller";
import {AutUsuarioRestriccionPerfilController} from "./controller/aut-usuario-restriccion-perfil.controller";
@Module({
  imports: [
    ParametrosModule,
    AuthModule,
    TypeOrmModule.forFeature([
      AutUsuario,
      AutPersona,
      AutPerfil,
      AutRecurso,
      AutPerfilRecurso,
      AutProfesionPersona,
      AutUsuarioRestriccion,
      AutUsuarioRestriccionPerfil,
    ]),
  ],
  controllers: [
    AutUsuarioController,
    AutPerfilController,
    AutPersonaController,
    AutRecursoController,
    AutPerfilRecursoController,
    AutProfesionPersonaController,
    AutUsuarioRestriccionController,
    AutUsuarioRestriccionPerfilController,
  ],
  providers: [
    AutUsuarioService,
    AutPerfilService,
    AutRecursoService,
    AutPersonaService,
    RespuestaService,
    AutPerfilRecursoService,
    AuthService,
    AutProfesionPersonaService,
    AutUsuarioRestriccionService,
    AutUsuarioRestriccionPerfilService,
  ],
  exports: [TypeOrmModule,AutUsuarioRestriccionPerfilService],
})
export class AutorizacionModule {}
