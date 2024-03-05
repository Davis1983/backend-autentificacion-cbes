import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ParGrupoInstitucion } from './par-grupo-institucion.entity';
import { Exclude } from 'class-transformer';
import { ParSistema } from './par-sistema.entity';

//@Entity({ name: 'par_institucion', schema: 'prueba_parametro' })
@Entity({ name: 'par_institucion', schema: 'parametro' })
export class ParInstitucion {
  @PrimaryGeneratedColumn({ name: 'id_institucion' })
  idInstitucion: number;

  @ManyToOne(
    () => ParGrupoInstitucion,
    (parGrupoInstitucion) => parGrupoInstitucion,
  )
  @JoinColumn({
    name: 'id_grupo_institucion',
    referencedColumnName: 'idGrupoInstitucion',
  })
  parGrupoInstitucion: ParGrupoInstitucion;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: false,
    name: 'nombre_institucion',
  })
  nombreInstitucion: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    name: 'sigla_institucion',
  })
  siglaInstitucion: string;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: false,
    name: 'descripcion_institucion',
  })
  descripcionInstitucion: string;

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

  @OneToMany(() => ParSistema, (parSistema) => parSistema.parInstitucion)
  parSistema: ParSistema[];
}
