import * as data from '../db.json';
import rootReducer from '../src/redux/reducer';
import { GET_ALL_RECITALES, GET_RECITAL_DETAIL, createRecital, deleteRecital } from '../src/redux/actions';

// Acá se mockean las actions para que el test pueda funcionar correctamente, sin importar si hay un bug en ese archivo.
jest.mock('../src/redux/actions', () => ({
   __esmodules: true,
   GET_ALL_RECITALES: 'GET_ALL_RECITALES',
   DELETE_RECITAL: 'DELETE_RECITAL',
   GET_RECITAL_DETAIL: 'GET_RECITAL_DETAIL',
   CREATE_RECITAL: 'CREATE_RECITAL',
   createRecital: (payload) => ({
      type: 'CREATE_RECITAL',
      payload,
   }),
   deleteRecital: (payload) => ({
      type: 'DELETE_RECITAL',
      payload,
   }),
   getRecitalDetail: (payload) => ({
      type: 'GET_RECITAL_DETAIL',
      payload,
   }),
}));

describe('Reducer', () => {
   const state = {
      recitales: [],
      recitalDetail: {},
   };

   it('Si no hay un action-type válido, debe retornar el estado inicial', () => {
      expect(rootReducer(undefined, [])).toEqual({
         recitales: [],
         recitalDetail: {},
      });
   });

   it('Cuando la action-type es "GET_ALL_RECITALES", debe guardar en el estado "recitales" aquellos recitales obtenidos en el llamado al Back-End', () => {
      const result = rootReducer(state, {
         type: GET_ALL_RECITALES,
         payload: data.recitales,
      });
      // Acuerdense que el state inicial no tiene que mutar!
      expect(result).not.toEqual(state);
      expect(result).toEqual({
         recitales: data.recitales, // Cuando ejecutes los tests, vas a ver bien lo que espera que le llegue a nuestro estado!
         recitalDetail: {},
      });
   });

   it('Cuando la action-type es "GET_RECITAL_DETAIL", debe guardar en el estado "recitalDetail" aquel recital obtenido en el llamado al Back-End', () => {
      const result = rootReducer(state, {
         type: GET_RECITAL_DETAIL,
         payload: data.recitales,
      });
      // Acuerdense que el state inicial no tiene que mutar!
      expect(result).not.toEqual(state);
      expect(result).toEqual({
         recitales: [],
         recitalDetail: data.recitales,
      });
   });

   it('Cuando la action-type es "CREATE_RECITAL", debe agregar un nuevo recital al estado "recitales"', () => {
      const state = {
         recitales: data.recitales,
         recitalDetail: {},
      };

      const payload1 =  {
         id: 4,
         nombre: "Led Zeppelin",
         fecha: "2023-09-25",
         lugar: "Madison Square Garden, New York",
         descripcion: "Led Zeppelin, la mítica banda de Rock, regresa a los escenarios para ofrecer un show único en el Madison Square Garden.",
         imagen: "https://example.com/ledzeppelin.jpg"
       }

      const payload2 =    {
         id: 5,
         nombre: "Deep Purple",
         fecha: "2023-09-25",
         lugar: "Madison Square Garden, New York",
         descripcion: "Deep Purple, una de las bandas pioneras del Hard Rock, se presentará en el Madison Square Garden con su potente sonido y actuación en vivo.",
         imagen: "https://example.com/deeppurple.jpg"
       }

      const allrecitalesType1 = [
         ...data.recitales,
         {
            id: 4,
            nombre: "Led Zeppelin",
            fecha: "2023-09-25",
            lugar: "Madison Square Garden, New York",
            descripcion: "Led Zeppelin, la mítica banda de Rock, regresa a los escenarios para ofrecer un show único en el Madison Square Garden.",
            imagen: "https://example.com/ledzeppelin.jpg"
          }
      ];
      const allrecitalesType2 = [
         ...allrecitalesType1,
         {
            id: 5,
            nombre: "Deep Purple",
            fecha: "2023-09-25",
            lugar: "Madison Square Garden, New York",
            descripcion: "Deep Purple, una de las bandas pioneras del Hard Rock, se presentará en el Madison Square Garden con su potente sonido y actuación en vivo.",
            imagen: "https://example.com/deeppurple.jpg"
          }
      ];
      const primerRecital = rootReducer(state, createRecital(payload1));
      const segundoRecital = rootReducer(
         { ...state, recitales: allrecitalesType1 },
         createRecital(payload2)
      );

      // Acuerdense que el state inicial no tiene que mutar!
      expect(primerRecital).not.toEqual(state);
      expect(segundoRecital).not.toEqual(state);

      expect(primerRecital).toEqual({
         recitalDetail: {},
         recitales: allrecitalesType1,
      });
      expect(segundoRecital).toEqual({
         recitalDetail: {},
         recitales: allrecitalesType2,
      });
   });

   it('Cuando la action-type es "DELETE_RECITAL", debe eliminar el recital que posee el ID recibido del estado "recitales"', () => {
      // Caso 1
      const payload = 1;
      const state = {
         recitales: [
            {

               id: 1,
               nombre: "Guns N' Roses",
               fecha: "2023-08-15",
               lugar: "Estadio Wembley, Londres",
               descripcion: "Guns N' Roses regresa con un concierto épico en el Estadio Wembley. No te pierdas la oportunidad de presenciar la legendaria banda de Rock en vivo.",
               imagen: "https://example.com/gunsnroses.jpg"
         
            }
         ],
         recitalDetail: {},
      };

      expect(rootReducer(state, deleteRecital(payload))).toEqual({
         recitales: [],
         recitalDetail: {},
      });

      //Caso 2
      const payload2 = 4;
      const state2 = {
         recitales: [
            {
               id: 4,
               nombre: "Led Zeppelin",
               fecha: "2023-09-25",
               lugar: "Madison Square Garden, New York",
               descripcion: "Led Zeppelin, la mítica banda de Rock, regresa a los escenarios para ofrecer un show único en el Madison Square Garden.",
               imagen: "https://example.com/ledzeppelin.jpg"
             },
             {
               id: 5,
               nombre: "Deep Purple",
               fecha: "2023-09-25",
               lugar: "Madison Square Garden, New York",
               descripcion: "Deep Purple, una de las bandas pioneras del Hard Rock, se presentará en el Madison Square Garden con su potente sonido y actuación en vivo.",
               imagen: "https://example.com/deeppurple.jpg"
             }
         ],
         recitalDetail: {},
      };

      expect(rootReducer(state2, deleteRecital(payload2))).toEqual({
         recitales: [
            {
               id: 5,
               nombre: "Deep Purple",
               fecha: "2023-09-25",
               lugar: "Madison Square Garden, New York",
               descripcion: "Deep Purple, una de las bandas pioneras del Hard Rock, se presentará en el Madison Square Garden con su potente sonido y actuación en vivo.",
               imagen: "https://example.com/deeppurple.jpg"
             }
         ],
         recitalDetail: {},
      });
   });
});
