

import nock from "nock";
import React from "react";
import axios from "axios";
import isReact from "is-react";
import thunk from "redux-thunk";
import * as data from "../db.json";
import nodeFetch from "node-fetch";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { MemoryRouter } from "react-router-dom";
import * as actions from "../src/redux/actions";
import { configure, mount, shallow } from "enzyme";
import mainImage from "../src/imgcp2/recitales.jpg";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import RecitalCard from "../src/components/RecitalCard/RecitalCard";
import HomeConnected, { Home, mapDispatchToProps, mapStateToProps } from "../src/components/Home/Home";


axios.defaults.adapter = require("axios/lib/adapters/http");

configure({ adapter: new Adapter() });

// Acá se mockea la action para que el test pueda funcionar correctamente, sin importar si hay un bug en ese archivo
jest.mock("../src/redux/actions/index.js", () => ({
  getAllRecitales: () => ({
    type: "GET_ALL_RECITALES",
  }),
}));

jest.mock("../src/components/RecitalCard/RecitalCard", () => () => <></>);

describe("<Home />", () => {
  let home, store, state, getAllRecitalesSpy, componentDidMountSpy;
  global.fetch = nodeFetch;
  const mockStore = configureStore([thunk]);
  beforeEach(() => {
    // Se Mockea las request a las api
    const apiMock = nock("http://localhost:3001").persist();

    // "/RECITALES" => Retorna la propiedad RECITALES del archivo data.json
    apiMock.get("/recitales").reply(200, data.recitales);

    // "/recitales/:id" => Retorna un recital matcheado por su id
    // "/recitales/:id" => Retorna un recital matcheado por su id
    let id = null;

    apiMock
      .get((uri) => {
        id = Number(uri.split("/").pop()); // Number('undefined') => NaN
        return !!id;
      })
      .reply(200, (uri, requestBody) => {
        return data.recitales.find((recital) => recital.id === id) || {};
      });
    state = {
      recitales: [],
      recitalDetail: {},
    };
    store = mockStore(state);
    home = mount(<HomeConnected store={store} />);
    // Si o si vas a tener que usar class component! No van a pasar ninguno de los tests si no lo haces.
    expect(isReact.classComponent(Home)).toBeTruthy();

    store.clearActions();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('Debe rederizar un "h1" con el texto "Recitales"', () => {
    expect(home.find("h1").at(0).text()).toEqual("Recitales");
  });

  it('Debe renderizar un tag "img" con la imagen provista en la carpeta "img-cp2"', () => {
    // Tendrías que importar la img a tu archivo "Home.jsx" y luego usarla como source de img.
    // Podés ver como lo hacemos en este mismo archivo en la linea 16!
    expect(home.find("img").at(0).prop("src")).toEqual(mainImage);
  });

  it('La imagen debe tener un atributo "alt" con el texto "recital-logo"', () => {
    expect(home.find("img").at(0).prop("alt")).toEqual("recital-logo");
  });

  it('Debe rederizar un "h3" con el texto "Recitales:"', () => {
    expect(home.find("h3").at(0).text()).toEqual("Recitales:");
  });

  it('Debe rederizar un "h4" con el texto "Checkpoint M2"', () => {
    expect(home.find("h4").at(0).text()).toEqual("Checkpoint M2");
  });

  describe("connect Redux", () => {
    // 🚨IMPORTANTE TRABAJAMOS CON LA REFERENCIA DE LAS ACTIONS TE DEJAMOS COMENTARIOS PARA CADA USO LEER BIEN!!🚨
    it("Debe traer del estado global de Redux todos los recitales utilizando mapStateToProps", () => {
      // El estado Debe tener un nombre "recitales".
      expect(mapStateToProps(state)).toEqual({
        recitales: state.recitales,
      });
    });

    if (typeof mapDispatchToProps === "function") {
      // ESTE TEST ES POR SI HACES EL MAPDISPATCHTOPROPS COMO UNA FUNCIÓN.
      // IMPORTANTE! SI LO HACES DE ESTA FORMA LA IMPORTACION DE LAS ACTIONS DEBE SER DE LA SIGUIENTE MANERA
      // import * as actions from "./../../redux/actions/index";
      it("Debe traer por props la action-creator 'getAllRecitales' de Redux utilizando mapDispatchToProps", () => {
        // Acá testeamos que hagas todo el proceso. Utilizas la funcion "mapDispatchToProps",
        // y con ella despachas la accion "getAllRecitales".
        const getAllRecitales = jest.spyOn(actions, "getAllRecitales");
        const dispatch = jest.fn();
        const props = mapDispatchToProps(dispatch);
        props.getAllRecitales();
        expect(dispatch).toHaveBeenCalled();
        expect(getAllRecitales).toHaveBeenCalled();
      });
    } else {
      // ESTE TEST ES POR SI HACES EL MAPDISPATCHTOPROPS COMO UN OBJETO.
      // IMPORTANTE! SI LO HACES DE ESTA FORMA mapDispatchToProps TIENE QUE SER EL OBJETO
      // eslint-disable-next-line jest/no-identical-title
      it("Debe traer por props la action-creator 'getAllRecitales' de Redux utilizando mapDispatchToProps", () => {
        // Acá testeamos que hagas todo el proceso. Utilizas connect y el objeto "mapDispatchToProps",
        // traes la acción "getAllRecitales". Con esto podrás usarla luego en el componente.
        const getAllRecitales = jest.spyOn(actions, "getAllRecitales");
        getAllRecitales();
        expect(
          mapDispatchToProps.hasOwnProperty("getAllRecitales")
        ).toBeTruthy();
        expect(getAllRecitales).toHaveBeenCalled();
      });
    }
  });

  describe("React LifeCycles", () => {
    getAllRecitalesSpy = jest.fn();
    let instance;
    beforeEach(async () => {
      state = {
        recitales: data.recitales,
        recitalDetail: {},
      };
      store = mockStore(state);
      home = mount(
        <Provider store={store}>
          <MemoryRouter initialEntries={["/home"]}>
            <HomeConnected />
          </MemoryRouter>
        </Provider>
      );
    });

    beforeAll(() => {
      // Ojo acá. Antes que corran los demás tests, chequeamos que estés utilizando el lifeCycle correspondiente ( componentDidMount )
      // y que en él ejecutas la action creator "getAllRecitales" para traerte toda esa data.
      // Si no pasan estos tests, no pasan los demás!
      componentDidMountSpy = jest.spyOn(Home.prototype, "componentDidMount");
      instance = shallow(
        <Home getAllRecitales={getAllRecitalesSpy} />
      ).instance();

      instance.componentDidMount();
      expect(componentDidMountSpy).toHaveBeenCalled();
      expect(getAllRecitalesSpy).toHaveBeenCalled();
    });

    it("Debe mapear todos los recitales que hay en el estado global, y renderizar una <RecitalCard /> por cada una", () => {
      // Cuidado acá. Como realizamos una petición al back (código asincrónico), el componente se va a
      // renderizar más rápido. Hay un problema con esto, se va a intentar renderizar algunos datos que
      // no existen todavía, lo que es igual a un fatal error. Debes asegurarte que existen
      // jugadores y luego renderizarlos!
      // Pista: Usa un renderizado condicional.
      // IMPORTANTE: revisar el código arriba de este test, el beforeAll.
      // Ahí se está testeando el uso del lifecycle componentDidMount y que en él
      // traigas la data a renderizar.
      expect(home.find(RecitalCard)).toHaveLength(5);
    });

    it('Debe pasar a cada componente <RecitalCard /> las propiedades: "id", "nombre", "imagen" y "fecha" de cada recital', () => {
      // No olviden pasar la props KEY en el mappeo para mantener buenas prácticas.
      expect(home.find(RecitalCard).at(0).props().id).toEqual(1);
      expect(home.find(RecitalCard).at(0).props().nombre).toEqual("Guns N' Roses");
      expect(home.find(RecitalCard).at(0).props().imagen).toEqual("https://example.com/gunsnroses.jpg");
      expect(home.find(RecitalCard).at(0).props().fecha).toEqual("2023-08-15");
    });
  });
});