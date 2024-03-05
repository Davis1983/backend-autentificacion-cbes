import { Client } from 'pg';
import { formatoFechaSegip } from 'src/common/utility/all.utill';

export class AutPersonaUsuarioRespository {
  constructor(private _client: Client) {}

  async listaPersonaUsuario(idPersona: number) {
    try {
      const values = [idPersona];
      const sql =
        ' SELECT\n' +
        '   p.id_persona,\n' +
        '   p.nombres,\n' +
        '   p.primer_apellido,\n' +
        '   p.segundo_apellido,\n' +
        '   p.fecha_nacimiento,\n' +
        '   p.numero_documento,\n' +
        '   p.expedicion,\n' +
        '   p.complemento,\n' +
        '   p.complemento_visible,\n' +
        '   u.usuario,\n' +
        '   u.correo_electronico,\n' +
        '   u.telefono,\n' +
        '   u.idc_estado,\n' +
        '   pf.id_grupo_profesion,\n' +
        '   pf.matricula_profesional,\n' +
        '   gp.nombre_grupo_profesion,\n' +
        '   gp.nombre_descripcion_profesion\n' +
        ' FROM\n' +
        ' autorizacion.aut_persona p\n' +
        ' INNER JOIN autorizacion.aut_usuario u ON p.id_persona = u.id_persona\n' +
        ' INNER JOIN autorizacion.aut_profesion_persona pf ON p.id_persona = pf.id_persona\n' +
        ' INNER JOIN parametro.par_grupo_profesion gp ON pf.id_grupo_profesion = gp.id_grupo_profesion\n' +
        ' WHERE p.id_persona = $1;';
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

  async findByPersonaByIdProfesionUsuario(idPersona: number) {
    try {
      const values = [idPersona];
      const sql =
        'select json_build_object(\n' +
        "    'idPersona', ap.id_persona,\n" +
        "    'numeroDocumento',ap.numero_documento,\n" +
        "    'complemento',ap.complemento,\n" +
        "    'complementoVisible', ap.complemento_visible,\n" +
        "    'nombres',ap.nombres,\n" +
        "    'primerApellido',ap.primer_apellido,\n" +
        "    'segundoApellido',ap.segundo_apellido,\n" +
        "    'fechaNacimiento',ap.fecha_nacimiento,\n" +
        "    'expedicion',ap.expedicion,\n" +
        "    'usuario',au.usuario,\n" +
        //'    \'idcNivel\',au.idc_nivel,\n' +
        "    'idcTipoUsuario',au.idc_tipo_usuario,\n" +
        //'    \'idInstitucion\',au.id_institucion,\n' +
        "    'correoElectronico',au.correo_electronico,\n" +
        "    'telefono',au.telefono,\n" +
        "    'idcEstado',au.idc_estado,\n" +
        "    'idGrupoProfesion',pf.id_grupo_profesion,\n" +
        "    'nombreGrupoProfesion',gp.nombre_grupo_profesion,\n" +
        "    'matriculaProfesional',pf.matricula_profesional,\n" +
        "    'certificador',pf.certificador\n" +
        '           )as data from autorizacion.aut_persona ap\n' +
        'inner join autorizacion.aut_usuario au on ap.id_persona = au.id_persona\n' +
        'inner join autorizacion.aut_profesion_persona pf on pf.id_persona=ap.id_persona\n' +
        'and ap.id_persona = $1\n' +
        'INNER JOIN parametro.par_grupo_profesion gp ON pf.id_grupo_profesion = gp.id_grupo_profesion;';
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

  //async usuarioRestriccion(usuario:string, idcNivel:string){
  async usuarioRestriccion(usuario: string) {
    try {
      const values = [usuario];
      const sql =
        'SELECT json_build_object(\n' +
        "    'idUsuarioRestriccion',ur.id_usuario_restriccion,\n" +
        "    'idSistema',ur.id_sistema,\n" +
        "    'idInstitucion',ur.id_institucion,\n" +
        "    'idSubsector',ur.id_subsector,\n" +
        "    'nombreSubsector',ur.nombre_subsector,\n" +
        "    'idcNivel', ur.idc_nivel,\n" +
        "    'idNivel', ur.id_nivel,\n" +
        "    'codDepartamento', ur.cod_departamento,\n" +
        "    'departamento',ur.departamento,\n" +
        "    'codArea',ur.cod_area,\n" +
        "    'area',ur.area,\n" +
        "    'codMunicipio',ur.cod_municipio,\n" +
        "    'codEstablecimiento',ur.cod_establecimiento\n" +
        ')AS data FROM autorizacion.aut_usuario_restriccion ur WHERE\n' +
        'LEFT JOIN referencia.ref_par_est_subsector ps ON ur.id_subsector = ps.id_subsector\n'
        'ur.usuario = $1;';
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

  async usuarioRestriccionPerfil(idUsuarioRestriccion: number) {
    try {
      const values = [idUsuarioRestriccion];
      const sql =
        'select array_agg(urp.id_perfil) as data from autorizacion.aut_usuario_restriccion_perfil urp\n' +
        'where urp.id_usuario_restriccion = $1;';
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

  async  listaPersonaUsuarioFilter(
    idSistema: number,
    idInstitucion: number,
    idcNivel: string,
    idSubsector: number,
    codDepartamento: number,
    codMunicipio: number,
    codArea: number,
    codEstablecimiento: number,
    usuario: string,
  ) {
    var values = null;
    let campos = '';
    var filter = '';
    var contValues = 0;
    try {
      switch (idcNivel) {
        case 'NACIONAL':
          if (idSubsector > 0) {
            contValues = contValues + 1;
            campos = campos + idSubsector + ',';
            filter = filter + ' AND ps.id_subsector = $' + contValues;
          }
          if (idInstitucion > 0) {
            contValues = contValues + 1;
            campos = campos + idInstitucion + ',';
            filter = filter + ' AND ge.id_institucion = $' + contValues;
          }
          if (codDepartamento > 0) {
            contValues = contValues + 1;
            campos = campos + codDepartamento + ',';
            filter = filter + ' AND aur.cod_departamento = $' + contValues;
          }
          if (codArea > 0) {
            contValues = contValues + 1;
            campos = campos + codArea + ',';
            filter = filter + ' AND aur.cod_area = $' + contValues;
          }
          if (codMunicipio > 0) {
            contValues = contValues + 1;
            campos = campos + codMunicipio + ',';
            filter = filter + ' AND aur.cod_municipio = $' + contValues;
          }
          if (codEstablecimiento > 0) {
            contValues = contValues + 1;
            campos = campos + codEstablecimiento + ',';
            filter = filter + ' AND aur.cod_establecimiento = $' + contValues;
          }
          campos = campos.substring(0, campos.length - 1);
          let arr = campos.split(',');
          if (contValues == 1) {
            values = [parseInt(arr[0], 10)];
          }
          if (contValues == 2) {
            values = [parseInt(arr[0], 10), parseInt(arr[1], 10)];
          }
          if (contValues == 3) {
            values = [
              parseInt(arr[0], 10),
              parseInt(arr[1], 10),
              parseInt(arr[2], 10),
            ];
          }
          if (contValues == 4) {
            values = [
              parseInt(arr[0], 10),
              parseInt(arr[1], 10),
              parseInt(arr[2], 10),
              parseInt(arr[3], 10),
            ];
          }
          if (contValues == 5) {
            values = [
              parseInt(arr[0], 10),
              parseInt(arr[1], 10),
              parseInt(arr[2], 10),
              parseInt(arr[3], 10),
              parseInt(arr[4], 10),
            ];
          }
          if (contValues == 6) {
            values = [
              parseInt(arr[0], 10),
              parseInt(arr[1], 10),
              parseInt(arr[2], 10),
              parseInt(arr[3], 10),
              parseInt(arr[4], 10),
              parseInt(arr[5], 10),
            ];
          }
          break;
        case 'SEDES':
          values = [codDepartamento];
          filter = ' AND aur.cod_departamento = $1';
          break;
        case 'DEPARTAMENTO':
          if (idSubsector > 0) {
            contValues = contValues + 1;
            campos = campos + idSubsector + ',';
            filter = filter + ' AND aur.id_subsector = $' + contValues;
          }
          if (idInstitucion > 0) {
            contValues = contValues + 1;
            campos = campos + idInstitucion + ',';
            filter = filter + ' AND aur.id_institucion = $' + contValues;
          }
          if (codDepartamento > 0) {
            contValues = contValues + 1;
            campos = campos + codDepartamento + ',';
            filter = filter + ' AND aur.cod_departamento = $' + contValues;
          }
          if (codArea > 0) {
            contValues = contValues + 1;
            campos = campos + codArea + ',';
            filter = filter + ' AND aur.cod_area = $' + contValues;
          }
          if (codMunicipio > 0) {
            contValues = contValues + 1;
            campos = campos + codMunicipio + ',';
            filter = filter + ' AND aur.cod_municipio = $' + contValues;
          }
          if (codEstablecimiento > 0) {
            contValues = contValues + 1;
            campos = campos + codEstablecimiento + ',';
            filter = filter + ' AND aur.cod_establecimiento = $' + contValues;
          }
          filter = filter + ' AND aur.idc_nivel IN (\'RED\', \'MUNICIPIO\', \'ESTABLECIMIENTO\')';
          campos = campos.substring(0, campos.length - 1);
          let arrDepto = campos.split(',');
          if (contValues == 1) {
            values = [parseInt(arrDepto[0], 10)];
          }
          if (contValues == 2) {
            values = [parseInt(arrDepto[0], 10), parseInt(arrDepto[1], 10)];
          }
          if (contValues == 3) {
            values = [
              parseInt(arrDepto[0], 10),
              parseInt(arrDepto[1], 10),
              parseInt(arrDepto[2], 10),
            ];
          }
          if (contValues == 4) {
            values = [
              parseInt(arrDepto[0], 10),
              parseInt(arrDepto[1], 10),
              parseInt(arrDepto[2], 10),
              parseInt(arrDepto[3], 10),
            ];
          }
          if (contValues == 5) {
            values = [
              parseInt(arrDepto[0], 10),
              parseInt(arrDepto[1], 10),
              parseInt(arrDepto[2], 10),
              parseInt(arrDepto[3], 10),
              parseInt(arrDepto[4], 10),
            ];
          }
          if (contValues == 6) {
            values = [
              parseInt(arrDepto[0], 10),
              parseInt(arrDepto[1], 10),
              parseInt(arrDepto[2], 10),
              parseInt(arrDepto[3], 10),
              parseInt(arrDepto[4], 10),
              parseInt(arrDepto[5], 10),
            ];
          }
          break;
        case 'RED':
          if (idSubsector > 0) {
            contValues = contValues + 1;
            campos = campos + idSubsector + ',';
            filter = filter + ' AND aur.id_subsector = $' + contValues;
          }
          if (idInstitucion > 0) {
            contValues = contValues + 1;
            campos = campos + idInstitucion + ',';
            filter = filter + ' AND aur.id_institucion = $' + contValues;
          }
          if (codDepartamento > 0) {
            contValues = contValues + 1;
            campos = campos + codDepartamento + ',';
            filter = filter + ' AND aur.cod_departamento = $' + contValues;
          }
          if (codArea > 0) {
            contValues = contValues + 1;
            campos = campos + codArea + ',';
            filter = filter + ' AND aur.cod_area = $' + contValues;
          }
          if (codMunicipio > 0) {
            contValues = contValues + 1;
            campos = campos + codMunicipio + ',';
            filter = filter + ' AND aur.cod_municipio = $' + contValues;
          }
          if (codEstablecimiento > 0) {
            contValues = contValues + 1;
            campos = campos + codEstablecimiento + ',';
            filter = filter + ' AND aur.cod_establecimiento = $' + contValues;
          }
          filter = filter + ' AND aur.idc_nivel IN (\'MUNICIPIO\', \'ESTABLECIMIENTO\')';
          campos = campos.substring(0, campos.length - 1);
          let arrRed = campos.split(',');
          if (contValues == 1) {
            values = [parseInt(arrRed[0], 10)];
          }
          if (contValues == 2) {
            values = [parseInt(arrRed[0], 10), parseInt(arrRed[1], 10)];
          }
          if (contValues == 3) {
            values = [
              parseInt(arrRed[0], 10),
              parseInt(arrRed[1], 10),
              parseInt(arrRed[2], 10),
            ];
          }
          if (contValues == 4) {
            values = [
              parseInt(arrRed[0], 10),
              parseInt(arrRed[1], 10),
              parseInt(arrRed[2], 10),
              parseInt(arrRed[3], 10),
            ];
          }
          if (contValues == 5) {
            values = [
              parseInt(arrRed[0], 10),
              parseInt(arrRed[1], 10),
              parseInt(arrRed[2], 10),
              parseInt(arrRed[3], 10),
              parseInt(arrRed[4], 10),
            ];
          }
          if (contValues == 6) {
            values = [
              parseInt(arrRed[0], 10),
              parseInt(arrRed[1], 10),
              parseInt(arrRed[2], 10),
              parseInt(arrRed[3], 10),
              parseInt(arrRed[4], 10),
              parseInt(arrRed[5], 10),
            ];
          }
          break;
        case 'MUNICIPIO':
          if (idSubsector > 0) {
            contValues = contValues + 1;
            campos = campos + idSubsector + ',';
            filter = filter + ' AND aur.id_subsector = $' + contValues;
          }
          if (idInstitucion > 0) {
            contValues = contValues + 1;
            campos = campos + idInstitucion + ',';
            filter = filter + ' AND aur.id_institucion = $' + contValues;
          }
          if (codDepartamento > 0) {
            contValues = contValues + 1;
            campos = campos + codDepartamento + ',';
            filter = filter + ' AND aur.cod_departamento = $' + contValues;
          }
          if (codArea > 0) {
            contValues = contValues + 1;
            campos = campos + codArea + ',';
            filter = filter + ' AND aur.cod_area = $' + contValues;
          }
          if (codMunicipio > 0) {
            contValues = contValues + 1;
            campos = campos + codMunicipio + ',';
            filter = filter + ' AND aur.cod_municipio = $' + contValues;
          }
          if (codEstablecimiento > 0) {
            contValues = contValues + 1;
            campos = campos + codEstablecimiento + ',';
            filter = filter + ' AND aur.cod_establecimiento = $' + contValues;
          }
          filter = filter + ' AND aur.idc_nivel IN (\'ESTABLECIMIENTO\')';
          campos = campos.substring(0, campos.length - 1);
          let arrMunicipio = campos.split(',');
          if (contValues == 1) {
            values = [parseInt(arrMunicipio[0], 10)];
          }
          if (contValues == 2) {
            values = [
              parseInt(arrMunicipio[0], 10),
              parseInt(arrMunicipio[1], 10),
            ];
          }
          if (contValues == 3) {
            values = [
              parseInt(arrMunicipio[0], 10),
              parseInt(arrMunicipio[1], 10),
              parseInt(arrMunicipio[2], 10),
            ];
          }
          if (contValues == 4) {
            values = [
              parseInt(arrMunicipio[0], 10),
              parseInt(arrMunicipio[1], 10),
              parseInt(arrMunicipio[2], 10),
              parseInt(arrMunicipio[3], 10),
            ];
          }
          if (contValues == 5) {
            values = [
              parseInt(arrMunicipio[0], 10),
              parseInt(arrMunicipio[1], 10),
              parseInt(arrMunicipio[2], 10),
              parseInt(arrMunicipio[3], 10),
              parseInt(arrMunicipio[4], 10),
            ];
          }
          if (contValues == 6) {
            values = [
              parseInt(arrMunicipio[0], 10),
              parseInt(arrMunicipio[1], 10),
              parseInt(arrMunicipio[2], 10),
              parseInt(arrMunicipio[3], 10),
              parseInt(arrMunicipio[4], 10),
              parseInt(arrMunicipio[5], 10),
            ];
          }
          break;
        case 'ESTABLECIMIENTO':
          values = [codEstablecimiento];
          filter = ' AND aur.cod_establecimiento = $1';
          break;
        default:
          break;
      }
      const sql =
        'SELECT DISTINCT(ap.id_persona) AS "idPersona",\n'+
        'ap.numero_documento AS "numeroDocumento",\n' +
        'ap.complemento,\n' +
        'ap.complemento_visible AS "complementoVisible",\n'+
        'ap.nombres,\n'+
        'ap.primer_apellido AS "primerApellido",\n' +
        'ap.segundo_apellido "segundoApellido",\n'+
        'au.usuario,au.idc_tipo_usuario AS "idcTipoUsuario",\n'+
        'au.correo_electronico AS "correoElectronico",\n' +
        'au.telefono,au.idc_estado AS "idcEstado",\n' +
        'pcd.descripcion_clasificador_detalle AS "tipoUsuario",\n' +
        'pcd2.descripcion_clasificador_detalle AS "estadoUsuario",\n' +
        'au.correo_electronico as "correoElectronico",\n' +
        'aur.idc_nivel AS "idcNivel",\n'+ 
        'COALESCE (sub.nombre_subsector, \'-\') AS "nombreSubsector",\n'+
        'COALESCE (pin.nombre_institucion, \'-\') AS "nombreInstitucion",\n'+
        'COALESCE (dep.nombre_departamento, \'-\') AS "nombreDepartamento",\n'+
        'COALESCE (ga.nombre_area, \'-\') AS "nombreArea",\n'+
        'COALESCE (gm.nombre_municipio, \'-\') AS "nombreMunicipio",\n'+
        'COALESCE (ge.nombre_establecimiento, \'-\') AS "nombreEstablecimiento"\n'+
        'FROM autorizacion.aut_persona ap\n' +
        'INNER JOIN autorizacion.aut_usuario au on ap.id_persona = au.id_persona\n' +
        'INNER JOIN parametro.par_clasificador_detalle pcd on au.idc_tipo_usuario = pcd.identificador_clasificador_detalle\n' +
        'INNER JOIN parametro.par_clasificador_detalle pcd2 on au.idc_estado = pcd2.identificador_clasificador_detalle\n' +
        'LEFT JOIN autorizacion.aut_usuario_restriccion aur ON au.usuario = aur.usuario\n' +
        'LEFT JOIN referencia.ref_par_est_subsector sub ON aur.id_subsector = sub.id_subsector\n' +
        'LEFT JOIN referencia.ref_par_est_institucion pin ON aur.id_institucion = pin.id_institucion\n' +
        'LEFT JOIN referencia.ref_geo_departamento dep ON dep.id_departamento = aur.cod_departamento\n' +
        'LEFT JOIN referencia.ref_geo_area ga ON aur.cod_area = ga.id_area\n' +
        'LEFT JOIN referencia.ref_geo_municipio gm ON aur.cod_municipio = gm.id_municipio\n' +
        'LEFT JOIN referencia.ref_geo_establecimiento ge ON aur.cod_establecimiento = ge.codigo_establecimiento\n' +
        'WHERE au.baja_logica_registro = FALSE ' + filter + ' \n' +
        'AND aur.id_usuario_restriccion IN (  SELECT MAX (u.id_usuario_restriccion) FROM autorizacion.aut_usuario_restriccion u GROUP BY u.usuario)\n' +
        'ORDER BY ap.id_persona DESC;';
        //console.log(sql);
        var data = await this._client.query(sql, values);
      if (data.rows.length > 0) {
        // const resultado = [];
        // for (let i = 0; i < data.rows.length; i++) {
        //   resultado.push(
        //     data.rows[i].data
        //   )
        // }
        return data.rows;
      } else {
        return null;
      }
    } catch (e) {
      return e;
    }
  }
}
