import thunk from "redux-thunk";
import * as data from "../db.json";
import { Provider } from "react-redux";
import { configure, mount } from "enzyme";
import configureStore from "redux-mock-store";
import * as actions from "../src/redux/actions/index";
import { Link, MemoryRouter } from "react-router-dom";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import RecitalCardConnected from "../src/components/RecitalCard/RecitalCard";

configure({ adapter: new Adapter() });

jest.mock("../src/redux/actions/index", () => ({
  deleteRecital: () => ({
    type: "DELETE_RECITAL",
  }),
}));

describe("<RecitalCard />", () => {
  let recitalCard, state, store;
  const mockStore = configureStore([thunk]);
  let recitales = data.recitales;
  state = {
    recitales: [],
    recitalDetail: {},
  };
  store = mockStore(state);
  beforeEach(() => {
    recitalCard = (recital) =>
      mount(
        <Provider store={store}>
          <MemoryRouter>
            <RecitalCardConnected
              id={recital.id}
              nombre={recital.nombre}
              descripcion={recital.descripcion}
              imagen={recital.imagen}
              fecha={recital.fecha}
              lugar={recital.lugar}
            />
          </MemoryRouter>
        </Provider>
      );
  });

  afterEach(() => jest.restoreAllMocks());

  describe("Estructura", () => {
    it('Debe renderizar un botón con el texto "x"', () => {
      const wrapper = recitalCard(recitales[0]);
      expect(wrapper.find("button").text()).toBe("x");
    });

    it('Debe renderizar un "h3" que muestre la propiedad {nombre} de cada recital', () => {
      expect(recitalCard(recitales[0]).find("h3").at(0).text()).toBe("Guns N' Roses");
      expect(recitalCard(recitales[1]).find("h3").at(0).text()).toBe("Metallica");
      expect(recitalCard(recitales[2]).find("h3").at(0).text()).toBe("Aerosmith");
    });

    it('Debe renderizar la imagen de cada recital y un atributo "alt" con el nombre del recital', () => {
      expect(recitalCard(recitales[0]).find("img").prop("src")).toBe(
        recitales[0].imagen
      );
      expect(recitalCard(recitales[0]).find("img").prop("alt")).toBe(
        recitales[0].nombre
      );
      expect(recitalCard(recitales[1]).find("img").prop("src")).toBe(
        recitales[1].imagen
      );
      expect(recitalCard(recitales[1]).find("img").prop("alt")).toBe(
        recitales[1].nombre
      );
    });

    it('Debe renderizar un <p> que contenga el texto "Fecha: " seguido de la propiedad {fecha} de cada recital', () => {
      expect(recitalCard(recitales[3]).find("p").at(0).text()).toBe("Fecha: 2023-09-25"  );
      expect(recitalCard(recitales[4]).find("p").at(0).text()).toBe("Fecha: 2023-09-25" );
    });

    it('Debe asociar una etiqueta <Link> con el "nombre" de cada recital y redirigir a "/recitales/:id"', () => {
      expect(recitalCard(recitales[0]).find(Link)).toHaveLength(1);
      expect(recitalCard(recitales[0]).find(Link).at(0).prop("to")).toEqual(
        "/recitales/1"
      );
    });

    it('Debe hacer un dispatch al estado global utilizando la action "deleteRecital" al hacer click en el botón "x". Debe pasarle el ID del recital', () => {
      const deleteRecitalespy = jest.spyOn(actions, "deleteRecital");
      const recitalCard = mount(
        <Provider store={store}>
          <MemoryRouter>
            <RecitalCardConnected
              id={recitales[0].id}
              nombre={recitales[0].nombre}
              descripcion={recitales[0].descripcion}
              imagen={recitales[0].imagen}
              fecha={recitales[0].fecha}
              lugar={recitales[0].lugar}
            />
          </MemoryRouter>
        </Provider>
      );
      recitalCard.find("button").simulate("click");
      expect(deleteRecitalespy).toHaveBeenCalled();
      expect(deleteRecitalespy).toHaveBeenCalledWith(recitales[0].id);

      const recitalCard2 = mount(
        <Provider store={store}>
          <MemoryRouter>
            <RecitalCardConnected
              id={recitales[0].id}
              nombre={recitales[0].nombre}
              descripcion={recitales[0].descripcion}
              imagen={recitales[0].imagen}
              fecha={recitales[0].fecha}
              lugar={recitales[0].lugar}
            />
          </MemoryRouter>
        </Provider>
      );
      recitalCard2.find("button").simulate("click");
      expect(deleteRecitalespy).toHaveBeenCalled();
      expect(deleteRecitalespy).toHaveBeenCalledWith(recitales[0].id);
    });
  });
});