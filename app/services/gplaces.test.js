const axios = require("axios");
const searchResponse = require("../../__fixtures__/gplacesResponse");

jest.mock("axios");

let gplaces;

beforeEach(() => {
  gplaces = require("./gplaces")();
});
describe("gplaces getPlaces", () => {
  test("if data gets fetched if only query specified", () => {
    axios.get.mockResolvedValue({data: searchResponse});
    return gplaces.getPlaces({query: "DHBW"})
        .then((data) => expect(data).toEqual(searchResponse))
        .catch(() => fail());
  });
  test("if data gets fetched if only query specified", () => {
    axios.get.mockResolvedValue({data: searchResponse});
    return gplaces.getPlaces({location: "48.803790, 9.236430", radius: 200})
        .then((data) => expect(data).toEqual(searchResponse))
        .catch(() => fail());
  });
  test("if data gets fetched if only query specified", () => {
    axios.get.mockResolvedValue({data: searchResponse});
    return gplaces.getPlaces({location: "48.803790, 9.236430"})
        .then((data) => expect(data).toEqual(searchResponse))
        .catch(() => fail());
  });
  test("if data gets fetched if only query specified", () => {
    axios.get.mockResolvedValue({data: searchResponse});
    return gplaces.getPlaces({query: "DHBW", location: "48.803790, 9.236430"})
        .then((data) => expect(data).toEqual(searchResponse))
        .catch(() => fail());
  });
});

describe("gplaces getFormattedAddress", () => {
  test("if addresses get formatted", () => {
    axios.get.mockResolvedValue({data: searchResponse});
    return gplaces.getFormattedAddress({query: "DHBW"})
        .then((data) => expect(data).toEqual([
          {
            street: "Im Wiesengrund 40",
            postalCode: "70794",
            city: "Filderstadt",
            name: "Im Wiesengrund 40"},
          {
            street: "Im Wiesengrund 40",
            postalCode: "70806",
            city: "Kornwestheim",
            name: "Im Wiesengrund 40"},
        ]))
        .catch(() => {
          throw new Error("Fehlgeschlagen");
        });
  });
});

