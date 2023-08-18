import React from 'react';
import isReact from 'is-react';
import thunk from 'redux-thunk';
import * as data from '../db.json';
import { Provider } from 'react-redux';
import { configure, mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import * as actions from '../src/redux/actions';
import { MemoryRouter } from 'react-router-dom';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import CreateRecital from '../src/components/CreateRecital/CreateRecital';

configure({ adapter: new Adapter() });

jest.mock('../src/redux/actions/index', () => ({
   CREATE_RECITAL: 'CREATE_RECITAL',
   createRecital: (payload) => ({
      type: 'CREATE_RECITAL',
      payload: {
         ...payload,
         id: 6,
      },
   }),
}));

describe('<CreateRecital/>', () => {
   const state = { recitales: data.recitales };
   const mockStore = configureStore([thunk]);
   const { CREATE_RECITAL } = actions;

   beforeAll(() => expect(isReact.classComponent(CreateRecital)).toBeFalsy());

   // RECUERDEN USAR FUNCTIONAL COMPONENT EN LUGAR DE CLASS COMPONENT
   describe('Formulario de Creación de recitales', () => {
      let createRecital;
      let store = mockStore(state);
      beforeEach(() => {
         createRecital = mount(
            <Provider store={store}>
               <MemoryRouter initialEntries={['/recitales/create']}>
                  <CreateRecital />
               </MemoryRouter>
            </Provider>
         );
      });

      it('Debe renderizar un formulario', () =>
         expect(createRecital.find('form').length).toBe(1));

      it('Debe renderizar un label con el texto "Nombre: "', () => {
         expect(createRecital.find('label').at(0).text()).toEqual('Nombre: ');
      });

      it('Debe renderizar un input de tipo text con el atributo "name" igual a "nombre"', () => {
         expect(createRecital.find('input[name="nombre"]').length).toBe(1);
      });

      it('Debe renderizar un label con el texto "Descripción: "', () => {
         expect(createRecital.find('label').at(1).text()).toBe('Descripción: ');
      });

      it('Debe renderizar un input de tipo textarea con el atributo "name" igual a "descripcion"', () => {
         expect(createRecital.find('textarea[name="descripcion"]').length).toBe(
            1
         );
      });

      it('Debe renderizar un label con el texto "Fecha: "', () => {
         expect(createRecital.find('label').at(2).text()).toBe('Fecha: ');
      });

      it('Debe renderizar un input de tipo text con el atributo "name" igual a "fecha"', () => {
         expect(createRecital.find('input[name="fecha"]').length).toBe(1);
      });

      it('Debe renderizar un label con el texto "Imagen: "', () => {
         expect(createRecital.find('label').at(3).text()).toBe('Imagen: ');
      });
      it('Debe renderizar un input de tipo text con el atributo name igual a "imagen"', () => {
         expect(createRecital.find('input[name="imagen"]').length).toBe(1);
      });

      it('Debe renderizar un label con el texto "Lugar: "', () => {
         expect(createRecital.find('label').at(4).text()).toBe(
            'Lugar: '
         );
      });

      it('Debe renderizar un input de tipo text con el atributo "name" igual a "equipamiento"', () => {
         expect(createRecital.find('input[name="lugar"]').length).toBe(
            1
         );
      });


      it('Debe renderizar un button de tipo submit con el texto "Crear recital"', () => {
         expect(createRecital.find('button[type="submit"]').length).toBe(1);
         expect(createRecital.find('button[type="submit"]').text()).toBe(
            'Crear recital'
         );
      });
   });

   describe('Manejo de estados locales', () => {
      let useState, useStateSpy, createRecital;
      let store = mockStore(state);
      beforeEach(() => {
         useState = jest.fn();
         useStateSpy = jest.spyOn(React, 'useState');
         useStateSpy.mockImplementation((initialState) => [
            initialState,
            useState,
         ]);

         createRecital = mount(
            <MemoryRouter>
               <Provider store={store}>
                  <CreateRecital />
               </Provider>
            </MemoryRouter>
         );
      });

      it('Debe inicializar el estado local con las propiedades: "nombre", "descripcion", "imagen", "fecha", "lugar"', () => {
         expect(useStateSpy).toHaveBeenCalledWith({
            nombre: "",
            descripcion: "",
            imagen: "",
            fecha: "",
            lugar: "",
         });
      });

      describe('Debe reconocer cuando hay un cambio de valor en los distintos inputs', () => {
         it('input "nombre"', () => {
            createRecital.find('input[name="nombre"]').simulate('change', {
               target: { name: 'nombre', value: 'Metallica' },
            });

            expect(useState).toHaveBeenCalledWith({
               nombre: 'Metallica',
               descripcion: "",
               imagen: "",
               fecha: "",
               lugar: "",
            });

            createRecital.find('input[name="nombre"]').simulate('change', {
               target: { name: 'nombre', value: 'Aerosmith' },
            });

            expect(useState).toHaveBeenCalledWith({
               nombre: 'Aerosmith',
               descripcion: "",
               imagen: "",
               fecha: "",
               lugar: "",
            });
         });

         it('input "descripcion"', () => {
            createRecital
               .find('textarea[name="descripcion"]')
               .simulate('change', {
                  target: {
                     name: 'descripcion',
                     value: 'Deep Purple, una de las bandas pioneras del Hard Rock, se presentará en el Madison Square Garden con su potente sonido y actuación en vivo.',
                  },
               });

            expect(useState).toHaveBeenCalledWith({
               nombre: '',
               descripcion:
                  "Deep Purple, una de las bandas pioneras del Hard Rock, se presentará en el Madison Square Garden con su potente sonido y actuación en vivo.",
               imagen: '',
               fecha: "",
               lugar: "",
            });
         });

         it('input "fecha"', () => {
            createRecital
               .find('input[name="fecha"]')
               .simulate('change', {
                  target: {
                     name: 'fecha',
                     value: '2023-09-25',
                  },
               });

            expect(useState).toHaveBeenCalledWith({
               nombre: '',
               descripcion: '',
               imagen: '',
               fecha: '2023-09-25',
               lugar: "",
            });
         });

         it('input "imagen"', () => {
            createRecital.find('input[name="imagen"]').simulate('change', {
               target: {
                  name: 'imagen',
                  value: 'https://www.example.jpeg',
               },
            });

            expect(useState).toHaveBeenCalledWith({
               nombre: '',
               descripcion: '',
               imagen: 'https://www.example.jpeg',
               fecha: "",
               lugar: "",
            });
         });

         it('input "lugar"', () => {
            createRecital
               .find('input[name="lugar"]')
               .simulate('change', {
                  target: {
                     name: 'lugar',
                     value: 'Estadio Wembley, Londres',
                  },
               });

            expect(useState).toHaveBeenCalledWith({
               nombre: '',
               descripcion: '',
               imagen: '',
               fecha: "",
               lugar: "Estadio Wembley, Londres",
            });
         });


      });
   });

   describe('Dispatch al store', () => {
      // 🚨IMPORTANTE TRABAJAMOS CON LA REFERENCIA DE LAS ACTIONS LA IMPORTACION DE LAS ACTIONS DEBE SER DE LA SIGUIENTE MANERA🚨
      // import * as actions from "./../../redux/actions/index";

      let createRecital, useState, useStateSpy;
      let store = mockStore(state);

      beforeEach(() => {
         useState = jest.fn();
         useStateSpy = jest.spyOn(React, 'useState');
         useStateSpy.mockImplementation((initialState) => [
            initialState,
            useState,
         ]);
         store = mockStore(state, actions.createRecital);
         store.clearActions();
         createRecital = mount(
            <Provider store={store}>
               <MemoryRouter initialEntries={['/recitales/create']}>
                  <CreateRecital />
               </MemoryRouter>
            </Provider>
         );
      });

      afterEach(() => jest.restoreAllMocks());

      it('Debe despachar la action "CreateRecital" con los datos del estado local cuando se haga submit del form.', () => {
         const createRecitalFn = jest.spyOn(actions, 'createRecital');
         createRecital.find('form').simulate('submit');
         expect(store.getActions()).toEqual([
            {
               type: CREATE_RECITAL,
               payload: {
                  id: 6,
                  nombre: "",
                  descripcion: "",
                  imagen: "",
                  fecha: "",
                  lugar: "",
               },
            },
         ]);
         expect(CreateRecital.toString().includes('useDispatch')).toBe(true);
         expect(createRecitalFn).toHaveBeenCalled();
      });

      it('Debe evitar que se refresque la página luego de hacer submit con el uso de "preventDefault"', () => {
         const event = { preventDefault: () => {} };
         jest.spyOn(event, 'preventDefault');
         createRecital.find('form').simulate('submit', event);
         expect(event.preventDefault).toBeCalled();
      });
   });

   //-----------------------------------------------------
   describe('Manejo de errores', () => {
      let createRecital;
      let store = mockStore(state);
      beforeEach(() => {
         createRecital = mount(
            <Provider store={store}>
               <MemoryRouter initialEntries={['/recitales/create']}>
                  <CreateRecital />
               </MemoryRouter>
            </Provider>
         );
      });

      it("Al ingresar un 'nombre' con una longitud mayor a 30 caracteres, debe renderizar un <p> indicando el error", () => {
         // Pueden implementar la lógica de validación de errores de la forma que mejor prefieran!
         // Los test verifican principalmente que muestres lo errores en la interfaz CORRECTAMENTE.
         jest.restoreAllMocks();
         expect(createRecital.find('p').length).toEqual(0);
         createRecital.find('input[name="nombre"]').simulate('change', {
            target: {
               name: 'nombre',
               value: 'Pruebaaaaa tttttttttttt tttttttt ttttttttttttttttttttttttttttttttttttttttt tttttttttttttt',
            },
         });
         expect(createRecital.find('p').at(0).text()).toEqual(
            'Nombre demasiado largo'
         );

         // Al insertar un valor correcto en el input, el "p" deberia desaparecer
         createRecital.find('input[name="nombre"]').simulate('change', {
            target: { name: 'nombre', value: 'Metallica' },
         });
         expect(createRecital.find('p').length).toEqual(2);
      });

      it("Al ingresar una 'descripcion' con una longitud menor a 50 caracteres, debe renderizar un <p> indicando el error", () => {
         jest.restoreAllMocks();
         expect(createRecital.find('p').length).toEqual(0);
         createRecital.find('textarea[name="descripcion"]').simulate('change', {
            target: {
               name: 'descripcion',
               value: 'Metallica es... continuará',
            },
         });
         expect(createRecital.find('p').at(0).text()).toEqual(
            'Descripción demasiada corta'
         );
         createRecital.find('textarea[name="descripcion"]').simulate('change', {
            target: {
               name: 'descripcion',
               value: "Aerosmith hará vibrar el Estadio Wembley con su incomparable estilo y talento musical. ¡Prepárate para una noche de Rock inolvidable!",
            },
         });
         expect(createRecital.find('p').length).toEqual(1);
      });

      it("Al escribir el 'lugar' con una longitud menor a 10 caracteres, debe renderizar un <p> indicando el error", () => {
         jest.restoreAllMocks();
         expect(createRecital.find('p').length).toEqual(0);
         createRecital.find('input[name="lugar"]').simulate('change', {
            target: { name: 'lugar', value: 'Un lugar' },
         });
         expect(createRecital.find('p').at(1).text()).toEqual(
            'Debes especificar un lugar'
         );
         // Al insertar un valor correcto en el input, el "p" deberia desaparecer
         createRecital.find('input[name="lugar"]').simulate('change', {
            target: {
               name: 'lugar',
               value: 'Madison Square Garden, New York',
            },
         });
         expect(createRecital.find('p').length).toEqual(1);
      });

      it('Si hay errores, no debería despachar la action', () => {
         const dispatchSpy = jest.spyOn(actions, 'createRecital');
         // Corrobora varias veces de que si hay algun error, no se despache la action
         createRecital.find('input[name="nombre"]').simulate('change', {
            target: {
               name: 'nombre',
               value: 'Pruebaaaa tttttttttttt tttttttt ttttttttttttttttttttttttttttttttttttttttt tttttttttttttt',
            },
         });
         createRecital.find('button').simulate('submit');
         expect(dispatchSpy).not.toHaveBeenCalled();

         createRecital.find('textarea[name="descripcion"]').simulate('change', {
            target: {
               name: 'descripcion',
               value: 'Led Zeppelin es...',
            },
         });
         createRecital.find('button').simulate('submit');
         expect(dispatchSpy).not.toHaveBeenCalled();

         createRecital.find('input[name="lugar"]').simulate('change', {
            target: { name: 'lugar', value: 'Noruega' },
         });
         createRecital.find('button').simulate('submit');
         expect(dispatchSpy).not.toHaveBeenCalled();
      });
   });
});