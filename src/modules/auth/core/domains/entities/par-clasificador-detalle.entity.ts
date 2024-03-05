import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ParClasificador } from './par-clasificador.entity';
import { Exclude } from 'class-transformer';

//@Entity({ name: 'par_clasificador_detalle', schema: 'prueba_parametro' })
@Entity({ name: 'par_clasificador_detalle', schema: 'parametro' })
export class ParClasificadorDetalle {
  @PrimaryGeneratedColumn({ name: 'id_clasificador_detalle' })
  idClasificadorDetalle: number;

  /*@OneToOne(
    () => ParClasificador,
    (parClasificador) => parClasificador.parClasificadorDetalle,
  )*/
  @ManyToOne(
    () => ParClasificador,
    (parClasificador) => parClasificador.parClasificadorDetalle,
  )
  @JoinColumn({
    name: 'identificador_clasificador',
    referencedColumnName: 'identificadorClasificador',
  })
  parClasificador: ParClasificador;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    name: 'identificador_clasificador_detalle',
  })
  identificadorClasificadorDetalle: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    name: 'nombre_clasificador_detalle',
  })
  nombreClasificadorDetalle: string;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: true,
    name: 'descripcion_clasificador_detalle',
  })
  descripcionClasificadorDetalle: string;

  @Column({ type: 'int4', nullable: true, name: 'orden' })
  orden: number;

  @Column({
    type: 'varchar',
    length: 25,
    nullable: false,
    name: 'usuario_registro',
    default: () => 'CURRENT_USER',
  })
  usuarioRegistro: string;

  @Exclude()
  @CreateDateColumn({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
    name: 'fecha_registro',
  })
  fechaRegistro: Date;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
    name: 'ip_registro',
    default: () => 'inet_client_addr()',
  })
  ipRegistro: string;

  @Column({
    type: 'boolean',
    nullable: false,
    default: false,
    name: 'baja_logica_registro',
  })
  bajaLogicaRegistro: boolean;

  @Exclude()
  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'fecha_modificacion',
  })
  fechaModificacion: Date;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    name: 'usuario_modificacion',
  })
  usuarioModificacion: string;
}
