import Contract from "../contract/Contract";
import dotenv from "dotenv";
import * as db from "../util/dbHandler";
import IBookingIdentifier from "contract/src/IBookingIdentifier";
import IBookingDetail from "contract/src/DTO/IBookingDetail";
import { InputError, NotFoundError } from "../error";
import IPassengerIdentifier from "contract/src/IPassengerIdentifier";

const contract: Contract = new Contract();
let populatedValues: any

beforeAll(async () => {
    dotenv.config();
    await db.connect(process.env.TEST_CONNECTION_STRING, true);
});

beforeEach(async () => {
    await db.drop();
    populatedValues = await db.populate();
})

afterAll(async () => {
    await db.drop();
    await db.disconnect()
})

describe("Success scenarios", () => {
    test("Cancel booking in database", async () => {
        //arrange
        const pnr: string = "B1BS34"
        const passengerIdentifier: IPassengerIdentifier = { pnr }

        //act
        const action = async () => {
            await contract.cancelBooking(passengerIdentifier)
        };
        //assert

        await expect(action).not.toThrowError()

    })
});

describe("Fail scenarios", () => {
    test("Cancel non-existing booking", async () => {
        //arrange
        const pnr: string = "ACBS34"
        const passengerIdentifier: IPassengerIdentifier = { pnr }

        //act
        const action = async () => {
            await contract.cancelBooking(passengerIdentifier);
        };

        //assert
        await expect(action).rejects.toThrow(NotFoundError);
    })

    test("Cancel empty booking id", async () => {
        //arrange
        const pnr: string = ""
        const passengerIdentifier: IPassengerIdentifier = { pnr }

        //act
        const action = async () => {
            await contract.cancelBooking(passengerIdentifier);
        };

        //assert
        await expect(action).rejects.toThrow(InputError);
    })
});
