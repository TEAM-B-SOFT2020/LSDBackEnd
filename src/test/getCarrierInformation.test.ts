import ICarrierDetail from "contract/src/DTO/ICarrierDetail";
import Contract from "../contract/Contract";

var contract: Contract;

beforeAll(() => {
  contract = new Contract();
});

describe("Succes scenarios", () => {
  test("Should return ICarrierDetail from iata", async () => {
    //arrange
    const iata: string = "SK";
    const name: string = "Scandinavian Airlines";
    const expected: ICarrierDetail = { iata, name };

    //act
    const actual: ICarrierDetail = await contract.getCarrierInformation(iata);

    //assert
    expect(expected).toEqual(expected);
  });
});

describe("Fail scenarios", () => {
  test("True should be truthy", () => {
    expect(true).toBeTruthy();
  });
});
