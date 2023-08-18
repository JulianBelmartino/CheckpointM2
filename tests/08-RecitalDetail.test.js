import nock from 'nock';
import React from 'react';
import isReact from 'is-react';
import thunk from 'redux-thunk';
import * as data from '../db.json';
import nodeFetch from 'node-fetch';
import Router from 'react-router-dom';
import { configure, mount } from 'enzyme';
import * as ReactRedux from 'react-redux';
import configureStore from 'redux-mock-store';
import { MemoryRouter } from 'react-router-dom';
import * as actions from '../src/redux/actions';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import RecitalDetail from '../src/components/RecitalDetail/RecitalDetail';

configure({ adapter: new Adapter() });

jest.mock('../src/redux/actions/index.js', () => ({
   getRecitalDetail: () => ({
      type: 'GET_RECITAL_DETAIL',
   }),
}));

jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom'),
   useParams: () => ({
      id: '12',
   }),
}));

describe('<RecitalDetail />', () => {
   global.fetch = nodeFetch;
   let recitalDetail, useSelectorStub, useSelectorFn, useEffect;
   const noProd = {

      id: 1,
      nombre: "Guns N' Roses",
      fecha: "2023-08-15",
      lugar: "Estadio Wembley, Londres",
      descripcion: "Guns N' Roses regresa con un concierto épico en el Estadio Wembley. No te pierdas la oportunidad de presenciar la legendaria banda de Rock en vivo.",
      imagen: "https://example.com/gunsnroses.jpg"

   };

   const match = (id) => ({
      params: { id },
      isExact: true,
      path: '/recitales/:id',
      url: `/recitales/${id}`,
   });
   const mockStore = configureStore([thunk]);

   const store = (id) => {
      let state = {
         recitales: data.recitales.concat(noProd),
         recitalDetail:
            id !== 10 ? data.recitales[id - 1] : data.recitales.concat(noProd),
      };
      return mockStore(state);
   };
   // Si o si vas a tener que usar functional component! No van a correr ninguno de los tests si no lo haces!
   // También fijate que vas a tener que usar algunos hooks. Tanto de React como de Redux!
   // Los hooks de React si o si los tenes que usar "React.useState", "React.useEffect". El test no los reconoce
   // cuando se hace destructuring de estos métodos === test no corren.
   beforeAll(() => expect(isReact.classComponent(RecitalDetail)).toBeFalsy());
   const mockUseEffect = () => useEffect.mockImplementation((fn) => fn());

   beforeEach(() => {
      // Se Mockea las request a las api
      const apiMock = nock('http://localhost:3001').persist();

      // "/recitales" => Retorna la propiedad recitales del archivo data.json
      apiMock.get('/recitales').reply(200, data.recitales);

      // "/recitales/:id" => Retorna un recital matcheado por su id

      let id = null;
      apiMock
         .get((uri) => {
            id = Number(uri.split('/').pop()); // Number('undefined') => NaN
            return !!id;
         })
         .reply(200, (uri, requestBody) => {
            return data.recitales.find((recital) => recital.id === id) || {};
         });
      useSelectorStub = jest.spyOn(ReactRedux, 'useSelector');
      useSelectorFn = (id) =>
         useSelectorStub.mockReturnValue(store(id).getState().recitalDetail);
      useEffect = jest.spyOn(React, 'useEffect');
      recitalDetail = (id) =>
         mount(
            <ReactRedux.Provider store={store(id)}>
               <MemoryRouter initialEntries={[`/recitales/${id}`]}>
                  <RecitalDetail match={match(id)} />
               </MemoryRouter>
            </ReactRedux.Provider>
         );
      mockUseEffect();
      mockUseEffect();
   });

   afterEach(() => jest.restoreAllMocks());

   // 🚨IMPORTANTE TRABAJAMOS CON LA REFERENCIA DE LAS ACTIONS LA IMPORTACION DE LAS ACTIONS DEBE SER DE LA SIGUIENTE MANERA🚨
   // import * as actions from "./../../redux/actions/index";

   it('Debe utilizar React.useEffect para que despache la acción "getRecitalDetail", pasándole como argumento el ID del recital', async () => {
      // Nuevamente testeamos todo el proceso. Tenes que usar un useEffect, y despachar la acción "getRecitalDetail".
      const useDispatch = jest.spyOn(ReactRedux, 'useDispatch');
      const getRecitalDetail = jest.spyOn(actions, 'getRecitalDetail');
      recitalDetail(1);
      expect(useEffect).toHaveBeenCalled();
      expect(useDispatch).toHaveBeenCalled();
      expect(getRecitalDetail).toHaveBeenCalled();

      recitalDetail(2);
      expect(useEffect).toHaveBeenCalled();
      expect(useDispatch).toHaveBeenCalled();
      expect(getRecitalDetail).toHaveBeenCalled();
   });

   it('Debe llamar a la función useParams y obtener el id', async () => {
      jest.spyOn(Router, 'useParams').mockReturnValue({ id: '1' });
      recitalDetail();
      expect(Router.useParams).toHaveBeenCalled();
   });

   describe('Debe utilizar el "id" obtenido por params para despachar la action "getRecitalDetail" y renderizar los detalles del recital', () => {
      const recitales = data.recitales[0];
      // Fijate que para traerte los datos desde Redux, vas a tener que usar el hook de Redux "useSelector"
      // para que los tests pasen!
      // Lo que se esta testeando aca, es que el componente renderice los detalles del todo correctamente,
      // no la estructura del componente asi que eres libre de diseñar la estructura, siempre y cuando se muestren los datos del todo.
      // Verificar la llegada del id proveniente de useParams, puede romper en el caso que no exista nada.
      it("Debe renderizar un tag 'h1' que muestre el nombre de cada 'recital'", () => {
         useSelectorFn(1);
         expect(recitalDetail(1).text().includes(recitales.nombre)).toEqual(
            true
         );
         expect(recitalDetail(1).find('h1').at(0).text()).toBe(recitales.nombre);
         expect(useSelectorStub).toHaveBeenCalled();
         expect(useEffect).toHaveBeenCalled();
      });

      it("Debe renderizar una etiqueta 'img' donde su prop 'src' sea la imagen del recital y la prop 'alt' el nombre del recital.", () => {
         useSelectorFn(1);
         expect(recitalDetail(1).find('img').prop('src')).toBe(recitales.imagen);
         expect(recitalDetail(1).find('img').prop('alt')).toBe(recitales.nombre);
         expect(useSelectorStub).toHaveBeenCalled();
         expect(useEffect).toHaveBeenCalled();
      });

      it("Debe renderizar una etiqueta 'h3' que contenga el texto 'Descripcion: ' y la descripcion del recital.", () => {
         useSelectorFn(1);
         expect(recitalDetail(1).text().includes(recitales.descripcion)).toEqual(
            true
         );
         expect(recitalDetail(1).find('h3').at(0).text()).toBe(
            `Descripcion: ${recitales.descripcion}`
         );
         expect(useSelectorStub).toHaveBeenCalled();
         expect(useEffect).toHaveBeenCalled();
      });

      it("Debe renderizar una etiqueta 'h5' que contenga el texto 'Fecha: ' y la fecha del recital.", () => {
         useSelectorFn(1);
         expect(recitalDetail(1).text().includes(recitales.fecha)).toEqual(
            true
         );
         expect(recitalDetail(1).find('h5').at(0).text()).toBe(
            'Fecha: ' + recitales.fecha
         );
         expect(useSelectorStub).toHaveBeenCalled();
         expect(useEffect).toHaveBeenCalled();
      });

      it("Debe renderizar una etiqueta 'h5' que contenga el texto 'Lugar: ' y el lugar del recital.", () => {
         useSelectorFn(1);
         expect(
            recitalDetail(1).text().includes(recitales.lugar)
         ).toEqual(true);
         expect(recitalDetail(1).find('h5').at(1).text()).toBe(
            'Lugar: ' + recitales.lugar
         );
         expect(useSelectorStub).toHaveBeenCalled();
         expect(useEffect).toHaveBeenCalled();
      });


   });
});