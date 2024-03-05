export class AutPersonaUsuarioM {
    private _id_persona: number;
    private _nombres: string;
    private _primer_apellido: string;
    private _segundo_apellido: string;
    private _fecha_nacimiento: Date;
    private _numero_documento: string;
    private _expedicion: string;
    private _complemento: string;
    private _complemento_visible: boolean;
    private _usuario: string;
    private _correo_electronico: string;
    private _telefono: string;
    private _idc_estado: string;
    private _id_grupo_profesion: number;
    private _matricula_profesional: string;
    private _nombre_grupo_profesion: string;
    private _nombre_descripcion_profesion: string;
    private _fecha_registro: Date;
    private _usuario_registro: string;
    private _ip_registro: string;
    private _baja_logica_registro: boolean;
    private _fecha_modificacion: Date;
    private _usuario_modificacion: string;
  
    constructor(
    id_persona: number,
    nombres: string,
    primer_apellido: string,
    segundo_apellido: string,
    fecha_nacimiento: Date,
    numero_documento: string,
    expedicion: string,
    complemento: string,
    complemento_visible: boolean,
    usuario: string,
    correo_electronico: string,
    telefono: string,
    idc_estado: string,
    id_grupo_profesion: number,
    matricula_profesional: string,
    nombre_grupo_profesion: string,
    nombre_descripcion_profesion: string,
      fecha_registro: Date,
      usuario_registro: string,
      ip_registro: string,
      baja_logica_registro: boolean,
      fecha_modificacion: Date,
      usuario_modificacion: string,
    ) {
        this._id_persona = id_persona;
        this._nombres = nombres;
        this._primer_apellido = primer_apellido;
        this._segundo_apellido = segundo_apellido;
        this._fecha_nacimiento = fecha_nacimiento;
        this._numero_documento = numero_documento;
        this._expedicion = expedicion;
        this._complemento = complemento;
        this._complemento_visible = complemento_visible;
        this._usuario = usuario;
        this._correo_electronico = correo_electronico;
        this._telefono = telefono;
        this._idc_estado = idc_estado;
        this._id_grupo_profesion = id_grupo_profesion;
        this._matricula_profesional = matricula_profesional;
        this._nombre_grupo_profesion = nombre_grupo_profesion;
        this._nombre_descripcion_profesion = nombre_descripcion_profesion;
      this._fecha_registro = fecha_registro;
      this._usuario_registro = usuario_registro;
      this._ip_registro = ip_registro;
      this._baja_logica_registro = baja_logica_registro;
      this._fecha_modificacion = fecha_modificacion;
      this._usuario_modificacion = usuario_modificacion;
    }
   
    get id_persona(): number {
        return this._id_persona;
      }
    
      set id_persona(value: number) {
        this._id_persona = value;
      }
        
      get nombres(): string {
        return this._nombres;
      }
    
      set nombres(value: string) {
        this._nombres = value;
      }
    
      get primer_apellido(): string {
        return this._primer_apellido;
      }
    
      set primer_apellido(value: string) {
        this._primer_apellido = value;
      }  

      get segundo_apellido(): string {
        return this._segundo_apellido;
      }
    
      set segundo_apellido(value: string) {
        this._segundo_apellido = value;
      }

      get fecha_nacimiento(): Date {
        return this._fecha_nacimiento;
      }
    
      set fecha_nacimiento(value: Date) {
        this._fecha_nacimiento = value;
      }

      get numero_documento(): string {
        return this._numero_documento;
      }
    
      set numero_documento(value: string) {
        this._numero_documento = value;
      }

      get expedicion(): string {
        return this._expedicion;
      }
    
      set expedicion(value: string) {
        this._expedicion = value;
      }

      get complemento(): string {
        return this._complemento;
      }
    
      set complemento(value: string) {
        this._complemento = value;
      }

      get complemento_visible(): boolean {
        return this._complemento_visible;
      }
    
      set complemento_visible(value: boolean) {
        this._complemento_visible = value;
      }
    
      get usuario(): string {
        return this._usuario;
      }
    
      set usuario(value: string) {
        this._usuario = value;
      }
       
      get correo_electronico(): string {
        return this._correo_electronico;
      }
    
      set correo_electronico(value: string) {
        this._correo_electronico = value;
      }

      get telefono(): string {
        return this._telefono;
      }
    
      set telefono(value: string) {
        this._telefono = value;
      }

      get idc_estado(): string {
        return this._idc_estado;
      }
    
      set idc_estado(value: string) {
        this._idc_estado = value;
      }
  
      get id_grupo_profesion(): number {
        return this._id_grupo_profesion;
      }
    
      set id_grupo_profesion(value: number) {
        this._id_grupo_profesion = value;
      }

      get matricula_profesional(): string {
        return this._matricula_profesional;
      }
    
      set matricula_profesional(value: string) {
        this._matricula_profesional = value;
      }

      get nombre_grupo_profesion(): string {
        return this._nombre_grupo_profesion;
      }
    
      set nombre_grupo_profesion(value: string) {
        this._nombre_grupo_profesion = value;
      }

      get nombre_descripcion_profesion(): string {
        return this._nombre_descripcion_profesion;
      }
    
      set nombre_descripcion_profesion(value: string) {
        this._nombre_descripcion_profesion = value;
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
  