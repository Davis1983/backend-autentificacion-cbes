import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: 'ref_estructura_establecimiento', schema: 'referencia' })
export class RefEstructuraEstablecimiento{
  @PrimaryColumn({
    type: 'int4',
    nullable: false,
    name: 'cod_departamento',
  })
  codDepartamento:number;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    name: 'departamento',
  })
  departamento:string;

  @Column({
    type: 'int4',
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
    type: 'int4',
    nullable: false,
    name: 'cod_area',
  })
  codArea:number;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    name: 'red',
  })
  red:string;

  @Column({
    type: 'int4',
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
    type: 'int4',
    nullable: false,
    name: 'cod_establecimiento',
  })
  codEstablecimiento:number;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    name: 'establecimiento',
  })
  establecimiento:string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    name: 'ambito',
  })
  ambito:string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    name: 'tipo',
  })
  tipo:string;

  @Column({
    type: 'varchar',
    length: 4,
    nullable: false,
    name: 'cod_institucion',
  })
  codInstitucion:string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    name: 'institucion',
  })
  institucion:string;

  @Column({
    type: 'varchar',
    length: 2,
    nullable: false,
    name: 'codclsest',
  })
  codclsest:string;

  @Column({
    type: 'varchar',
    length: 2,
    nullable: false,
    name: 'codcatest',
  })
  codcatest:string;

  @Column({
    type: 'varchar',
    length: 2,
    nullable: false,
    name: 'codsubsec',
  })
  codsubsec:string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    name: 'subsector',
  })
  subsector:string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    name: 'nivel',
  })
  nivel:string;

  @Column({
    type: 'boolean',
    default:'false',
    nullable: false,
    name: 'baja_logica_registro',
  })
  bajaLogicaRegistro:boolean;
}
