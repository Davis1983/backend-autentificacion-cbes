import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity({ name: 'aut_perfil', schema: 'autorizacion' })
export class AutPerfil {
  @PrimaryGeneratedColumn({ name: 'id_perfil' })
  idPerfil: number;

  @Column({
    type: 'int4',
    nullable: false,
    name: 'id_sistema',
  })
  idSistema: number;

  @Column({
    type: 'varchar',
    nullable: true,
    name: 'idc_nivel_restriccion',
  })
  idcNivelRestriccion: string;

  @Column({
    type: 'varchar',
    length: 250,
    nullable: false,
    name: 'nombre_perfil',
  })
  nombrePerfil: string;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: false,
    name: 'descripcion_perfil',
  })
  descripcionPerfil: string;

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
}
