import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: 'ref_estructura_localidad', schema: 'referencia' })
export class RefEstructuraLocalidad{
  @PrimaryColumn({
    type: 'integer',
    nullable: false,
    name: 'cod_departamento',
  })
  codDepartamento:number; // la tabla no tiene clave primaria
  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    name: 'departamento',
  })
  departamento :string;

  @Column({
    type: 'integer',
    nullable: false,
    name: 'cod_provincia',
  })
  codProvincia:number;
  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    name: 'provincia',
  })
  provincia:string;

  @Column({
    type: 'integer',
    nullable: false,
    name: 'cod_municipio',
  })
  codMunicipio:number;
  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    name: 'municipio',
  })
  municipio:string;
  @Column({
    type: 'bigint',
    nullable: false,
    name: 'cod_localidad',
  })
  codLocalidad:number;
  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    name: 'localidad',
  })
  localidad:string;
  @Column({
    type: 'varchar',
    length: 250,
    nullable: false,
    name: 'detalle_localidad',
  })
  detalleLocalidad:string;
}
