import { Client } from 'pg';

export class AutRecursoRepository {
  constructor(private _client: Client) {}

  async listarHijosAutRecursoByIdPadre(idRecurso: number) {
    try {
      const values = [idRecurso];
      const sql =
        'WITH RECURSIVE recurso AS (\n' +
        '    SELECT\n' +
        '        id_recurso,\n' +
        '        id_sistema,\n' +
        '        id_recurso_superior,\n' +
        '        id_tipo_recurso,\n' +
        '        uri,\n' +
        '        nombre_recurso,\n' +
        '        descripcion_recurso,\n' +
        '        es_visible,\n' +
        '        orden\n' +
        '    FROM\n' +
        '        autorizacion.aut_recurso\n' +
        '    WHERE\n' +
        '        id_recurso = $1\n' +
        '    UNION\n' +
        '        SELECT\n' +
        '        e.id_recurso,\n' +
        '        e.id_sistema,\n' +
        '        e.id_recurso_superior,\n' +
        '        e.id_tipo_recurso,\n' +
        '        e.uri,\n' +
        '        e.nombre_recurso,\n' +
        '        e.descripcion_recurso,\n' +
        '        e.es_visible,\n' +
        '        e.orden \n' +
        '        FROM\n' +
        '            autorizacion.aut_recurso e\n' +
        '        INNER JOIN recurso s ON s.id_recurso = e.id_recurso_superior\n' +
        ') SELECT\n' +
        '    *\n' +
        'FROM\n' +
        '    recurso where id_recurso_superior notnull;';
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

  async obtenerNombreDelPadre(idRecursoSuperior) {
    try {
      const values = [idRecursoSuperior];
      const sql =
        'select ar.nombre_recurso  from autorizacion.aut_recurso ar where ar.id_recurso = $1';
      const data = await this._client.query(sql, values);
      return data.rows[0];
    } catch (e) {
      return null;
    }
  }

  async listarHijosAutRecursoByIdPadreIncluidoPadre(idRecurso: number) {
    try {
      const values = [idRecurso];
      const sql =
        'WITH RECURSIVE recurso AS (\n' +
        '            SELECT\n' +
        '                id_recurso,\n' +
        '                id_sistema,\n' +
        '                id_recurso_superior,\n' +
        '                id_tipo_recurso,\n' +
        '                uri,\n' +
        '                nombre_recurso,\n' +
        '                descripcion_recurso,\n' +
        '                es_visible,\n' +
        '                icono,\n' +
        '                orden\n' +
        '            FROM\n' +
        '                autorizacion.aut_recurso\n' +
        '            WHERE\n' +
        '                id_recurso = $1\n' +
        '            UNION\n' +
        '                SELECT\n' +
        '                e.id_recurso,\n' +
        '                e.id_sistema,\n' +
        '                e.id_recurso_superior,\n' +
        '                e.id_tipo_recurso,\n' +
        '                e.uri,\n' +
        '                e.nombre_recurso,\n' +
        '                e.descripcion_recurso,\n' +
        '                e.es_visible,\n' +
        '                e.icono,\n' +
        '                e.orden \n' +
        '                FROM\n' +
        '                    autorizacion.aut_recurso e\n' +
        '                INNER JOIN recurso s ON s.id_recurso = e.id_recurso_superior\n' +
        '        ) SELECT\n' +
        //'            ar.id_recurso, ar.nombre_recurso, ar.descripcion_recurso, ptr.nombre_tipo_recurso,ar.id_recurso_superior\n' +
        '            ar.*,\n' +
        '            ps.identificador_sistema\n' +
        '        FROM\n' +
        '            recurso ar \n' +
        '            INNER JOIN parametro.par_sistema ps ON ar.id_sistema = ps.id_sistema \n' +
        '            INNER JOIN parametro.par_tipo_recurso ptr ON ar.id_tipo_recurso = ptr.id_tipo_recurso ';

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
  async obtenerPadresSuperioresAutRecurso(idsistema: number) {
    try {
      const values = [idsistema];
      const sql =
        'SELECT ar.id_recurso FROM autorizacion.aut_recurso ar WHERE ar.id_sistema = $1 AND ar.id_recurso_superior isnull ORDER BY ar.id_recurso asc;';
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

  async obtenerTodosPadresSuperioresAutRecurso() {
    try {
      const sql =
        'select ar.id_recurso from autorizacion.aut_recurso ar where ar.id_recurso_superior isnull order by ar.id_recurso asc;';
      const data = await this._client.query(sql);
      if (data.rows.length > 0) {
        return data.rows;
      } else {
        return null;
      }
    } catch (e) {
      return null;
    }
  }
  async obtenerNombreTipoRecurso(idTipoRecurso: number) {
    try {
      const values = [idTipoRecurso];
      const sql =
        'select ptr.nombre_tipo_recurso from parametro.par_tipo_recurso ptr where ptr.id_tipo_recurso = $1;';
      const data = await this._client.query(sql, values);
      return data.rows[0];
    } catch (e) {
      return null;
    }
  }
}
