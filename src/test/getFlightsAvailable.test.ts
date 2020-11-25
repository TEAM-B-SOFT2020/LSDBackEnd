import ICarrierDetail from "contract/src/DTO/ICarrierDetail";
import Contract from "../contract/Contract";
import { InputError, NotFoundError } from "../error";
import dotenv from "dotenv";
import * as db from "../util/dbHandler";
import { IAirport } from "../schema/Airport";
import IAirportIdentifier from "contract/src/IAirportIdentifier";
import IFlightBookingDetail from "contract/src/DTO/IFlightBookingDetail";
import IFlightIdentifier from "contract/src/IFlightIdentifier";
import IFlightSummary from "contract/src/DTO/IFlightSummary";

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
    test("Retrieve valid flight summary", async () => {
        //arrange
        const departureAirport: IAirportIdentifier = { iata: "CPH" }
        const arrivalAirport: IAirportIdentifier = { iata: "LHR" }
        const depart: number = 1606120200000

        const expectedCarrierIATA: string = "SK"
        const expectedDepartureDate: number = 1606114800000
        const expectedArrivalDate: number = 1606120200000
        const expectedFlightCode: string = "SK001"
        const expectedAvailableSeats: number = 357
        const expectedSeatPrice: number = 510

        //act
        const actual: IFlightSummary[] = await contract.getFlightsAvailable(departureAirport, arrivalAirport, depart);
        // console.log('actual', actual)

        //assert
        await expect(actual[0].departureAirport.iata).toBe(departureAirport.iata)
        await expect(actual[0].arrivalAirport.iata).toBe(arrivalAirport.iata)

        await expect(actual[0].carrier.iata).toBe(expectedCarrierIATA)
        await expect(actual[0].departureDate).toBe(expectedDepartureDate)
        await expect(actual[0].arrivalDate).toBe(expectedArrivalDate)
        await expect(actual[0].flightCode).toBe(expectedFlightCode)
        await expect(actual[0].availableSeats).toBe(expectedAvailableSeats)
        await expect(actual[0].seatPrice).toBe(expectedSeatPrice)

    })

});

describe("Fail scenarios", () => {

});
