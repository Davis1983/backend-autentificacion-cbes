import { Expose, Type } from "class-transformer";

export class RefEstructuraEstablecimientoMDto{
  @Type(() => Number)
  @Expose({ name: 'cod_departamento' })
  codDepartamento: number;

  @Expose({ name: 'departamento' })
  departamento: string;

  @Type(() => Number)
  @Expose({ name: 'cod_provincia' })
  codProvincia: number;

  @Expose({ name: 'provincia' })
  provincia: string;

  @Type(() => Number)
  @Expose({ name: 'cod_area' })
  codArea: number;

  @Expose({ name: 'red' })
  red: string;

  @Type(() => Number)
  @Expose({ name: 'cod_municipio' })
  codMunicipio: number;

  @Expose({ name: 'municipio' })
  municipio: string;

  @Type(() => Number)
  @Expose({ name: 'cod_establecimiento' })
  codEstablecimiento: number;

  @Expose({ name: 'establecimiento' })
  establecimiento: string;

  @Expose({ name: 'ambito' })
  ambito: string;

  @Expose({ name: 'tipo' })
  tipo: string;

  @Expose({ name: 'cod_institucion' })
  codInstitucion: string;

  @Expose({ name: 'institucion' })
  institucion: string;

  @Expose({ name: 'codclsest' })
  codclsest: string;

  @Expose({ name: 'codcatest' })
  codcatest: string;

  @Expose({ name: 'codsubsec' })
  codsubsec: string;

  @Expose({ name: 'subsector' })
  subsector: string;

  @Expose({ name: 'nivel' })
  nivel: string;

  @Expose({ name: 'baja_logica_registro' })
  bajaLogicaRegistro: boolean;

}
