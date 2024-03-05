import { HttpModule } from '@nestjs/axios';
import { SegipService } from './services/impl/segip.service';
import { Global, Module } from '@nestjs/common';
import { SegipController } from './controller/segip.controller';
import { RespuestaService } from '../shared/services/respuesta.service';

@Global()
@Module({
  imports: [HttpModule],
  controllers: [SegipController],
  providers: [SegipService, RespuestaService],
  exports: [SegipService],
})
export class SegipModule {}
