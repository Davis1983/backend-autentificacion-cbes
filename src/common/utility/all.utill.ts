import * as moment from 'moment';
import { camelCase } from 'lodash';
const formatoFecha = (fecha: Date) => {
  return moment(fecha).format('DD/MM/YYYY');
};

const formatoFechaSegip = (fecha: Date) => {
  return moment(fecha).format('DD/MM/YYYY');
};
const generaNombreUsuario = (
  nombre: string,
  apellido: string,
  intento: number,
) => {
  const userNamePrefix =
    nombre.substring(0, intento).toLowerCase() + apellido.toLowerCase();
  const usuario = userNamePrefix.replace(/\s+/g, '');
  return usuario;
};

/**
 *Objeto con array para convertir a dto
 * @param respuesta
 */
const transformaCamelCaseArrayObjeto = (respuesta) =>
  respuesta.map((item: any) => {
    const transformedItem = {};
    for (const key in item) {
      if (Object.prototype.hasOwnProperty.call(item, key)) {
        const value = item[key];
        if (Array.isArray(value)) {
          // Si el valor es un array, aplicar la transformación de camelCase a cada objeto dentro del array
          transformedItem[camelCase(key)] = value.map((nestedItem: any) => {
            const transformedNestedItem = {};
            for (const nestedKey in nestedItem) {
              if (Object.prototype.hasOwnProperty.call(nestedItem, nestedKey)) {
                transformedNestedItem[camelCase(nestedKey)] =
                  nestedItem[nestedKey];
              }
            }
            return transformedNestedItem;
          });
        } else {
          // Si el valor no es un array, aplicar la transformación de camelCase normalmente
          transformedItem[camelCase(key)] = value;
        }
      }
    }
    return transformedItem;
  });

export {
  formatoFecha,
  formatoFechaSegip,
  generaNombreUsuario,
  transformaCamelCaseArrayObjeto,
};
