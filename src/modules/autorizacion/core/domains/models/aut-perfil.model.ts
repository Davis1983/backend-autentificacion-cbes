export class AutPerfilM {
    private _id_perfil: number;
    private _id_sistema: number;
    private _id_recurso: number;
    private _id_recurso_superior: number;
    private _id_tipo_recurso: number;
    private _uri: string;
    private _nombre_recurso: string;
    private _descripcion_recurso: string;
    private _es_visible: boolean;
    private _orden: number;
    private _recurso_asignado: number;
    private _nombre_perfil: string;
    private _descripcion_perfil: string;
    private _fecha_registro: Date;
    private _usuario_registro: string;
    private _ip_registro: string;
    private _baja_logica_registro: boolean;
    private _fecha_modificacion: Date;
    private _usuario_modificacion: string;
  
    constructor(
      id_perfil: number,
      id_recurso: number,
      id_sistema: number,
      id_recurso_superior: number,
      id_tipo_recurso: number,
      uri: string,
      nombre_recurso: string,
      descripcion_recurso: string,
      es_visible: boolean,
      orden: number,
      nombre_perfil: string,
      descripcion_perfil: string,
      fecha_registro: Date,
      usuario_registro: string,
      ip_registro: string,
      baja_logica_registro: boolean,
      fecha_modificacion: Date,
      usuario_modificacion: string,
    ) {
      this._id_perfil = id_perfil;
      this._id_recurso = id_recurso;
      this._id_sistema = id_sistema;
      this._id_recurso_superior = id_recurso_superior;
      this._id_tipo_recurso = id_tipo_recurso;
      this._uri = uri;
      this._nombre_recurso = nombre_recurso;
      this._descripcion_recurso = descripcion_recurso;
      this._es_visible = es_visible;
      this._orden = orden;
      this._nombre_perfil = nombre_perfil;
      this._descripcion_perfil = descripcion_perfil;
      this._fecha_registro = fecha_registro;
      this._usuario_registro = usuario_registro;
      this._ip_registro = ip_registro;
      this._baja_logica_registro = baja_logica_registro;
      this._fecha_modificacion = fecha_modificacion;
      this._usuario_modificacion = usuario_modificacion;
    }
  
    get id_perfil(): number {
      return this._id_perfil;
    }
  
    set id_perfil(value: number) {
      this._id_perfil = value;
    }
  
    get id_recurso(): number {
        return this._id_recurso;
      }
    
      set id_recurso(value: number) {
        this._id_recurso = value;
      }
    
      get id_sistema(): number {
        return this._id_sistema;
      }
    
      set id_sistema(value: number) {
        this._id_sistema = value;
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
    
      get descripcion_recurso(): string {
        return this._descripcion_recurso;
      }
    
      set descripcion_recurso(value: string) {
        this._descripcion_recurso = value;
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
  
    get nombre_perfil(): string {
      return this._nombre_perfil;
    }
  
    set nombre_perfil(value: string) {
      this._nombre_perfil = value;
    }
  
    get descripcion_perfil(): string {
      return this._descripcion_perfil;
    }
  
    set descripcion_perfil(value: string) {
      this._descripcion_perfil = value;
    }
  
    get fecha_registro(): Date {
      return this._fecha_registro;
    }
  
    set fecha_registro(value: Date) {
      this._fecha_registro = value;
    }
  
    get usuario_registro(): string {
      return this._usuario_registro;
    }
  
    set usuario_registro(value: string) {
      this._usuario_registro = value;
    }
  
    get ip_registro(): string {
      return this._ip_registro;
    }
  
    set ip_registro(value: string) {
      this._ip_registro = value;
    }
  
    get baja_logica_registro(): boolean {
      return this._baja_logica_registro;
    }
  
    set baja_logica_registro(value: boolean) {
      this._baja_logica_registro = value;
    }
  
    get fecha_modificacion(): Date {
      return this._fecha_modificacion;
    }
  
    set fecha_modificacion(value: Date) {
      this._fecha_modificacion = value;
    }
  
    get usuario_modificacion(): string {
      return this._usuario_modificacion;
    }
  
    set usuario_modificacion(value: string) {
      this._usuario_modificacion = value;
    }
  }
  