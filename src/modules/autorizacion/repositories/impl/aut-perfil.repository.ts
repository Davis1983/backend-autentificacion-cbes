import { Client } from 'pg';

export class AutPerfilRespository {
  constructor(private _client: Client) {}

  async listarAutRecursoByIdPerfil(idRecurso: number, idPerfil: number) {
    try {
      const values = [idRecurso, idPerfil];
      const sql =
        'WITH RECURSIVE recurso AS (\n' +
        ' SELECT\n' +
        '      id_recurso,\n' +
        '      id_sistema,\n' +
        '      id_recurso_superior,\n' +
        '      id_tipo_recurso,\n' +
        '      uri,\n' +
        '      nombre_recurso,\n' +
        '      descripcion_recurso,\n' +
        '      es_visible,\n' +
        '      orden,\n' +
        '      baja_logica_registro\n' +
        '    FROM\n' +
        '      autorizacion.aut_recurso\n' +
        '    WHERE\n' +
        '      id_recurso = $1 UNION\n' +
        '    SELECT\n' +
        '      e.id_recurso,\n' +
        '      e.id_sistema,\n' +
        '      e.id_recurso_superior,\n' +
        '      e.id_tipo_recurso,\n' +
        '      e.uri,\n' +
        '      e.nombre_recurso,\n' +
        '      e.descripcion_recurso,\n' +
        '      e.es_visible,\n' +
        '      e.orden,\n' +
        '      e.baja_logica_registro\n' +
        '    FROM\n' +
        '      autorizacion.aut_recurso e\n' +
        '      INNER JOIN recurso s ON s.id_recurso = e.id_recurso_superior\n' +
        '    ) SELECT\n' +
        '    ar.id_recurso,\n' +
        '    ar.id_sistema,\n' +
        '    ar.id_recurso_superior,\n' +
        '    ar.id_tipo_recurso,\n' +
        '    ar.uri,\n' +
        '    ps.nombre_sistema,\n' +
        '    ar.nombre_recurso,\n' +
        '    ptr.nombre_tipo_recurso,\n' +
        '    au.nombre_recurso AS nombre_recurso_superior,\n' +
        '    ar.descripcion_recurso,\n' +
        '    ar.es_visible,\n' +
        '    ar.orden,\n' +
        '    (CASE WHEN ( SELECT COUNT ( * ) FROM autorizacion.aut_perfil_recurso pr WHERE pr.id_perfil = $2 AND pr.id_recurso = ar.id_recurso ) > 0 THEN TRUE ELSE FALSE END) AS recurso_asignado,\n' +
        '    ar.baja_logica_registro\n' +
        '  FROM\n' +
        '    recurso ar\n' +
        '    INNER JOIN parametro.par_sistema ps ON ar.id_sistema = ps.id_sistema\n' +
        '    INNER JOIN parametro.par_tipo_recurso ptr ON ar.id_tipo_recurso = ptr.id_tipo_recurso\n' +
        '    LEFT JOIN autorizacion.aut_recurso au ON ar.id_recurso_superior = au.id_recurso\n' +
        '  WHERE ar.baja_logica_registro = FALSE\n' +
        '  ORDER BY\n' +
        '  ar.orden;';
      const data = await this._client.query(sql, values);
      return data.rows;
      if (data.rows.length > 0) {
        return data.rows;
      } else {
        return null;
      }
    } catch (e) {
      return null;
    }
  }

  async obtenerIdSuperiorAutRecurso(idSistema: number) {
    try {
      const values = [idSistema];
      const sql =
        'SELECT ar.id_recurso FROM autorizacion.aut_recurso ar WHERE ar.id_sistema = $1 AND ar.baja_logica_registro = FALSE AND ar.id_recurso_superior IS NULL ORDER BY ar.id_recurso ASC;';
      const data = await this._client.query(sql, values);
      if (data.rows.length > 0) {
        return data.rows;
      } else {
        return null;
      }
    } catch (e) {
      return null;
    }
  }

  async listarPerfilByIdSistema(idSistema:number){
    try{
      const values = [idSistema];
      const sql = 'select json_build_object(\n' +
          '    \'idPerfil\',ap.id_perfil,\n' +
          '    \'idSistema\',ap.id_sistema,\n' +
          '    \'nombrePerfil\',ap.nombre_perfil,\n' +
          '    \'descripcionPerfil\',ap.descripcion_perfil\n' +
          '           ) as data from autorizacion.aut_perfil ap where ap.id_sistema=$1;';
      const data = await this._client.query(sql, values);
      if (data.rows.length > 0) {
        return  data.rows;
      } else {
        return null;
      }
    }catch (e){
      return null;
    }
  }

  async listarPerfilRecursoByUsuario(idRecurso: number) {
    try {
      const values = [idRecurso];
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
        '      id_recurso = $1\n' +
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
        '    ar.id_recurso,\n'+
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
        '    INNER JOIN parametro.par_tipo_recurso ptr ON ar.id_tipo_recurso = ptr.id_tipo_recurso\n' +
        '    LEFT JOIN autorizacion.aut_recurso au ON ar.id_recurso_superior = au.id_recurso\n' +
        '  WHERE ar.baja_logica_registro = FALSE\n' +
        '  ORDER BY ar.orden;';
      const data = await this._client.query(sql, values);
      return data.rows;
      if (data.rows.length > 0) {
        return data.rows;
      } else {
        return null;
      }
    } catch (e) {
      return e;
    }
  }
  async findByPersonaByUsuario(usuario:string){
    try {
      const values = [usuario];
      const sql = 'select json_build_object(\n' +
        '        \'usuario\',au.usuario,\n' +
        '        \'idcTipoUsuario\',au.idc_tipo_usuario,\n' +
        '        \'correoElectronico\',au.correo_electronico,\n' +
        '        \'telefono\',au.telefono,\n' +
        '        \'idcEstado\',au.idc_estado,\n' +
        '    \'persona\',json_build_object(\n' +
        '        \'idPersona\',ap.id_persona,\n' +
        '        \'numeroDocumento\',ap.numero_documento,\n' +
        '        \'complemento\',ap.complemento,\n' +
        '        \'complementoVisible\',ap.complemento_visible,\n' +
        '        \'nombres\',ap.nombres,\n' +
        '        \'primerApellido\',ap.primer_apellido,\n' +
        '        \'segundoApellido\',ap.segundo_apellido,\n' +
        '        \'fechaNacimiento\',ap.fecha_nacimiento\n' +
        '        ),\n' +
        '    \'profesionPersona\',json_build_object(\n' +
        '        \'idPersona\',pf.id_persona,\n' +
        '        \'idGrupoProfesion\',pf.id_grupo_profesion,\n' +
        '        \'matriculaProfesional\',pf.matricula_profesional,\n' +
        '        \'certificador\',pf.certificador\n' +
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

    }catch (e){
      return null;
    }
  }

  async usuarioRestriccion(usuario:string){
    try {
      const values = [usuario];
      const sql = 'SELECT json_build_object(\n' +
        '    \'idUsuarioRestriccion\',ur.id_usuario_restriccion,\n' +
        '    \'idSistema\',ur.id_sistema,\n' +
        '    \'idInstitucion\',ur.id_institucion,\n' +
        '    \'idSubsector\',ur.id_subsector,\n' +
        '    \'idcNivel\', ur.idc_nivel,\n' +
        '    \'idNivel\', ur.id_nivel,\n' +
        '    \'codDepartamento\', ur.cod_departamento,\n' +
        '    \'departamento\',ur.departamento,\n' +
        '    \'codArea\',ur.cod_area,\n' +
        '    \'area\',ur.area,\n' +
        '    \'codMunicipio\',ur.cod_municipio,\n' +
        '    \'codEstablecimiento\',ur.cod_establecimiento\n' +
        ')AS data from autorizacion.aut_usuario_restriccion ur where\n' +
        'ur.usuario = $1;';
      const data = await this._client.query(sql, values);
      if (data.rows.length > 0) {
        return  data.rows[0].data;
      } else {
        return null;
      }
    }catch (e){
      return null;
    }
  }

}
