/* eslint-disable jest/no-conditional-expect */
import nock from 'nock';
import axios from 'axios';
import thunk from 'redux-thunk';
import * as data from '../db.json';
import nodeFetch from 'node-fetch';
import configureStore from 'redux-mock-store';
import { CREATE_RECITAL, DELETE_RECITAL, GET_ALL_RECITALES, GET_RECITAL_DETAIL, createRecital, deleteRecital, getAllRecitales, getRecitalDetail } from '../src/redux/actions';


axios.defaults.adapter = require('axios/lib/adapters/http');

describe('Actions', () => {
   const mockStore = configureStore([thunk]);
   const store = mockStore({ recitales: [] });
   global.fetch = nodeFetch;
   beforeEach(() => {
      store.clearActions();

      // Se mockea las request a las api
      const apiMock = nock('http://localhost:3001').persist();

      // "/recitales" => retorna la propiedad recitales del archivo "data.json".
      apiMock.get('/recitales').reply(200, data.recitales);

      // "/recitales/:id" => retorna un recital matcheado por su "id".
      let id = null;
      apiMock
         .get((uri) => {
            id = Number(uri.split('/').pop()); // Number('undefined') => NaN.
            return !!id;
         })
         .reply(200, (uri, requestBody) => {
            return data.recitales.find((recitales) => recitales.id === id) || {};
         });
   });

   afterEach(() => {
      nock.cleanAll();
   });

   describe('getAllRecitales', () => {
      it("Debe hacer un dispatch con las propiedades 'type: GET_ALL_RECITALES' y, como payload, el resultado de la petición al End-Point provisto", async () => {
         return store
            .dispatch(getAllRecitales())
            .then(() => {
               const actions = store.getActions();
               expect(actions[0].payload.length).toBe(5);
               expect(actions[0]).toEqual({
                  type: GET_ALL_RECITALES,
                  payload: data.recitales,
               });
            })
            .catch((err) => {
               // En caso de que haya un error al mandar la petición al back, el error entrara aquí. Podrás visualizarlo en la consola.
               console.error(err);
               expect(err).toBeUndefined();
            });
      });
   });

   describe('getRecitalDetail', () => {
      it("Debe hacer un dispatch con las propiedades 'type: GET_RECITAL_DETAIL' y, como payload, el resultado de la petición al End-Point provisto", async () => {
         const payload = data.recitales[0];
         return store
            .dispatch(getRecitalDetail(payload.id))
            .then(() => {
               const actions = store.getActions();
               expect(actions[0]).toStrictEqual({
                  type: GET_RECITAL_DETAIL,
                  payload: { ...payload },
               });
            })
            .catch((err) => {
               // El catch lo utilizamos para "atrapar" cualquier tipo de error a la hora de hacer la petición al Back. Sólo va a entrar si el test no sale como es pedido.
               // Para ver que está pasando debes revisar la consola.
               console.error(err);
               expect(err).toBeUndefined();
            });
      });

      it('Debe traer un recital distinto si el ID requerido es otro', async () => {
         const payload = data.recitales[1];
         return store
            .dispatch(getRecitalDetail(payload.id))
            .then(() => {
               const actions = store.getActions();
               expect(actions[0]).toStrictEqual({
                  type: GET_RECITAL_DETAIL,
                  payload: { ...payload },
               });
            })
            .catch((err) => {
               // El catch lo utilizamos para "atrapar" cualquier tipo de errores a la hora de hacer la petición al Back. Sólo va a entrar si el test no sale como es pedido.
               // Para ver que está pasando Debes revisar la consola.
               console.error(err);
               expect(err).toBeUndefined();
            });
      });
   });

   describe('createRecital', () => {
      it("Debe retornar una action con las propiedades 'type: CREATE_RECITAL' y, como payload, contener los values recibidos como argumento y un ID incremental", () => {
         // Para que este test pase, deberan declarar una variable ID y que su valor inicialice en 6. Lo hacemos para que no haya conflicto entre los id's mockeados.
         // Si revisas el archivo db.json verán la lista de recitales.
         const payload1 = {

            id: 1,
            nombre: "Guns N' Roses",
            fecha: "2023-08-15",
            lugar: "Estadio Wembley, Londres",
            descripcion: "Guns N' Roses regresa con un concierto épico en el Estadio Wembley. No te pierdas la oportunidad de presenciar la legendaria banda de Rock en vivo.",
            imagen: "https://example.com/gunsnroses.jpg"
      
         };

         const payload2 = {
            id: 2,
            nombre: "Metallica",
            fecha: "2023-08-15",
            lugar: "Estadio Wembley, Londres",
            descripcion: "Metallica, la icónica banda de Heavy Metal, llega al Estadio Wembley para ofrecer un espectáculo inolvidable con sus clásicos y nuevos éxitos.",
            imagen: "https://example.com/metallica.jpg"
          }

         expect(createRecital(payload1)).toEqual({
            type: CREATE_RECITAL,
            payload:  {

               id: 1,
               nombre: "Guns N' Roses",
               fecha: "2023-08-15",
               lugar: "Estadio Wembley, Londres",
               descripcion: "Guns N' Roses regresa con un concierto épico en el Estadio Wembley. No te pierdas la oportunidad de presenciar la legendaria banda de Rock en vivo.",
               imagen: "https://example.com/gunsnroses.jpg"
         
            }
         });

         expect(createRecital(payload2)).toEqual({
            type: CREATE_RECITAL,
            payload:  {
               id: 2,
               nombre: "Metallica",
               fecha: "2023-08-15",
               lugar: "Estadio Wembley, Londres",
               descripcion: "Metallica, la icónica banda de Heavy Metal, llega al Estadio Wembley para ofrecer un espectáculo inolvidable con sus clásicos y nuevos éxitos.",
               imagen: "https://example.com/metallica.jpg"
             }
         });
      });
   });

   describe('deleteRecital', () => {
      it("Debe retornar una action con las propiedades 'type: DELETE_RECITAL, y como payload, el ID del recital a eliminar. Recibe el ID por argumento", () => {
         expect(deleteRecital(1)).toEqual({
            type: DELETE_RECITAL,
            payload: 1,
         });
         expect(deleteRecital(2)).toEqual({
            type: DELETE_RECITAL,
            payload: 2,
         });
      });
   });
});
