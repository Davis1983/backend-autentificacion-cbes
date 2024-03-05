import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ParInstitucion } from './par-institucion.entity';
import { Exclude } from 'class-transformer';

//@Entity({ name: 'par_sistema', schema: 'prueba_parametro' })
@Entity({ name: 'par_sistema', schema: 'parametro' })
export class ParSistema {
  @PrimaryGeneratedColumn({ name: 'id_sistema' })
  idSistema: number;

  @Column({
    type: 'varchar',
    length: 250,
    nullable: true,
    name: 'identificador_sistema',
  })
  identificadorSistema: string;

  @Column({
    type: 'varchar',
    length: 250,
    nullable: true,
    name: 'nombre_sistema',
  })
  nombreSistema: string;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: false,
    name: 'descripcion_sistema',
  })
  descripcionSistema: string;

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
    length: 25,
    nullable: false,
    name: 'usuario_registro',
    default: () => 'CURRENT_USER',
  })
  usuarioRegistro: string;

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
