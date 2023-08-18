/* 1️⃣ ***COMPONENTE APP*** 1️⃣
Implementar el componente App. En este ejercicio tendrás que crear diferentes RUTAS para otros componentes. 
¡Ten en cuenta los nombres y las especificaciones de cada uno!

REQUISITOS
🟢 El componente Nav debe renderizarse en todas las rutas.
🟢 El componente Home debe renderizarse en la ruta "/".
🟢 El componente RecitalDetail debe renderizarse en la ruta "/recitales/:id".
🟢 El componente CreateRecital debe renderizarse en la ruta "/recitales/create".
*/

import React from "react";
import {Routes, Route, useLocation} from 'react-router-dom';
import Nav from './components/Nav/Nav.jsx'
import RecitalCard from './components/RecitalCard/RecitalCard.jsx'
import RecitalDetail from './components/RecitalDetail/RecitalDetail.jsx'
import CreateRecital from './components/CreateRecital/CreateRecital.jsx'
import Home from './components/Home/Home.jsx'


const App = () => {
  return (
      <div>
        <Nav/>
         <Routes>
            <Route path='/' element={ <Home/> } />
            <Route path='/recitales/:id' element={<RecitalDetail />} />
            <Route path='/recitales/create' element={<CreateRecital />} />
          </Routes>
      </div>
  );
};

export default App;
