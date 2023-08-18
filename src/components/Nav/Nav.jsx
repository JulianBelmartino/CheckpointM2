/* 2️⃣ ***COMPONENTE NAV*** 2️⃣
Implementar el componente Nav. En este ejercicio tendrás que asociar dos etiquetas <Link to='' /> a 
distintos elementos.

REQUISITOS
🟢 El primer <Link> debe dirigir a "/" con el texto "Home".
🟢 El segundo <Link> debe dirigir a "/recitales/create" con el texto "Create Deporte".

IMPORTANTE
❗Este componente debe ser FUNCIONAL.
❗Asegurate de colocar bien la palabra 'recital' o 'recitales' en los casos requeridos.
*/

import './nav.css';
import React from 'react';
import { Link } from 'react-router-dom';

const Nav = () => {
  return (
    <div className='nav'>
      <Link to='/'><p>Home</p></Link>
      <Link to='/recitales/create'><p>Create Recital</p></Link>
    </div>
  );
};

export default Nav;

