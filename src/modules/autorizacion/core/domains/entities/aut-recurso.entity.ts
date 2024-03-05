import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity({ name: 'aut_recurso', schema: 'autorizacion' })
export class AutRecurso {
  @PrimaryGeneratedColumn({ name: 'id_recurso' })
  idRecurso: number;

  @Column({
    type: 'int4',
    nullable: false,
    name: 'id_sistema',
  })
  idSistema: number;

  @Column({
    type: 'int4',
    nullable: true,
    name: 'id_recurso_superior',
  })
  idRecursoSuperior: number;

  @Column({
    type: 'int4',
    nullable: true,
    name: 'id_tipo_recurso',
  })
  idTipoRecurso: number;

  @Column({
    type: 'varchar',
    length: 300,
    nullable: false,
    name: 'uri',
  })
  uri: string;

  @Column({
    type: 'varchar',
    length: 300,
    nullable: false,
    name: 'nombre_recurso',
  })
  nombreRecurso: string;

  @Column({
    type: 'varchar',
    length: 300,
    nullable: true,
    name: 'descripcion_recurso',
  })
  descripcionRecurso: string;

  @Column({
    type: 'boolean',
    nullable: false,
    name: 'es_visible',
  })
  esVisible: boolean;

  @Column({
    type: 'int4',
    nullable: false,
    name: 'orden',
  })
  orden: number;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    name: 'icono',
  })
  icono: string;

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
    nullable: false,
    name: 'usuario_modificacion',
  })
  usuarioModificacion: string;
  /*


	usuario_registro varchar(100) NOT NULL DEFAULT "current_user"(), -- Usuario de aplicacion y/o Base de datos involucrado en eventos de CRUD.
	ip_registro varchar(20) NOT NULL DEFAULT inet_client_addr(), -- Dirección IP involucrada en eventos de CRUD.
	baja_logica_registro bool NOT NULL DEFAULT false,
	fecha_modificacion timestamp NULL,
	usuario_modificacion varchar(50) NULL,
   */
}
