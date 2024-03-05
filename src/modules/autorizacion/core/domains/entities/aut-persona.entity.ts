import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AutUsuario } from './aut-usuario.entity';
@Entity({ name: 'aut_persona', schema: 'autorizacion' })
export class AutPersona {
  @PrimaryGeneratedColumn({ name: 'id_persona' })
  idPersona: number;

  @OneToOne(
    () => AutUsuario,
    (autUsuario) => autUsuario.autPersona,
  )
  autUsuario: AutUsuario;

  @Column({
    type: 'varchar',
    length: 300,
    nullable: false,
    name: 'hash',
  })
  hash: string;

  @Column({
    type: 'varchar',
    length: 25,
    nullable: false,
    name: 'numero_documento',
  })
  numeroDocumento: string;

  @Column({
    type: 'varchar',
    length: 2,
    nullable: false,
    name: 'complemento',
  })
  complemento: string;

  @Column({
    type: 'boolean',
    nullable: false,
    default: false,
    name: 'complemento_visible',
  })
  complementoVisible: boolean;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    name: 'nombres',
  })
  nombres: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    name: 'primer_apellido',
  })
  primerApellido: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    name: 'segundo_apellido',
  })
  segundoApellido: string;

  @Column({
    type: 'date',
    nullable: false,
    name: 'fecha_nacimiento',
  })
  fechaNacimiento: Date;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    name: 'expedicion',
  })
  expedicion: string;

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
    type: 'boolean',
    default:false,
    name: 'verificacion_segip',
  })
  verificacionSegip: boolean;

  /*OneToMany(
    () => ParClasificadorDetalle,
    (parClasificadorDetalle) => parClasificadorDetalle.parClasificador,
  )
  parClasificadorDetalle: ParClasificadorDetalle[];*/

}
