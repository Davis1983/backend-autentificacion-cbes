import { Client } from 'pg';

export class AutUsuarioRepository {
  constructor(private _client: Client) {}
  async findByPersonaByUsuario(usuario: string) {
    try {
      const values = [usuario];
      const sql =
        'select json_build_object(\n' +
        "        'usuario',au.usuario,\n" +
        "        'idcTipoUsuario',au.idc_tipo_usuario,\n" +
        "        'correoElectronico',au.correo_electronico,\n" +
        "        'telefono',au.telefono,\n" +
        "        'idcEstado',au.idc_estado,\n" +
        "    'persona',json_build_object(\n" +
        "        'idPersona',ap.id_persona,\n" +
        "        'numeroDocumento',ap.numero_documento,\n" +
        "        'complemento',ap.complemento,\n" +
        "        'complementoVisible',ap.complemento_visible,\n" +
        "        'nombres',ap.nombres,\n" +
        "        'primerApellido',ap.primer_apellido,\n" +
        "        'segundoApellido',ap.segundo_apellido,\n" +
        "        'fechaNacimiento',ap.fecha_nacimiento\n" +
        '        ),\n' +
        "    'profesionPersona',json_build_object(\n" +
        "        'idPersona',pf.id_persona,\n" +
        "        'idGrupoProfesion',pf.id_grupo_profesion,\n" +
        "        'matriculaProfesional',pf.matricula_profesional,\n" +
        "        'certificador',pf.certificador\n" +
        '        )\n' +
        '           )as data from autorizacion.aut_persona ap\n' +
        '          inner join autorizacion.aut_usuario au on ap.id_persona = au.id_persona\n' +
        '          inner join autorizacion.aut_profesion_persona pf on pf.id_persona=ap.id_persona\n' +
        '          and au.usuario=$1\n' +
        '          INNER JOIN parametro.par_grupo_profesion gp ON pf.id_grupo_profesion = gp.id_grupo_profesion;';
      const data = await this._client.query(sql, values);
      if (data.rows.length > 0) {
        return data.rows[0].data;
      } else {
        return null;
      }
    } catch (e) {
      return null;
    }
  }

  async usuarioRestriccion(sistema: string, usuario: string, idUsuarioRestriccion: number) {
    try {
      const values = [sistema, usuario, idUsuarioRestriccion];
      /*const sql = 'select json_build_object(\n' +
        '    \'idUsuarioRestriccion\',ur.id_usuario_restriccion,\n' +
        '    \'idSistema\',ur.id_sistema,\n' +
        '    \'idInstitucion\',ur.id_institucion,\n' +
        '    \'idcSubSector\',ur.idc_subsector,\n' +
        '    \'idcNivel\', ur.idc_nivel,\n' +
        '    \'idNivel\', ur.id_nivel,\n' +
        '    \'codDepartamento\', ur.cod_departamento,\n' +
        '    \'departamento\',ur.departamento,\n' +
        '    \'codArea\',ur.cod_area,\n' +
        '    \'area\',ur.area,\n' +
        '    \'codMunicipio\',ur.cod_municipio,\n' +
        '    \'codEstablecimiento\',ur.cod_establecimiento\n' +
        ')as data from autorizacion.aut_usuario_restriccion ur where\n' +
        'ur.usuario = $1;';*/
      const sql =
        'SELECT json_build_object(\n' +
        "        'idUsuarioRestriccion',ur.id_usuario_restriccion,\n" +
        "        'idSistema',ur.id_sistema,\n" +
        "        'identificadorSistema',ps.identificador_sistema,\n" +
        "        'idInstitucion',ur.id_institucion,\n" +
        /*"        'idcSubSector',ur.idc_subsector,\n" +*/
        "        'idcNivel', ur.idc_nivel,\n" +
        "        'idNivel', ur.id_nivel,\n" +
        "        'codDepartamento', ur.cod_departamento,\n" +
        "        'departamento',ur.departamento,\n" +
        "        'codArea',ur.cod_area,\n" +
        "        'area',ur.area,\n" +
        "        'codMunicipio',ur.cod_municipio,\n" +
        "        'codEstablecimiento',ur.cod_establecimiento,\n" +
        "        'idSubsector',ur.id_subsector,\n" +
        "        'idcNivelAtencion',pc.id_categoria\n" +
        '        )AS data FROM autorizacion.aut_usuario_restriccion ur\n' +
        '        INNER JOIN parametro.par_sistema ps ON ps.id_sistema = ur.id_sistema\n' +
        '        LEFT JOIN referencia.ref_geo_establecimiento ge ON ur.cod_establecimiento = ge.codigo_establecimiento\n' +
        '        LEFT JOIN referencia.ref_par_est_clasificacion pc ON ge.id_clasificacion = pc.id_clasificacion\n' +
        '        WHERE ur.id_sistema = $1 AND ur.usuario = $2 AND ur.id_usuario_restriccion = $3;';
      const data = await this._client.query(sql, values);
      if (data.rows.length > 0) {
        return data.rows[0].data;
      } else {
        return null;
      }
    } catch (e) {
      return null;
    }
  }

  async listaUsuarioPerfilAsignado(usuario: string, idUsuarioRestriccion: number) {
    try {
      const values = [usuario, idUsuarioRestriccion];
      const sql =
        ' SELECT\n' +
        '   au.id_usuario_restriccion,\n' +
        '   au.usuario,\n' +
        '   rp.id_perfil,\n' +
        '   apr.id_recurso AS id_recurso_superior\n' +
        ' FROM\n' +
        ' autorizacion.aut_usuario_restriccion au\n' +
        ' INNER JOIN autorizacion.aut_usuario_restriccion_perfil rp ON au.id_usuario_restriccion = rp.id_usuario_restriccion\n' +
        ' INNER JOIN autorizacion.aut_perfil_recurso apr ON rp.id_perfil = apr.id_perfil\n' +
        ' INNER JOIN autorizacion.aut_recurso ar ON apr.id_recurso = ar.id_recurso\n' +
        ' WHERE au.usuario = $1\n' +
        ' AND ar.id_recurso_superior IS NULL\n' +
        ' AND ar.baja_logica_registro = FALSE\n' +
        ' AND rp.id_usuario_restriccion = $2\n' +
        ' ORDER BY rp.id_perfil, apr.id_recurso;';
      const data = await this._client.query(sql, values);
      if (data.rows.length > 0) {
        return data.rows;
      } else {
        return null;
      }
    } catch (e) {
      return e;
    }
  }

  async listarPerfilRecursoByUsuario(idPerfil: number, idRecurso: number) {
    try {
      const values = [idPerfil, idRecurso];
      const sql =
        'WITH RECURSIVE recurso AS (\n' +
        ' SELECT\n' +
        '      id_recurso,\n' +
        '      id_recurso_superior,\n' +
        '      id_tipo_recurso,\n' +
        '      uri,\n' +
        '      nombre_recurso,\n' +
        '      es_visible,\n' +
        '      orden,\n' +
        '      icono,\n' +
        '      baja_logica_registro\n' +
        '    FROM\n' +
        '      autorizacion.aut_recurso\n' +
        '    WHERE\n' +
        '      id_recurso = $2\n' +
        '      UNION\n' +
        '    SELECT\n' +
        '      e.id_recurso,\n' +
        '      e.id_recurso_superior,\n' +
        '      e.id_tipo_recurso,\n' +
        '      e.uri,\n' +
        '      e.nombre_recurso,\n' +
        '      e.es_visible,\n' +
        '      e.orden,\n' +
        '      e.icono,\n' +
        '      e.baja_logica_registro\n' +
        '    FROM\n' +
        '      autorizacion.aut_recurso e\n' +
        '      INNER JOIN recurso s ON s.id_recurso = e.id_recurso_superior\n' +
        '    ) SELECT\n' +
        '    ar.id_recurso,\n' +
        '    ar.id_recurso_superior,\n' +
        '    ar.id_tipo_recurso,\n' +
        '    ptr.nombre_tipo_recurso,\n' +
        '    ar.uri,\n' +
        '    ar.nombre_recurso,\n' +
        '    ar.es_visible,\n' +
        '    ar.orden,\n' +
        '    ar.icono,\n' +
        '    ar.baja_logica_registro,\n' +
        '    au.nombre_recurso AS nombre_recurso_superior\n' +
        '  FROM\n' +
        '    recurso ar\n' +
        '    INNER JOIN autorizacion.aut_perfil_recurso apr ON apr.id_recurso = ar.id_recurso\n' +
        '    INNER JOIN parametro.par_tipo_recurso ptr ON ar.id_tipo_recurso = ptr.id_tipo_recurso\n' +
        '    LEFT JOIN autorizacion.aut_recurso au ON ar.id_recurso_superior = au.id_recurso\n' +
        '  WHERE apr.id_perfil = $1 AND ar.baja_logica_registro = FALSE\n' +
        '  ORDER BY ar.orden;';
      const data = await this._client.query(sql, values);
      if (data.rows.length > 0) {
        return data.rows;
      } else {
        return null;
      }
    } catch (e) {
      return e;
    }
  }

  async listaUsuarioTipoRestriccion(nivel: string, usuario: string) {
    try {
      /*
      const values = [nivel, usuario];
      switch(nivel) {
        case 'NACIONAL':  
            const sql = 'SELECT json_build_object(\n' +
            '    \'idRestriccion\', 32,\n' +
            '    \'nombreRestriccion\', \'BOLIVIA\'\n' +
            '           )AS data FROM autorizacion.aut_usuario a\n' +
            'INNER JOIN autorizacion.aut_usuario_restriccion b on a.usuario = b.usuario\n' +
            'WHERE idc_nivel = $1 AND idc_estado = \'ESTADO_USUARIO_HABILITADO\' AND a.usuario = $2';
          break;
        case 'DEPARTAMENTO': 
         
        break;
        case 'RED': 
        
          break;
        case 'MUNICIPIO': 
        
          break;
        case 'ESTABLECIMIENTO': 
        
          break;
      
        default:
          
          break;
      }
      const data = await this._client.query(sql, values);
      if (data.rows.length > 0) {
        return  data.rows[0].data;
      } else {
        return null;
      }*/
    } catch (e) {
      return e;
    }
  }

  async findByUsuario(usuario: string) {
    try {
      const values = [usuario];
      const sql =
        'SELECT json_build_object(\n' +
        "        'idPersona',ap.id_persona,\n" +
        "        'usuario',au.usuario,\n" +
        "        'nombres',ap.nombres,\n" +
        "        'primerApellido',ap.primer_apellido,\n" +
        "        'segundoApellido',ap.segundo_apellido,\n" +
        "        'numeroDocumento',ap.numero_documento,\n" +
        "        'complemento',ap.complemento,\n" +
        "        'contrasenia',au.contrasenia,\n" +
        "        'idcTipoUsuario',au.idc_tipo_usuario,\n" +
        "        'correoElectronico',au.correo_electronico,\n" +
        "        'idcEstado',au.idc_estado,\n" +
        "        'contraseniaReset',au.contrasenia_reset,\n" +
        "        'idcNivel',ar.idc_nivel\n" +
        '           )AS data FROM autorizacion.aut_persona ap\n' +
        '          INNER JOIN autorizacion.aut_usuario au ON ap.id_persona = au.id_persona\n' +
        '          LEFT JOIN autorizacion.aut_usuario_restriccion ar ON au.usuario=ar.usuario\n' +
        '          WHERE au.usuario=$1;';
      const data = await this._client.query(sql, values);
      if (data.rows.length > 0) {
        return data.rows[0].data;
      } else {
        return null;
      }
    } catch (e) {
      return null;
    }
  }
  async reporteUusuarios() {
    try {
      const sql =
        'select au.usuario, \n' +
        'app.matricula_profesional,\n' +
        'ap.numero_documento,\n' +
        'ap.nombres, \n' +
        'ap.primer_apellido,\n' +
        'ap.segundo_apellido,\n' +
        'au.correo_electronico,\n' +
        'pgp.nombre_grupo_profesion,\n' +
        'pgp.tipo_registro,\n' +
        'pcd.nombre_clasificador_detalle \n' +
        'from autorizacion.aut_persona ap \n' +
        'inner join autorizacion.aut_usuario au on ap.id_persona = au.id_persona \n' +
        'inner join autorizacion.aut_profesion_persona app on ap.id_persona = app.id_persona \n' +
        'inner join parametro.par_grupo_profesion pgp on app.id_grupo_profesion = pgp.id_grupo_profesion \n' +
        'inner join parametro.par_clasificador_detalle pcd on au.idc_estado = pcd.identificador_clasificador_detalle\n' +
        'inner join autorizacion.aut_usuario_restriccion aur on au.usuario = aur.usuario; ';
      const data = await this._client.query(sql);
      if (data.rows.length > 0) {
        return data.rows;
      } else {
        return null;
      }
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}
