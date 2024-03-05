import { Client } from 'pg';
import { formatoFechaSegip } from 'src/common/utility/all.utill';

export class AutUsuarioPerfilRespository {
  constructor(private _client: Client) {}

  async listaUsuarioPerfil(idSistema: number, usuario: string) {
    try {
      const values = [idSistema, usuario];
      const sql =
        " SELECT\n" +
        "   ap.id_perfil,\n" +
        "   ap.id_sistema,\n" +
        "   ap.nombre_perfil,\n" +
        "   ap.descripcion_perfil,\n" +
        "   (CASE WHEN ( SELECT COUNT(*) FROM autorizacion.aut_usuario_restriccion au INNER JOIN autorizacion.aut_usuario_restriccion_perfil aur ON au.id_usuario_restriccion = aur.id_usuario_restriccion WHERE aur.id_perfil = ap.id_perfil AND au.usuario = $2) > 0 THEN true ELSE false END) AS perfil_asignado\n" +
        " FROM\n" +
        " autorizacion.aut_perfil ap\n" +
        " WHERE ap.id_sistema = $1\n"+
        " ORDER BY ap.id_perfil;";
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

  async listaUsuarioPerfilByIdUsuarioRestriccion(idSistema: number, idUsuarioRestriccion: number) {
    try {
      const values = [idSistema, idUsuarioRestriccion];
      const sql =
          " SELECT\n" +
          "   ap.id_perfil,\n" +
          "   ap.id_sistema,\n" +
          "   ap.nombre_perfil,\n" +
          "   ap.descripcion_perfil,\n" +
          "   (CASE WHEN ( SELECT COUNT(*) FROM autorizacion.aut_usuario_restriccion au INNER JOIN autorizacion.aut_usuario_restriccion_perfil aur ON au.id_usuario_restriccion = aur.id_usuario_restriccion WHERE aur.id_perfil = ap.id_perfil AND au.id_usuario_restriccion = $2) > 0 THEN true ELSE false END) AS perfil_asignado\n" +
          " FROM\n" +
          " autorizacion.aut_perfil ap\n" +
          " WHERE ap.id_sistema = $1\n"+
          " ORDER BY ap.id_perfil;";
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

  async listaUsuarioPerfilAsignado(usuario: string) {
    try {
      const values = [usuario];
      const sql =
        " SELECT\n" +
        "   au.id_usuario_restriccion,\n" +
        "   au.usuario,\n" +
        "   rp.id_perfil,\n" +
        "   apr.id_recurso AS id_recurso_superior\n" +
        " FROM\n" +
        " autorizacion.aut_usuario_restriccion au\n" +
        " INNER JOIN autorizacion.aut_usuario_restriccion_perfil rp ON au.id_usuario_restriccion = rp.id_usuario_restriccion\n" +
        " INNER JOIN autorizacion.aut_perfil_recurso apr ON rp.id_perfil = apr.id_perfil\n" +
        " INNER JOIN autorizacion.aut_recurso ar ON apr.id_recurso = ar.id_recurso\n" +
        " WHERE au.usuario = $1\n" +
        " AND ar.id_recurso_superior IS NULL\n" +
        " AND ar.baja_logica_registro = FALSE\n" +
        " ORDER BY rp.id_perfil, apr.id_recurso;";
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
}
