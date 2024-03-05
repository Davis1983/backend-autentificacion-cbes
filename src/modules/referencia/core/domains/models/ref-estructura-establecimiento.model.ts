export class RefEstructuraEstablecimientoM {
  private _cod_departamento: number;
  private _departamento: string;
  private _cod_provincia: number;
  private _provincia: string;
  private _cod_area: number;
  private _red: string;
  private _cod_municipio: number;
  private _municipio: string;
  private _cod_establecimiento: number;
  private _establecimiento: string;
  private _ambito: string;
  private _tipo: string;
  private _cod_institucion: string;
  private _institucion: string;
  private _codclsest: string;
  private _codcatest: string;
  private _codsubsec: string;
  private _subsector: string;
  private _nivel: string;
  private _baja_logica_registro: boolean;


  constructor(cod_departamento: number, departamento: string, cod_provincia: number, provincia: string, cod_area: number, red: string, cod_municipio: number, municipio: string, cod_establecimiento: number, establecimiento: string, ambito: string, tipo: string, cod_institucion: string, institucion: string, codclsest: string, codcatest: string, codsubsec: string, subsector: string, nivel: string, baja_logica_registro: boolean) {
    this._cod_departamento = cod_departamento;
    this._departamento = departamento;
    this._cod_provincia = cod_provincia;
    this._provincia = provincia;
    this._cod_area = cod_area;
    this._red = red;
    this._cod_municipio = cod_municipio;
    this._municipio = municipio;
    this._cod_establecimiento = cod_establecimiento;
    this._establecimiento = establecimiento;
    this._ambito = ambito;
    this._tipo = tipo;
    this._cod_institucion = cod_institucion;
    this._institucion = institucion;
    this._codclsest = codclsest;
    this._codcatest = codcatest;
    this._codsubsec = codsubsec;
    this._subsector = subsector;
    this._nivel = nivel;
    this._baja_logica_registro = baja_logica_registro;
  }


  get cod_departamento(): number {
    return this._cod_departamento;
  }

  set cod_departamento(value: number) {
    this._cod_departamento = value;
  }

  get departamento(): string {
    return this._departamento;
  }

  set departamento(value: string) {
    this._departamento = value;
  }

  get cod_provincia(): number {
    return this._cod_provincia;
  }

  set cod_provincia(value: number) {
    this._cod_provincia = value;
  }

  get provincia(): string {
    return this._provincia;
  }

  set provincia(value: string) {
    this._provincia = value;
  }

  get cod_area(): number {
    return this._cod_area;
  }

  set cod_area(value: number) {
    this._cod_area = value;
  }

  get red(): string {
    return this._red;
  }

  set red(value: string) {
    this._red = value;
  }

  get cod_municipio(): number {
    return this._cod_municipio;
  }

  set cod_municipio(value: number) {
    this._cod_municipio = value;
  }

  get municipio(): string {
    return this._municipio;
  }

  set municipio(value: string) {
    this._municipio = value;
  }

  get cod_establecimiento(): number {
    return this._cod_establecimiento;
  }

  set cod_establecimiento(value: number) {
    this._cod_establecimiento = value;
  }

  get establecimiento(): string {
    return this._establecimiento;
  }

  set establecimiento(value: string) {
    this._establecimiento = value;
  }

  get ambito(): string {
    return this._ambito;
  }

  set ambito(value: string) {
    this._ambito = value;
  }

  get tipo(): string {
    return this._tipo;
  }

  set tipo(value: string) {
    this._tipo = value;
  }

  get cod_institucion(): string {
    return this._cod_institucion;
  }

  set cod_institucion(value: string) {
    this._cod_institucion = value;
  }

  get institucion(): string {
    return this._institucion;
  }

  set institucion(value: string) {
    this._institucion = value;
  }

  get codclsest(): string {
    return this._codclsest;
  }

  set codclsest(value: string) {
    this._codclsest = value;
  }

  get codcatest(): string {
    return this._codcatest;
  }

  set codcatest(value: string) {
    this._codcatest = value;
  }

  get codsubsec(): string {
    return this._codsubsec;
  }

  set codsubsec(value: string) {
    this._codsubsec = value;
  }

  get subsector(): string {
    return this._subsector;
  }

  set subsector(value: string) {
    this._subsector = value;
  }

  get nivel(): string {
    return this._nivel;
  }

  set nivel(value: string) {
    this._nivel = value;
  }

  get baja_logica_registro(): boolean {
    return this._baja_logica_registro;
  }

  set baja_logica_registro(value: boolean) {
    this._baja_logica_registro = value;
  }
}
