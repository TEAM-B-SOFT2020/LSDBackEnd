import Contract from "../contract/Contract";
import dotenv from "dotenv";
import * as db from "../util/dbHandler";
import IAirportDetail from "contract/src/DTO/IAirportDetail";
import { NotFoundError, InputError } from "../error";

const contract: Contract = new Contract();

beforeAll(async () => {
    dotenv.config();
    await db.connect(process.env.TEST_CONNECTION_STRING, true);
    await db.drop();
    await db.populate();
});

afterAll(async () => {
    await db.drop();
    await db.disconnect()
})

describe("Success scenarios", () => {
    test("Should return IAirportDetail from iata", async () => {
        //arrange
        const iata: string = "CPH";
        const name: string = "Copenhagen Airport"
        const timeZone: string = "Europe/Copenhagen"
        const expected: IAirportDetail = { iata, name, timeZone }

        //act
        const actual: IAirportDetail = await contract.getAirportInformation(iata)

        //assert
        expect(actual).toEqual(expected);
    })
})

describe("Fail scenarios", () => {
    test("Should throw NotFoundError", async () => {
        //arrange
        const iata: string = "XXX";

        //act
        const action = async () => {
            await contract.getAirportInformation(iata);
        };

        //assert
        await expect(action).rejects.toThrow(NotFoundError);
    });

    test("Too short input - Should throw InputError", async () => {
        //arrange
        const iata: string = "XX";

        //act
        const action = async () => {
            await contract.getAirportInformation(iata);
        };

        //assert
        await expect(action).rejects.toThrow(InputError);
    });

    test("Too long input - Should throw InputError", async () => {
        //arrange
        const iata: string = "XXXX";

        //act
        const action = async () => {
            await contract.getAirportInformation(iata);
        };

        //assert
        await expect(action).rejects.toThrow(InputError);
    });

    test("Undefined input - Should throw InputError", async () => {
        //arrange
        const iata: any = undefined;

        //act
        const action = async () => {
            await contract.getAirportInformation(iata);
        };

        //assert
        await expect(action).rejects.toThrow(InputError);
    });
});

