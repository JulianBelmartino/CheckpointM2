/* 8️⃣ ***COMPONENTE RecitalDetail*** 8️⃣

Implementar el componente RecitalDetail. En este ejercicio tendrás que renderizar las diferentes propiedades del recital.
📢¡Sigue las instrucciones de los tests!📢

REQUISITOS
🟢 Tendrás que despachar una action con el "id" del recital cuando se monta el componente. Luego, traer esa 
información de tu estado global.
🟢 Tendrás que renderizar algunos datos del recital correspondiente.

IMPORTANTE
❗Importar las actions como Object Modules, ¡sino los test no funcionarán!
❗Este componente debe ser FUNCIONAL.
❗Para obtener el "id" puedes utilizar useParams.
❗NO hacer un destructuring de los hooks de React, debes utilizarlos con la siguiente forma:
      - 'React.useState' 
      - 'React.useEffect'
*/

import './recitalDetail.css';
import React from 'react';
import * as action from '../../redux/actions/index';

const RecitalDetail = (props) => {
   return <div className='detail'>
      <h1>Recital {props.recital.id}</h1>
      <div className='detail-content'>
         <div className='detail-content-title'>
            <h2>Titulo: {props.recital.title}</h2>
         </div>
         <div className='detail-content-description'>
            <p>Descripción: {props.recital.description}</p>
         </div>
      </div>
   </div>;
};

export default RecitalDetail;

