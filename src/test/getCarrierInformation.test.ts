import ICarrierDetail from "contract/src/DTO/ICarrierDetail";
import Contract from "../contract/Contract";
import { NotFoundError } from "../error";
import dotenv from "dotenv";
import * as db from "../util/dbHandler";

const contract: Contract = new Contract();

beforeAll(async () => {
  dotenv.config();
  await db.connect(process.env.TEST_CONNECTION_STRING);
  await db.drop();
  await db.populate();
});

afterAll(async () => {
  await db.disconnect()
})

describe("Succes scenarios", () => {
  test("Should return ICarrierDetail from iata", async () => {
    //arrange
    const iata: string = "SK";
    const name: string = "Scandinavian Airlines";
    const expected: ICarrierDetail = { iata, name };

    //act
    const actual: ICarrierDetail = await contract.getCarrierInformation(iata);

    //assert
    expect(actual).toEqual(expected);
  });
});

describe("Fail scenarios", () => {
  test("Should throw NotFoundError", async () => {
    //arrange
    const iata: string = "XX";

    //act
    const action = async () => {
      await contract.getCarrierInformation(iata);
    };

    //assert
    await expect(action).rejects.toThrow(NotFoundError);
  });
});
