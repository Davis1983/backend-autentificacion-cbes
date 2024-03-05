export class AutUsuarioPerfilM {
    private _id_perfil: number;
    private _id_sistema: number;
    private _nombre_perfil: string;
    private _descripcion_perfil: string;
    private _perfil_asignado: boolean;
    private _fecha_registro: Date;
    private _usuario_registro: string;
    private _ip_registro: string;
    private _baja_logica_registro: boolean;
    private _fecha_modificacion: Date;
    private _usuario_modificacion: string;
  
    constructor(
      id_perfil: number,
      id_sistema: number,
      nombre_perfil: string,
      descripcion_perfil: string,
      perfil_asignado: boolean,
      fecha_registro: Date,
      usuario_registro: string,
      ip_registro: string,
      baja_logica_registro: boolean,
      fecha_modificacion: Date,
      usuario_modificacion: string,
    ) {
      this._id_perfil = id_perfil;
      this._id_sistema = id_sistema;
      this._nombre_perfil = nombre_perfil;
      this._descripcion_perfil = descripcion_perfil;
      this._perfil_asignado = perfil_asignado;
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
    
      get id_sistema(): number {
        return this._id_sistema;
      }
    
      set id_sistema(value: number) {
        this._id_sistema = value;
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
    
      get perfil_asignado(): boolean {
        return this._perfil_asignado;
      }
    
      set perfil_asignado(value: boolean) {
        this._perfil_asignado = value;
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
  