import { Module } from '@nestjs/common'
import { RespuestaService } from './services/respuesta.service';
@Module({
    providers:[
        RespuestaService,
    ],
    exports:[RespuestaService],
})
export class SharedModule{}