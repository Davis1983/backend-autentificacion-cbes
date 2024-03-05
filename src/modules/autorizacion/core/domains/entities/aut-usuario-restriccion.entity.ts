import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity({ name: 'aut_usuario_restriccion', schema: 'autorizacion' })
export class AutUsuarioRestriccion {
  @PrimaryGeneratedColumn({ name: 'id_usuario_restriccion' })
  idUsuarioRestriccion: number;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    name: 'usuario',
  })
  usuario: string;

  @Column({
    type: 'int8',
    nullable: false,
    name: 'id_sistema',
  })
  idSistema: number;

  @Column({
    type: 'int8',
    nullable: false,
    name: 'id_institucion',
  })
  idInstitucion: number;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    name: 'idc_subsector',
  })
  idcSubSector: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    name: 'idc_nivel',
  })
  idcNivel: string;

  @Column({
    type: 'int4',
    nullable: false,
    name: 'id_nivel',
  })
  idNivel: number;

  @Column({
    type: 'int4',
    nullable: true,
    name: 'cod_departamento',
  })
  codDepartamento: number;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    name: 'departamento',
  })
  departamento: string;

  @Column({
    type: 'int4',
    nullable: true,
    name: 'cod_area',
  })
  codArea: number;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    name: 'area',
  })
  area: string;

  @Column({
    type: 'int4',
    nullable: true,
    name: 'cod_municipio',
  })
  codMunicipio: number;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    name: 'municipio',
  })
  municipio: string;

  @Column({
    type: 'int4',
    nullable: true,
    name: 'cod_establecimiento',
  })
  codEstablecimiento: number;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    name: 'establecimiento',
  })
  establecimiento: string;

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

  @Column({
    type: 'int4',
    nullable: true,
    name: 'id_subsector',
  })
  idSubsector: number;
}
