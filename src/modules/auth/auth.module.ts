import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutPersona } from '../autorizacion/core/domains/entities/aut-persona.entity';
import { AutUsuario } from '../autorizacion/core/domains/entities/aut-usuario.entity';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './services/auth.service';
import { AutUsuarioService } from '../autorizacion/services/impl/aut-usuario.service';
import { jwtConstants } from './constants';
import { RespuestaService } from '../shared/services/respuesta.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AutPersona,
      AutUsuario,
    ])
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AutUsuarioService,
    RespuestaService
  ],
  exports: [TypeOrmModule,AuthService],
})
export class AuthModule {}
