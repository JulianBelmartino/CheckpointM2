import React from 'react';
import { Link } from 'react-router-dom';
import { configure, shallow } from 'enzyme';
import Nav from '../src/components/Nav/Nav';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';


configure({ adapter: new Adapter() });

describe('<Nav />', () => {
   let nav;
   beforeEach(() => {
      nav = shallow(<Nav />);
   });

   it('Debe haber dos etiquetas <Link>. Uno que dirija a la ruta "/" y otro a la ruta "/recitales/create"', () => {
      // Puedes importar el componente <Link> de react-router-dom.
      expect(nav.find(Link).length).toBeGreaterThanOrEqual(2);
      expect(nav.find(Link).find({ to: '/' }).length).toBe(1);
      expect(nav.find(Link).find({ to: '/recitales/create' }).length).toBe(1);
   });

   it('Debe haber una etiqueta <Link> con el texto "Home" que dirija a la ruta "/"', () => {
      expect(nav.find(Link).find({ to: '/' }).text()).toBe('Home');
   });

   it('Debe haber una etiqueta <Link> con el texto "Create Recital" que dirija a la ruta "/recitales/create"', () => {
      expect(nav.find(Link).find({ to: '/recitales/create' }).text()).toBe(
         'Create Recital'
      );
   });
});
