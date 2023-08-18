import nock from "nock";
import React from "react";
import axios from "axios";
import App from "../src/App";
import thunk from "redux-thunk";
import nodeFetch from "node-fetch";
import * as data from "../db.json";
import { Provider } from "react-redux";
import { configure, mount } from "enzyme";
import Nav from "../src/components/Nav/Nav";
import configureStore from "redux-mock-store";
import Home from "../src/components/Home/Home";
import { MemoryRouter } from "react-router-dom";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import RecitalCard from "../src/components/RecitalCard/RecitalCard";
import CreateRecital from "../src/components/CreateRecital/CreateRecital";
import RecitalDetail from "../src/components/RecitalDetail/RecitalDetail";

axios.defaults.adapter = require("axios/lib/adapters/http");

configure({ adapter: new Adapter() });

// Mocks de los componentes, acá se pueden hardcodear para que funcionen SI o SI
// De esa manera sin importar si hay errores en alguno de ellos, nos fijamos de que sean montados en app.js
jest.mock("../src/components/RecitalDetail/RecitalDetail", () => () => <></>);
jest.mock("../src/components/RecitalCard/RecitalCard", () => () => <></>);
jest.mock("../src/components/Nav/Nav", () => () => <></>);
jest.mock("../src/components/CreateRecital/CreateRecital", () => () => <></>);
jest.mock("../src/components/Home/Home", () => () => <></>);

describe("<App />", () => {
  global.fetch = nodeFetch;

  let store;
  const routes = ["/", "/recitales/1", "/recitales/create"];
  const mockStore = configureStore([thunk]);
  const state = {
    recitales: data.recitales,
    recitalesDetail: data.recitales[0],
  };

  beforeEach(async () => {
    // Se mockea las request a las API
    const apiMock = nock("http://localhost:3001").persist();

    // "/recitales" => Retorna la propiedad recitales del archivo "data.json".
    apiMock.get("/recitales").reply(200, data.recitales);

    // "/recitales/:id" => Retorna un recital matcheado por su "id".
    let id = null;
    apiMock
      .get((uri) => {
        id = Number(uri.split("/").pop()); // Number('undefined') => NaN.
        return !!id;
      })
      .reply(200, (uri, requestBody) => {
        return data.recitales.find((recitales) => recitales.id === id) || {};
      });
  });

  store = mockStore(state);

  const componentToUse = (route) => {
    return (
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>
          <App />
        </MemoryRouter>
      </Provider>
    );
  };

  describe("Nav:", () => {
    it('Debe ser renderizado en la ruta "/"', () => {
      const app = mount(componentToUse(routes[0]));
      expect(app.find(Nav)).toHaveLength(1);
    });

    it('Debe ser renderizado en la ruta "/recitales/:id"', () => {
      const app = mount(componentToUse(routes[1]));
      expect(app.find(Nav)).toHaveLength(1);
    });
    it('Debe ser renderizado en la ruta "/recitales/create"', () => {
      const app = mount(componentToUse(routes[2]));
      expect(app.find(Nav)).toHaveLength(1);
    });
  });

  describe("Home:", () => {
    it('El componente "Home" debe ser renderizado solamente en la ruta "/"', () => {
      const app = mount(componentToUse(routes[0]));
      expect(app.find(RecitalDetail)).toHaveLength(0);
      expect(app.find(CreateRecital)).toHaveLength(0);
      expect(app.find(Home)).toHaveLength(1);
    });
    it('El componente "Home" no debería mostrarse en ninguna otra ruta', () => {
      const app = mount(componentToUse(routes[0]));
      expect(app.find(Home)).toHaveLength(1);

      const app2 = mount(componentToUse(routes[1]));
      expect(app2.find(Home)).toHaveLength(0);

      const app3 = mount(componentToUse(routes[2]));
      expect(app3.find(Home)).toHaveLength(0);
    });
  });

  describe("RecitalDetail:", () => {
    it('La ruta "/recitales/:id" debería mostrar solo el componente RecitalDetail', () => {
      const app = mount(componentToUse(routes[1]));
      expect(app.find(Home)).toHaveLength(0);
      expect(app.find(RecitalCard)).toHaveLength(0);
      expect(app.find(RecitalDetail)).toHaveLength(1);
    });
  });

  describe("CreateRecital:", () => {
    it('La ruta "/recitales/create" debería mostrar solo el componente CreateRecital', () => {
      const app = mount(componentToUse(routes[2]));
      expect(app.find(CreateRecital)).toHaveLength(1);
      expect(app.find(RecitalCard)).toHaveLength(0);
      expect(app.find(Nav)).toHaveLength(1);
      expect(app.find(Home)).toHaveLength(0);
    });
  });
});
