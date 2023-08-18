/* 4️⃣ ***REDUCER*** 4️⃣ */
/* Importa las action-types aquí. */
import { GET_ALL_RECITALES,GET_RECITAL_DETAIL,DELETE_RECITAL,CREATE_RECITAL } from "../actions";

const initialState = {
  recitales: [],
  recitalDetail: {},
};


/*
En este ejercicio tendrás que crear los casos de un reducer para gestionar la información de tu estado global.

📢¡Sigue las instrucciones de los TEST!📢

REQUISITOS
🟢 Crea un caso default, que devuelva el estado global sin cambios.
🟢 Crea un caso en el que, dentro del estado "recitales", se guarden todos los recitales.
🟢 Crea un caso en el que, dentro del estado "recitalDetail", se guarde el detalle de un recital.
🟢 Crea un caso en el que, dentro del estado "recitales", se agregue un nuevo recital.
    [PISTA]: puedes utilizar el spread operator.
🟢 Crea un caso en el que, dentro del estado "recitales", se elimine aquel recital cuyo ID es igual al recibido.
*/


const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    default:
      return {...state}

  case GET_ALL_RECITALES:
        return {...state,
            recitales: action.payload} 

  case GET_RECITAL_DETAIL:
      return {...state,
        recitalDetail: action.payload}  
   
   case CREATE_RECITAL:
      return {...state,
          recitales: [...state.recitales, action.payload]}
  
      case DELETE_RECITAL:
        return {...state,
                recitales: state.recitales.filter(char => char.id !== action.payload)
                }
}

  }


export default rootReducer;

