import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity({ name: 'aut_profesion_persona', schema: 'autorizacion' })
export class AutProfesionPersona {
  @PrimaryColumn({ type: 'int8', name: 'id_persona' })
  idPersona: number;

  @Column({
    type: 'int4',
    nullable: false,
    name: 'id_grupo_profesion',
  })
  idGrupoProfesion: number;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
    name: 'matricula_profesional',
  })
  matriculaProfesional: string;

  @Column({
    type: 'boolean',
    nullable: false,
    default: false,
    name: 'certificador',
  })
  certificador: boolean;

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
