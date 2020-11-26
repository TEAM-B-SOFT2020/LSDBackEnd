import Contract from "../contract/Contract";
import dotenv from "dotenv";
import * as db from "../util/dbHandler";
import { InputError, NotFoundError } from "../error";
import IFlightIdentifier from "contract/src/IFlightIdentifier";
import ReservationError from "../error/ReservationError";
import IReservationSummary from "contract/src/DTO/IReservationSummary";

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
    test("Reserve flight with the last available seats", async () => {
        //arrange
        const flightCode: string = "FR002"
        const flightIdentifier: IFlightIdentifier = { flightCode }
        const amountOfSeats: number = 2

        const expectedPrice = 138

        //act
        const reservation: IReservationSummary = await contract.reserveFlight(flightIdentifier, amountOfSeats)

        //assert
        await expect(reservation.id).toBeDefined()
        await expect(reservation.price).toBe(expectedPrice)
    })
});

describe("Fail scenarios", () => {
    test("Non-existing flight identifier", async () => {
        //arrange
        const flightCode: string = "SK101"
        const flightIdentifier: IFlightIdentifier = { flightCode }
        const amountOfSeats: number = 2

        //act
        const action = async () => {
            await contract.reserveFlight(flightIdentifier, amountOfSeats)
        }

        //assert
        await expect(action).rejects.toThrow(NotFoundError)
    })

    test("Bad format of flight code", async () => {
        //arrange
        const flightCode: string = "S01"
        const flightIdentifier: IFlightIdentifier = { flightCode }
        const amountOfSeats: number = 2

        //act
        const action = async () => {
            await contract.reserveFlight(flightIdentifier, amountOfSeats)
        }

        //assert
        await expect(action).rejects.toThrow(InputError)
    })

    test("Negative amount of seats", async () => {
        //arrange
        const flightCode: string = "SK001"
        const flightIdentifier: IFlightIdentifier = { flightCode }
        const amountOfSeats: number = -1

        //act
        const action = async () => {
            await contract.reserveFlight(flightIdentifier, amountOfSeats)
        }

        //assert
        await expect(action).rejects.toThrow(InputError)
    })

    test("Amount of seats is zero", async () => {
        //arrange
        const flightCode: string = "SK001"
        const flightIdentifier: IFlightIdentifier = { flightCode }
        const amountOfSeats: number = 0

        //act
        const action = async () => {
            await contract.reserveFlight(flightIdentifier, amountOfSeats)
        }

        //assert
        await expect(action).rejects.toThrow(InputError)
    })

    test("Amount of seats is over 9", async () => {
        //arrange
        const flightCode: string = "SK001"
        const flightIdentifier: IFlightIdentifier = { flightCode }
        const amountOfSeats: number = 10

        //act
        const action = async () => {
            await contract.reserveFlight(flightIdentifier, amountOfSeats)
        }

        //assert
        await expect(action).rejects.toThrow(InputError)
    })

    test("Not enough available seats on flight", async () => {
        //arrange
        const flightCode: string = "FR002" //only has 2 seats left
        const flightIdentifier: IFlightIdentifier = { flightCode }
        const amountOfSeats: number = 3

        //act
        const action = async () => {
            await contract.reserveFlight(flightIdentifier, amountOfSeats)
        }

        //assert
        await expect(action).rejects.toThrow(ReservationError)
    })

});
