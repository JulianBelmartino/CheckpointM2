/* 6️⃣ *** COMPONENTE CreateRecital *** 6️⃣

Implementar el componente CreateRecital. Este consistirá en un formulario controlado con estados de React.
📢¡Sigue las instrucciones de los TEST!📢

REQUISITOS
🟢 Aquí tendrás que renderizar una serie de elementos HTML con distintos atibutos e información dentro.
🟢 Debes manejar cada uno de los inputs de tu formulario mediante un estado local llamado "input".
🟢 La información del formulario se debe despachar al estado global cuando se hace un submit.
🟢 Debes manejar los errores que pueden tener los inputs del formulario.

IMPORTANTE
❗Importar las actions como Object Modules, ¡sino los test no funcionarán!
❗Este componente debe ser FUNCIONAL.
❗¡Puedes implementar el manejo de errores como mejor prefieras! Sólo recuerda renderizar el error apropiado en cada caso.
❗NO hacer un destructuring de los hooks de React, debes utilizarlos con la siguiente forma:
      - 'React.useState'
      - 'React.useEffect'
*/

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import * as actions from './../../redux/actions/index';

const CreateRecital = () => {
  const [formData, setFormData] = React.useState({
    nombre: '',
    descripcion: '',
    imagen: '',
    fecha: '',
    lugar: '',
  });

  const [errors, setErrors] = useState({
    nombre: '',
    descripcion: '',
    lugar: '', // Add a placeholder for the "lugar" error
  });

  const dispatch = useDispatch();
  
  const handleInputChange = (e) => {
      const { name, value } = e.target;
      
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    // Update the error for "lugar"
    if (name === 'lugar' && value.length < 10) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        lugar: 'El lugar debe tener al menos 10 caracteres',
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        lugar: '',
      }));
    }
  };
const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(actions.createRecital(formData))
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Nombre: </label>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Descripción: </label>
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Fecha: </label>
        <input
          type="text"
          name="fecha"
          value={formData.fecha}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Imagen: </label>
        <input
          type="text"
          name="imagen"
          value={formData.imagen}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Lugar: </label>
        <input
          type="text"
          name="lugar"
          value={formData.lugar}
          onChange={handleInputChange}
        />
        {errors.lugar && <p>{errors.lugar}</p>} {/* Render the error message */}
      </div>
      <button type="submit">Crear recital</button>
    </form>
  );
};

export default CreateRecital;