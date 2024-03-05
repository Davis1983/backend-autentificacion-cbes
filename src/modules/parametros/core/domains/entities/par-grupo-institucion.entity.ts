import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { ParInstitucion } from './par-institucion.entity';

//@Entity({ name: 'par_grupo_institucion', schema: 'prueba_parametro' })
@Entity({ name: 'par_grupo_institucion', schema: 'parametro' })
export class ParGrupoInstitucion {
  @PrimaryGeneratedColumn({ name: 'id_grupo_institucion' })
  idGrupoInstitucion: number;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    name: 'nombre_grupo_institucion',
  })
  nombreGrupoInstitucion: string;

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

  /*@OneToMany(
    () => ParInstitucion,
    (parInstitucion) => parInstitucion.parGrupoInstitucion,
  )
  parInstitucion: ParGrupoInstitucion[];*/
}
