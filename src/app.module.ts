import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { enviroments } from './common/config/enviroments';
import config from './common/config/config';
import { DatabaseModule } from './modules/database/database.module';
import { ParametrosModule } from './modules/parametros/parametros.module';
import { SharedModule } from './modules/shared/shared.module';
import { AutorizacionModule } from './modules/autorizacion/autorizacion.module';
import { AuthModule } from './modules/auth/auth.module';
import { SegipModule } from './modules/segip/segip.module';
import { ReferenciaModule } from './modules/referencia/referencia.module';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: enviroments[process.env.NODE_ENV] || '.env',
      load: [config],
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: process.env.ARCHIVOS,
      serveRoot: '/ruta',
      serveStaticOptions: {
        index: false, // Esto desactiva la búsqueda del archivo 'index.html' predeterminado.
      },
    }),
    DatabaseModule,
    ParametrosModule,
    AutorizacionModule,
    AuthModule,
    SharedModule,
    SegipModule,
    ReferenciaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
