import { Client } from 'pg';

export class RefEstructuraEstablecimientoRepository {
  constructor(private _client: Client) {}

  async findAllDepartamentos() {
    try {
      const sql =
        'select distinct ree.cod_departamento, ree.departamento from referencia.ref_estructura_establecimiento ree order by ree.cod_departamento asc;';
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

  async findAllRedByCodigoDepartamento(codDepartamento: number, idInstitucion: number, idSubsector: number) {
    var values = null;
    let campos = '';
    var filter = '';
    var contValues = 0;
    try {
      if (codDepartamento > 0) {
        contValues = contValues + 1;
        campos = campos + codDepartamento + ',';
        filter = filter + ' AND d.id_departamento = $' + contValues;
      }
      if (idInstitucion > 0) {
        contValues = contValues + 1;
        campos = campos + idInstitucion + ',';
        filter = filter + ' AND e.id_institucion = $' + contValues;
      }
      if (idSubsector > 0) {
        contValues = contValues + 1;
        campos = campos + idSubsector + ',';
        filter = filter + ' AND sb.id_subsector = $' + contValues;
      }
      
      campos = campos.substring(0, campos.length - 1);
      let arrDepto = campos.split(',');
      if (contValues == 1) {
        values = [parseInt(arrDepto[0], 10)];
      }
      if (contValues == 2) {
        values = [parseInt(arrDepto[0], 10), parseInt(arrDepto[1], 10)];
      }
      if (contValues == 3) {
        values = [parseInt(arrDepto[0], 10), parseInt(arrDepto[1], 10), parseInt(arrDepto[2], 10)];
      }
      const sql =
          'SELECT ga.id_area AS cod_area, ga.nombre_area AS red\n' +
          'FROM referencia.ref_geo_establecimiento e\n' +
          'INNER JOIN referencia.ref_geo_area ga ON e.id_area = ga.id_area\n' +
          'INNER JOIN referencia.ref_geo_departamento d ON ga.id_departamento = d.id_departamento\n' +
          'LEFT JOIN referencia.ref_par_est_institucion  i ON e.id_institucion = i.id_institucion\n' +
					'LEFT JOIN referencia.ref_par_est_subsector sb ON i.id_subsector = sb.id_subsector\n' +
          'WHERE 1 = 1 ' + filter + '\n' +
          'GROUP BY ga.id_area, ga.nombre_area\n' +
          'ORDER BY ga.nombre_area;';
      const data = await this._client.query(sql,values);
      /*const sql =
        'select distinct ree.cod_area, ree.red from referencia.ref_estructura_establecimiento ree where ree.cod_departamento = $1';
      const data = await this._client.query(sql,values);*/
      if (data.rows.length > 0) {
        return data.rows;
      } else {
        return null;
      }
    } catch (e) {
      return null;
    }
  }

  async findAllMunicipoByCodDeparamentoByCodArea(codDepartamento: number, codArea:number) {
    try {
      const values = [codDepartamento,codArea];
      const sql =
          'select distinct ree.cod_municipio, ree.municipio from referencia.ref_estructura_establecimiento ree\n' +
          'where ree.cod_departamento = $1 and ree.cod_area = $2;';
      const data = await this._client.query(sql,values);
      if (data.rows.length > 0) {
        return data.rows;
      } else {
        return null;
      }
    } catch (e) {
      return null;
    }
  }

  async findAllMunicipoByCodDeparamento(codDepartamento: number, idInstitucion: number, idSubsector: number) {
    var values = null;
    let campos = '';
    var filter = '';
    var contValues = 0;
    try {
      if (codDepartamento > 0) {
        contValues = contValues + 1;
        campos = campos + codDepartamento + ',';
        filter = filter + ' AND d.id_departamento = $' + contValues;
      }
      if (idInstitucion > 0) {
        contValues = contValues + 1;
        campos = campos + idInstitucion + ',';
        filter = filter + ' AND e.id_institucion = $' + contValues;
      }
      if (idSubsector > 0) {
        contValues = contValues + 1;
        campos = campos + idSubsector + ',';
        filter = filter + ' AND sb.id_subsector = $' + contValues;
      }
      
      campos = campos.substring(0, campos.length - 1);
      let arrDepto = campos.split(',');
      if (contValues == 1) {
        values = [parseInt(arrDepto[0], 10)];
      }
      if (contValues == 2) {
        values = [parseInt(arrDepto[0], 10), parseInt(arrDepto[1], 10)];
      }
      if (contValues == 3) {
        values = [parseInt(arrDepto[0], 10), parseInt(arrDepto[1], 10), parseInt(arrDepto[2], 10)];
      }
      const sql =
          'SELECT m.id_municipio AS cod_municipio, m.nombre_municipio AS municipio\n' +
          'FROM referencia.ref_geo_establecimiento e\n' +
          'INNER JOIN referencia.ref_geo_municipio m ON e.id_municipio = m.id_municipio\n' +
          'INNER JOIN referencia.ref_geo_provincia p ON m.id_provincia = p.id_provincia\n' +
          'INNER JOIN referencia.ref_geo_departamento d ON p.id_departamento = d.id_departamento\n' +
          'LEFT JOIN referencia.ref_par_est_institucion  i ON e.id_institucion = i.id_institucion\n' +
					'LEFT JOIN referencia.ref_par_est_subsector sb ON i.id_subsector = sb.id_subsector\n' +
          'WHERE 1 = 1 ' + filter + '\n' +
          'GROUP BY m.id_municipio, m.nombre_municipio\n' +
          'ORDER BY m.nombre_municipio;';
      const data = await this._client.query(sql,values);
      if (data.rows.length > 0) {
        return data.rows;
      } else {
        return null;
      }
    } catch (e) {
      return null;
    }
  }

  async findAllRedByMunicipio(codMunicipio: number) {
    try {
      const values = [codMunicipio];
      const sql =
        'SELECT distinct ree.cod_area, ree.red FROM referencia.ref_estructura_establecimiento ree WHERE ree.cod_municipio = $1';
      const data = await this._client.query(sql,values);
      if (data.rows.length > 0) {
        return data.rows;
      } else {
        return null;
      }
    } catch (e) {
      return null;
    }
  }

  async findAllEstablecimientoByCodDeparamentoByCodAreaByCodeMunicipio(
    idSubsector: number,
    idInstitucion: number,
    codDepartamento: number,
    codArea:number,
    codMunicipio:number) {
      var values = null;
      let campos = '';
      var filter = '';
      var contValues = 0;
      try {
        if (idSubsector > 0) {
          contValues = contValues + 1;
          campos = campos + idSubsector + ',';
          filter = filter + ' AND sb.id_subsector = $' + contValues;
        }
        if (idInstitucion > 0) {
          contValues = contValues + 1;
          campos = campos + idInstitucion + ',';
          filter = filter + ' AND e.id_institucion = $' + contValues;
        }
        if (codDepartamento > 0) {
          contValues = contValues + 1;
          campos = campos + codDepartamento + ',';
          filter = filter + ' AND d.id_departamento = $' + contValues;
        }
      if (codArea > 0) {
        contValues = contValues + 1;
        campos = campos + codArea + ',';
        filter = filter + ' AND ga.id_area = $' + contValues;
      }
      if (codMunicipio > 0) {
        contValues = contValues + 1;
        campos = campos + codMunicipio + ',';
        filter = filter + ' AND m.id_municipio = $' + contValues;
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
        values = [parseInt(arr[0], 10), parseInt(arr[1], 10), parseInt(arr[2], 10)];
      }
      if (contValues == 4) {
        values = [parseInt(arr[0], 10), parseInt(arr[1], 10), parseInt(arr[2], 10), parseInt(arr[3], 10)];
      }
      if (contValues == 5) {
        values = [parseInt(arr[0], 10), parseInt(arr[1], 10), parseInt(arr[2], 10), parseInt(arr[3], 10), parseInt(arr[4], 10)];
      }
      const sql =
          'SELECT e.codigo_establecimiento AS cod_establecimiento, e.nombre_establecimiento AS establecimiento\n' +
          'FROM referencia.ref_geo_establecimiento e\n' +
          'INNER JOIN referencia.ref_geo_municipio m ON e.id_municipio = m.id_municipio\n' +
          'INNER JOIN referencia.ref_geo_area ga ON e.id_area = ga.id_area\n' +
          'INNER JOIN referencia.ref_geo_departamento d ON ga.id_departamento = d.id_departamento\n' +
          'LEFT JOIN referencia.ref_par_est_institucion  i ON e.id_institucion = i.id_institucion\n' +
					'LEFT JOIN referencia.ref_par_est_subsector sb ON i.id_subsector = sb.id_subsector\n' +
          'WHERE 1 = 1 ' + filter + '\n' +
          'GROUP BY e.codigo_establecimiento, e.nombre_establecimiento\n' +
          'ORDER BY e.nombre_establecimiento ASC;';
      console.log(sql, values);
      var data = await this._client.query(sql,values);
      if (data.rows.length > 0) {
        return data.rows;
      } else {
        return null;
      }
    } catch (e) {
      return null;
    }
  }
}
