import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RefEstructuraLocalidad } from "./core/domains/entities/ref-estructura-localidad.entity";
import { RefEstructuraEstablecimiento } from "./core/domains/entities/ref-estructura-establecimiento.entity";
import { RefEstructuraEstablecimientoController } from "./controller/ref-estructura-establecimiento.controller";
import { RefEstructuraEstablecimientoService } from "./services/impl/ref-estructura-establecimiento.service";
import { RespuestaService } from "../shared/services/respuesta.service";

@Module({
  imports:[TypeOrmModule.forFeature([
    RefEstructuraLocalidad,
    RefEstructuraEstablecimiento,
  ])],
  controllers:[RefEstructuraEstablecimientoController],
  providers:[RefEstructuraEstablecimientoService,RespuestaService],
  exports:[],
})
export class ReferenciaModule{}
