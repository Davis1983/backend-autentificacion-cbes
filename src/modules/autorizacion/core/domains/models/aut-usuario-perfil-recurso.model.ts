export class AutUsuarioPerfilRecursoM {
    private _id_recurso: number;
    private _id_recurso_superior: number;
    private _id_tipo_recurso: number;
    private _nombre_tipo_recurso: string;
    private _uri: string;
    private _nombre_recurso: string;
    private _es_visible: boolean;
    private _orden: number;
    private _icono: string;
    private _nombre_recurso_superior: string;
    private _baja_logica_registro: boolean;
  
    constructor(
      id_recurso: number,
      id_recurso_superior: number,
      id_tipo_recurso: number,
      nombre_tipo_recurso: string,
      uri: string,
      nombre_recurso: string,
      es_visible: boolean,
      orden: number,
      icono: string,
      nombre_recurso_superior: string,
      baja_logica_registro: boolean,
    ) {
      this._id_recurso = id_recurso;
      this._id_recurso_superior = id_recurso_superior;
      this._id_tipo_recurso = id_tipo_recurso;
      this._nombre_tipo_recurso = nombre_tipo_recurso;
      this._uri = uri;
      this._nombre_recurso = nombre_recurso;
      this._es_visible = es_visible;
      this._orden = orden;
      this._icono = icono;
      this._nombre_recurso_superior = nombre_recurso_superior;
      this._baja_logica_registro = baja_logica_registro;
    }
   
    get id_recurso(): number {
        return this._id_recurso;
      }
    
      set id_recurso(value: number) {
        this._id_recurso = value;
      }
       
      get id_recurso_superior(): number {
        return this._id_recurso_superior;
      }
    
      set id_recurso_superior(value: number) {
        this._id_recurso_superior = value;
      }
    
      get id_tipo_recurso(): number {
        return this._id_tipo_recurso;
      }
    
      set id_tipo_recurso(value: number) {
        this._id_tipo_recurso = value;
      }

      get nombre_tipo_recurso(): string {
        return this._nombre_tipo_recurso;
      }
    
      set nombre_tipo_recurso(value: string) {
        this._nombre_tipo_recurso = value;
      }
    
      get uri(): string {
        return this._uri;
      }
    
      set uri(value: string) {
        this._uri = value;
      } 

      get nombre_recurso(): string {
        return this._nombre_recurso;
      }
    
      set nombre_recurso(value: string) {
        this._nombre_recurso = value;
      }
    
      get es_visible(): boolean {
        return this._es_visible;
      }
    
      set es_visible(value: boolean) {
        this._es_visible = value;
      }
    
      get orden(): number {
        return this._orden;
      }
    
      set orden(value: number) {
        this._orden = value;
      }

      get icono(): string {
        return this._icono;
      }
    
      set icono(value: string) {
        this._icono = value;
      }

      get nombre_recurso_superior(): string {
        return this._nombre_recurso_superior;
      }
    
      set nombre_recurso_superior(value: string) {
        this._nombre_recurso_superior = value;
      }

      get baja_logica_registro(): boolean {
        return this._baja_logica_registro;
      }
    
      set baja_logica_registro(value: boolean) {
        this._baja_logica_registro = value;
      }

    
  }
  