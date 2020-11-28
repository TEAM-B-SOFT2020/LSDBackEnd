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
    test("Get expected booking in database", async () => {
        //arrange
        const pnr: string = "B1BS34"
        const passengerIdentifier: IPassengerIdentifier = { pnr }

        const expectedDepartureDate: number = 1606114800000
        const expectedArrivalDate: number = 1606120200000
        const expectedNumberOfFlightBookings: number = 1
        const expectedFlightCode: string = "SK001"
        const expectedCarrierIATA: string = "SK"
        const expectedCarrierName: string = "Scandinavian Airlines"
        const expectedNumberOfPassengers: number = 2
        const expectedDepartureAirportIATA: string = "CPH"
        const expectedArrivalAirportIATA: string = "LHR"

        const expectedCreditCardNumber: number = 1234567891234567
        const expectedFrequentFlyerId: string = "A12B34C"
        const expectedPrice: number = 1020
        const expectedBookingId: string = populatedValues.bookingIds[0]

        //act
        const bookingDetail: IBookingDetail = await contract.getBooking(passengerIdentifier)

        //assert
        await expect(bookingDetail.flightBookings.length).toBe(expectedNumberOfFlightBookings)
        await expect(bookingDetail.flightBookings[0].departureDate).toBe(expectedDepartureDate)
        await expect(bookingDetail.flightBookings[0].arrivalDate).toBe(expectedArrivalDate)
        await expect(bookingDetail.flightBookings[0].flightCode).toBe(expectedFlightCode)
        await expect(bookingDetail.flightBookings[0].carrier.iata).toBe(expectedCarrierIATA)
        await expect(bookingDetail.flightBookings[0].carrier.name).toBe(expectedCarrierName)
        await expect(bookingDetail.flightBookings[0].passengers.length).toBe(expectedNumberOfPassengers)
        await expect(bookingDetail.flightBookings[0].departureAirport.iata).toBe(expectedDepartureAirportIATA)
        await expect(bookingDetail.flightBookings[0].arrivalAirport.iata).toBe(expectedArrivalAirportIATA)

        await expect(bookingDetail.creditCardNumber).toBe(expectedCreditCardNumber)
        await expect(bookingDetail.frequentFlyerId).toBe(expectedFrequentFlyerId)
        await expect(bookingDetail.id.toString()).toBe(expectedBookingId)
        await expect(bookingDetail.price).toBe(expectedPrice)

    })
});

describe("Fail scenarios", () => {
    test("Get non-existing booking", async () => {
        //arrange
        const pnr: string = "ACBS34"
        const passengerIdentifier: IPassengerIdentifier = { pnr }

        //act
        const action = async () => {
            await contract.getBooking(passengerIdentifier);
        };

        //assert
        await expect(action).rejects.toThrow(NotFoundError);
    })

    test("Get empty booking id", async () => {
        //arrange
        const pnr: string = ""
        const passengerIdentifier: IPassengerIdentifier = { pnr }

        //act
        const action = async () => {
            await contract.getBooking(passengerIdentifier);
        };

        //assert
        await expect(action).rejects.toThrow(InputError);
    })
});
