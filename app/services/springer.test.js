const axios = require("axios");
const searchResponse = require("../../__fixtures__/springerResponse");

jest.mock("axios");

describe("Springer service", () => {
  let springer;

  beforeEach(() => springer = require("./springer"));

  test("fetches results from Springer API", () => {
    axios.get.mockResolvedValue({data: searchResponse});

    return springer.getByKeyword("user experience").then((data) => expect(data).toEqual(searchResponse));
  });
});
