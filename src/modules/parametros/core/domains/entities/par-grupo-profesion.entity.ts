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
@Entity({ name: 'par_grupo_profesion', schema: 'parametro' })
//@Entity({ name: 'par_grupo_profesion', schema: 'prueba_parametro' })
export class ParGrupoProfesion {
  @PrimaryGeneratedColumn({ name: 'id_grupo_profesion' })
  idGrupoProfesion: number;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    name: 'nombre_grupo_profesion',
  })
  nombreGrupoProfesion: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    name: 'nombre_descripcion_profesion',
  })
  nombreDescripcionProfesion: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    name: 'tipo_registro',
  })
  tipoRegistro: string;

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
