import { Client } from 'pg';
import { CreateAutUsuarioRestriccionDto } from '../../core/domains/dtos/aut-usuario-restriccion.dto';

export class AutUsuarioRestriccionRepository {
  constructor(private _client: Client) {}
  async findUsuarioRestriccionByUsuario(usuario: string) {
    try {
      const values = [usuario];
      const sql =
        'SELECT json_build_object(\n' +
        "        'idUsuarioRestriccion',ur.id_usuario_restriccion,\n" +
        "        'usuario',ur.usuario,\n" +
        "        'idSistema',ur.id_sistema,\n" +
        "        'nombreSistema',ps.identificador_sistema,\n" +
        "        'idInstitucion',ur.id_institucion,\n" +
        "        'nombreInstitucion',pi.nombre_institucion,\n" +
        "        'idSubsector',ur.id_subsector,\n" +
        "        'nombreSubsector',pse.nombre_subsector,\n" +
        "        'idcNivel',ur.idc_nivel,\n" +
        "        'idNivel',ur.id_nivel,\n" +
        "        'codDepartamento',ur.cod_departamento,\n" +
        "        'departamento',gd.nombre_departamento,\n" +
        "        'codArea',ur.cod_area,\n" +
        "        'area',ga.nombre_area,\n" +
        "        'codMunicipio',ur.cod_municipio,\n" +
        "        'municipio',gm.nombre_municipio,\n" +
        "        'codEstablecimiento',ur.cod_establecimiento,\n" +
        "        'establecimiento',ge.nombre_establecimiento\n" +
        '        )AS data FROM autorizacion.aut_usuario_restriccion ur\n' +
        '        INNER JOIN parametro.par_sistema ps on ur.id_sistema = ps.id_sistema\n' +
        '            AND ur.usuario = $1 \n' +
        '        LEFT JOIN parametro.par_institucion pi ON ur.id_institucion = pi.id_institucion\n' +
        '        LEFT JOIN referencia.ref_par_est_subsector pse ON ur.id_subsector = pse.id_subsector\n' +
        '        LEFT JOIN referencia.ref_geo_departamento gd ON ur.cod_departamento = gd.id_departamento\n' +
        '        LEFT JOIN referencia.ref_geo_area ga ON ur.cod_area = ga.id_area\n' +
        '        LEFT JOIN referencia.ref_geo_municipio gm ON ur.cod_municipio = gm.id_municipio\n' +
        '        LEFT JOIN referencia.ref_geo_establecimiento ge ON ur.cod_establecimiento = ge.codigo_establecimiento;';
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

  async createUsuarioRestriccion(dto: CreateAutUsuarioRestriccionDto) {
    try {
      const values = [
        dto.usuario,
        dto.idSistema,
        dto.idInstitucion,
        dto.idcSubSector,
        dto.idcNivel,
        dto.idNivel,
        dto.codDepartamento,
        dto.departamento,
        dto.codArea,
        dto.area,
        dto.codMunicipio,
        dto.municipio,
        dto.codEstablecimiento,
        dto.establecimiento,
        dto.usuarioRegistro,
      ];
      const sql =
        'INSERT INTO autorizacion.aut_usuario_restriccion (usuario, id_sistema, id_institucion,\n' +
        '                                                  idc_subsector, idc_nivel, id_nivel, cod_departamento, departamento,\n' +
        '                                                  cod_area, area, cod_municipio, municipio, cod_establecimiento,\n' +
        '                                                  establecimiento, fecha_registro, usuario_registro, ip_registro,\n' +
        '                                                  baja_logica_registro, fecha_modificacion, usuario_modificacion)\n' +
        'VALUES ($1, $2, $3, $4, $5, $6, $7, $8,\n' +
        '        $9, $10, $11, $12, $13, $14,\n' +
        '        current_timestamp, $15, inet_client_addr(), false, null, null) returning id_usuario_restriccion;';
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

  async listarRestriccionesFindUsuario(usuario: string) {
    try {
      const values = [usuario];
      const sql =
        'WITH base AS (\n' +
        '    SELECT * \n' +
        '    FROM autorizacion.aut_usuario_restriccion \n' +
        "    WHERE usuario = $1 \n" +
        '),\n' +
        '\n' +
        'nivel_establecimiento AS (\n' +
        '  SELECT\n' +
        '    b.id_usuario_restriccion,\n' +
        "    CONCAT (b.idc_nivel, ' - ', ge.nombre_establecimiento) AS nombre\n" +
        '  FROM\n' +
        '    base b\n' +
        '  INNER JOIN referencia.ref_geo_establecimiento ge ON b.cod_establecimiento = ge.codigo_establecimiento\n' +
        "  WHERE b.idc_nivel = 'ESTABLECIMIENTO'\n" +
        '),\n' +
        '\n' +
        'nivel_red AS (\n' +
        '  SELECT\n' +
        '    b.id_usuario_restriccion,\n' +
        "    CONCAT (b.idc_nivel, ' - ', ga.nombre_area) AS nombre\n" +
        '  FROM\n' +
        '    base b\n' +
        '  INNER JOIN referencia.ref_geo_area ga ON b.cod_area = ga.id_area\n' +
        "  WHERE b.idc_nivel = 'RED'\n" +
        '),\n' +
        '\n' +
        'nivel_departamento AS (\n' +
        '  SELECT\n' +
        '    b.id_usuario_restriccion,\n' +
        "    CONCAT (b.idc_nivel, ' - ', UPPER (gd.nombre_departamento)) AS nombre\n" +
        '  FROM\n' +
        '    base b\n' +
        '  INNER JOIN referencia.ref_geo_departamento gd ON b.cod_departamento = gd.id_departamento\n' +
        "  WHERE b.idc_nivel = 'DEPARTAMENTO'\n" +
        '),\n' +
        '\n' +
        'nivel_municipio AS (\n' +
        '  SELECT\n' +
        '    b.id_usuario_restriccion,\n' +
        "    CONCAT (b.idc_nivel, ' - ', UPPER (gm.nombre_municipio)) AS nombre\n" +
        '  FROM\n' +
        '    base b\n' +
        '  INNER JOIN referencia.ref_geo_municipio gm ON b.cod_municipio = gm.id_municipio\n' +
        "  WHERE b.idc_nivel = 'MUNICIPIO'\n" +
        ')\n' +
        '\n' +
        'SELECT\n' +
        '  id_usuario_restriccion, \n' +
        '  nombre\n' +
        'FROM (\n' +
        '  SELECT * FROM nivel_establecimiento\n' +
        '  UNION ALL\n' +
        '  SELECT * FROM nivel_red\n' +
        '  UNION ALL\n' +
        '  SELECT * FROM nivel_departamento\n' +
        '  UNION ALL\n' +
        '  SELECT * FROM nivel_municipio\n' +
        ') AS unioned_queries;';
      const data = await this._client.query(sql, values);
      if (data.rows.length > 0) {
        return data.rows;
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
