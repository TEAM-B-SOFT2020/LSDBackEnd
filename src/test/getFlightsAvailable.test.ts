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

});

beforeEach(async () => {
    await db.drop();
    await db.populate();
})

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

    test("Retrieve flight summary containing unchanged available seat amount", async () => {
        //arrange
        const departureAirport: IAirportIdentifier = { iata: "CPH" }
        const arrivalAirport: IAirportIdentifier = { iata: "LHR" }
        const depart: number = 1606774800000 //a monday

        const expectedAvailableSeats: number = 366

        //act
        const actual: IFlightSummary[] = await contract.getFlightsAvailable(departureAirport, arrivalAirport, depart);

        //assert
        await expect(actual[0].availableSeats).toBe(expectedAvailableSeats)
    })

    test("Get empty result on missing route at weekday", async () => {
        //arrange
        const departureAirport: IAirportIdentifier = { iata: "CPH" }
        const arrivalAirport: IAirportIdentifier = { iata: "LHR" }
        const depart: number = 1606998300000 //not a monday

        const expectedLength: number = 0

        //act
        const actual: IFlightSummary[] = await contract.getFlightsAvailable(departureAirport, arrivalAirport, depart);

        //assert
        await expect(actual.length).toBe(expectedLength)
    })


    test("Get new flight code on new leg creation", async () => {
        //arrange
        const departureAirport: IAirportIdentifier = { iata: "CPH" }
        const arrivalAirport: IAirportIdentifier = { iata: "LHR" }
        const depart: number = 1606774800000 //a monday

        const expectedFlightCode: string = "SK002"

        //act
        const actual: IFlightSummary[] = await contract.getFlightsAvailable(departureAirport, arrivalAirport, depart);

        //assert
        await expect(actual[0].flightCode).toBe(expectedFlightCode)
    })

});

describe("Fail scenarios", () => {
    test("Negative departure time should throw exception", async () => {
        //arrange
        const departureAirport: IAirportIdentifier = { iata: "CPH" }
        const arrivalAirport: IAirportIdentifier = { iata: "LHR" }
        const depart: number = -1

        //act
        const action = async () => {
            await contract.getFlightsAvailable(departureAirport, arrivalAirport, depart);
        };

        //assert
        await expect(action).rejects.toThrow(InputError);
    })

    test("Non-existing departure airport", async () => {
        //arrange
        const departureAirport: IAirportIdentifier = { iata: "XXX" }
        const arrivalAirport: IAirportIdentifier = { iata: "LHR" }
        const depart: number = 1606998300000

        //act
        const action = async () => {
            await contract.getFlightsAvailable(departureAirport, arrivalAirport, depart);
        };

        //assert
        await expect(action).rejects.toThrow(NotFoundError);
    })

    test("Non-existing arrival airport", async () => {
        //arrange
        const departureAirport: IAirportIdentifier = { iata: "CPH" }
        const arrivalAirport: IAirportIdentifier = { iata: "XXX" }
        const depart: number = 1606998300000

        //act
        const action = async () => {
            await contract.getFlightsAvailable(departureAirport, arrivalAirport, depart);
        };

        //assert
        await expect(action).rejects.toThrow(NotFoundError);
    })
});
