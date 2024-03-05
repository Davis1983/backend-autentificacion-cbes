import { Client } from 'pg';

export class AutUsuarioRepository {
  constructor(private _client: Client) {}
  async listarRestriccionesByUsuarioByIdSistema(
    usuario: string,
    idSistema: number,
  ) {
    try {
      const values = [usuario, idSistema];
      const sql =
        'WITH base AS (\n' +
        '    SELECT * \n' +
        '    FROM autorizacion.aut_usuario_restriccion ur\n' +
        '    WHERE ur.usuario = $1 and ur.id_sistema = $2\n' +
        '),\n' +
        '\n' +
        'super_administrador as (\n' +
        'SELECT\n' +
        '    b.id_usuario_restriccion,\n' +
        "    CONCAT (b.idc_nivel, ' - ', ps.identificador_sistema) AS nombre\n" +
        '  FROM\n' +
        '    base b\n' +
        '  INNER JOIN parametro.par_sistema ps ON b.id_sistema = ps.id_sistema\n' +
        "  WHERE b.idc_nivel = 'SUPERADMINISTRADOR'\n" +
        ' ),\n' +
        '\n' +
        'nivel_nacional AS(\n' +
        'SELECT\n' +
        '    b.id_usuario_restriccion,\n' +
        "    CONCAT (b.idc_nivel, ' - ', ps.nombre_sistema) AS nombre\n" +
        '  FROM\n' +
        '    base b\n' +
        '  INNER JOIN parametro.par_sistema ps ON b.id_sistema = ps.id_sistema\n' +
        "  WHERE b.idc_nivel = 'NACIONAL'\n" +
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
        '  SELECT * FROM super_administrador\n' +
        '  UNION all\n' +
        '  SELECT * FROM nivel_nacional\n' +
        '  UNION ALL\n' +
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
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}
