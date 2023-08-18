/*5️⃣ *COMPONENTE Home** 5️⃣

Implementar el componente Home. Este deberá renderizar todos los Recitales (Cards) que contengan la 
información consumida directamente del estado global de Redux. 
📢¡Sigue las instrucciones de los tests!📢

REQUISITOS
🟢 Tendrás que conectar el componente con el estado global de Redux mediante dos funciones: mapStateToProps y 
mapDispatchToProps.
🟢 Tendrás que renderizar una serie de etiquetas HTML con información dentro.
🟢 Tendrás que mapear tu estado global para luego renderizar su información utilizando el componente <recitalCard />.

IMPORTANTE
❗Este componente debe ser de CLASE.
❗Importar las actions como Object Modules, ¡sino los test no funcionarán!
 [Ej]: import * as actions from "./../../redux/actions/index";

*/

import './home.css';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from './../../redux/actions/index';
import RecitalCard from "../RecitalCard/RecitalCard.jsx"
import image from '../.././imgcp2/recitales.jpg'

export class Home extends Component {
   constructor(props) {
      super(props)
   }
   componentDidMount() {
      this.props.getAllRecitales();
   }
   render() {
      return <div className='home'>
         <h1>Recitales</h1>
         <img src={image} alt="recital-logo" />
         <h3>Recitales:</h3>
         <h4>Checkpoint M2</h4>
         {
            this.props.recitales?.map((recital) => {
               return (
                  <RecitalCard key={recital.id} id={recital.id} nombre={recital.nombre} imagen={recital.imagen} fecha={recital.fecha}  />
               )
            })
         }
      </div>;
   }
}
export const mapStateToProps = (state) => {
   return {
      recitales: state.recitales
   }
};
export const mapDispatchToProps = (dispatch) => {
   return {
      getAllRecitales: () => dispatch(actions.getAllRecitales() ),
   }
};
export default connect(mapStateToProps, mapDispatchToProps)(Home);
