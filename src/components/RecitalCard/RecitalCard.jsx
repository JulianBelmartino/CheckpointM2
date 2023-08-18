/* 7️⃣ *** COMPONENTE RecitalCard *** 7️⃣

Implementar el componente RecitalCard.
📢¡Sigue las instrucciones de los tests!📢

REQUISITOS
🟢 Tendrás que renderizar una serie de etiquetas HTML que incluyan texto y propiedades.
🟢 Tendrás que despachar una action para eliminar un recital específico.

IMPORTANTE
❗Este componente debe ser FUNCIONAL.
❗Importar las actions como Object Modules, ¡sino los test no funcionarán!
*/
import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import * as actions from '../../redux/actions/index';

const RecitalCard = (props) => {

   const dispatch = useDispatch();

   const handleDelete = ( id ) => {
      dispatch( actions.deleteRecital( id ) )
   }

   return (
      <div className='card'>
         <button onClick={ () => handleDelete( props.id ) }>x</button>
         <Link to={`/recitales/${props.id}`}>
            <h3>{ props.nombre }</h3>
         </Link>
         <img src={ props.imagen } alt={ props.nombre }/>
         <p>Fecha: { props.fecha }</p>
     </div>
   );
};

export default RecitalCard;
