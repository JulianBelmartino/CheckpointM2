/* 3️⃣ ***ACTIONS*** 3️⃣ */

// 📢 Puedes utilizar axios si lo deseas, solo debes importarlo 📢
// 📢 Recuerda RETORNAR las peticiones que hagan tus action-creators 📢
// Ej: return fetch(...) o return axios(...)


// 🟢 getAllRecitales:
// Esta función debe realizar una petición al Back-End. Luego despachar una action con la data recibida.
// End-Point: 'http://localhost:3001/recitales'.

export const GET_ALL_RECITALES= 'GET_ALL_RECITALES'
export const getAllRecitales = () => {
  return async (dispatch) => {
    const response= await fetch('http://localhost:3001/recitales');
  const data = await response.json()
  dispatch({
    type: 'GET_ALL_RECITALES',
    payload: data,
  })
  }
};

// 🟢 getRecitalDetail:
// Esta función debe hacer una petición al Back-End. Ten en cuenta que tiene que recibir la variable "id" por
// parámetro. Luego despachar una action con la data recibida.
// End-Point: 'http://localhost:3001/recitales/:id'.
export const GET_RECITAL_DETAIL = 'GET_RECITAL_DETAIL';
export const getRecitalDetail = (id) => {
  return async (dispatch) => {
    try {
      const response = await fetch(`http://localhost:3001/recitales/${id}`)
      const data = await response.json();

      dispatch({
        type: GET_RECITAL_DETAIL,
        payload: data,
      });
    } catch (error) {
      console.error(error);
    }
  };
};

// 🟢 createRecital:
// Esta función debe recibir una variable "recital" por parámetro.
// Luego retornar una action que, en su propiedad payload:
//    - haga un spread operator de la variable recital, para copiar todo su contenido.
//    - tenga una nueva propiedad "id" igual a la variable de abajo, pero con un incremento +1.
// Descomenta esta variable cuando la necesites.
 let id = 1;
export const CREATE_RECITAL= 'CREATE_RECITAL'
export const createRecital = (recital) => {
  return {type:CREATE_RECITAL,payload:{...recital,id: id++}};
};

// 🟢 deleteRecital:
// Esta función debe retornar una action. En su propiedad "payload" guardarás el ID recibido por parámetro.
export const DELETE_RECITAL= 'DELETE_RECITAL'
export const deleteRecital = (id) => {
  return {type:DELETE_RECITAL,payload: id};
};
