import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity({ name: 'par_tipo_recurso', schema: 'parametro' })
export class ParTipoRecurso {
  @PrimaryGeneratedColumn({ name: 'id_tipo_recurso' })
  idTipoRecurso: number;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    name: 'nombre_tipo_recurso',
  })
  nombreTipoRecurso: string;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: false,
    name: 'descripcion_tipo_recurso',
  })
  descripcionTipoRecurso: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    name: 'plataforma',
  })
  plataforma: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    name: 'formato',
  })
  formato: string;

  @Exclude()
  @CreateDateColumn({
    type: 'timestamp',
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
    nullable: true,
    name: 'usuario_modificacion',
  })
  usuarioModificacion: string;
}