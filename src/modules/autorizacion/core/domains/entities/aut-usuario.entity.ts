import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne, PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { AutPersona } from './aut-persona.entity';

//@Entity({ name: 'par_clasificador', schema: 'prueba_parametro' })
@Entity({ name: 'aut_usuario', schema: 'autorizacion' })
export class AutUsuario {
  //@PrimaryGeneratedColumn({ name: 'id_persona' })
  /*@PrimaryColumn({ type:'int',name: 'id_persona' })
  idPersona: number;*/

  @PrimaryColumn({ type:'int',name: 'id_persona' })
  idPersona: number;
  @OneToOne(() => AutPersona)
  @JoinColumn({ name: 'id_persona'})
  autPersona: AutPersona[];

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    name: 'usuario',
  })
  usuario: string;

  // @Column({
  //   type: 'varchar',
  //   length: 50,
  //   nullable: false,
  //   name: 'idc_nivel',
  // })
  // idcNivel: string;

  @Column({
    type: 'varchar',
    length: 60,
    nullable: false,
    name: 'contrasenia',
  })
  contrasenia: string;

  @Column({
    type: 'boolean',
    nullable: false,
    default: false,
    name: 'contrasenia_reset',
  })
  contraseniaReset: boolean;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    name: 'idc_tipo_usuario',
  })
  idcTipoUsuario: string;

  // @Column({
  //   type: 'int4',
  //   width: 32,
  //   nullable: false,
  //   name: 'id_institucion',
  // })
  // idInstitucion: number;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    name: 'correo_electronico',
  })
  correoElectronico: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    name: 'telefono',
  })
  telefono: string;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: false,
    name: 'idc_estado',
  })
  idcEstado: string;

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
