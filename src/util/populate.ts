import * as dbHandler from "./dbHandler"
import dotenv from "dotenv"
import Carrier, { ICarrier } from "../schema/Carrier"
import Airport, { IAirport } from "../schema/Airport"
import Route, { IRoute } from "../schema/Route"
import Leg, { ILeg } from "../schema/Leg"
import { IPerson } from "../schema/Person"
import { IPassenger } from "../schema/Passenger"
import { IBookingLeg } from "../schema/BookingLeg"
import Booking, { IBooking } from "../schema/Booking"
dotenv.config()

async function populate(): Promise<void> {
  const connectionString: string | undefined = process.env.CONNECTION_STRING

  if (!connectionString) {
    throw new Error("Cant find the connection string, did you add it to your .env file?")
  }

  await dbHandler.connect(connectionString)

  /** Carriers */
  const carrier1: ICarrier = await new Carrier({ iata: "SK", name: "Scandinavian Airlines" }).save()
  const carrier2: ICarrier = await new Carrier({ iata: "FR", name: "Ryanair" }).save()
  const carrier3: ICarrier = await new Carrier({ iata: "AS", name: "Alaske Airlines" }).save()
  const carrier4: ICarrier = await new Carrier({ iata: "AA", name: "American Airlines" }).save()
  const carrier5: ICarrier = await new Carrier({ iata: "DA", name: "Delta Airlines" }).save()
  const carrier6: ICarrier = await new Carrier({ iata: "HA", name: "Hawaii Airlines" }).save()
  const carrier7: ICarrier = await new Carrier({ iata: "WN", name: "Southwest Airlines" }).save()
  const carrier8: ICarrier = await new Carrier({ iata: "NK", name: "Spirit Airlines" }).save()
  const carrier9: ICarrier = await new Carrier({ iata: "UA", name: "United Airlines" }).save()
  const carrier10: ICarrier = await new Carrier({ iata: "FX", name: "FedEx Express" }).save()

  /** Airports */
  const airport1: IAirport = await new Airport({ iata: "CPH", name: "Copenhagen Airport", timeZone: "Europe/Copenhagen" }).save()
  const airport2: IAirport = await new Airport({ iata: "LHR", name: "London Heathrow Airport", timeZone: "Europe/London" }).save()
  const airport3: IAirport = await new Airport({ iata: "AAL", name: "Aalborg Airport", timeZone: "Europe/London" }).save()
  const airport4: IAirport = await new Airport({ iata: "AAR", name: "Aarhus Airport", timeZone: "Europe/London" }).save()
  const airport5: IAirport = await new Airport({ iata: "BLL", name: "Billund Airport", timeZone: "Europe/London" }).save()
  const airport6: IAirport = await new Airport({ iata: "RNN", name: "Bornholm Airport", timeZone: "Europe/London" }).save()
  const airport7: IAirport = await new Airport({ iata: "RKE", name: "Roskilde Airport", timeZone: "Europe/London" }).save()
  const airport8: IAirport = await new Airport({ iata: "EBJ", name: "Esbjerg Airport", timeZone: "Europe/London" }).save()
  const airport9: IAirport = await new Airport({ iata: "KRP", name: "Karup Airport", timeZone: "Europe/London" }).save()
  const airport10: IAirport = await new Airport({ iata: "BYR", name: "Læsø Airport", timeZone: "Europe/London" }).save()

  /** Routes */
  const route1: IRoute = await new Route({
    carrier: carrier1,
    weekday: 1,
    departureSecondInDay: 28800,
    durationInSeconds: 5400,
    departureAirport: airport1,
    arrivalAirport: airport2,
    numberOfSeats: 366,
    seatPrice: 510,
  }).save()

  const route2: IRoute = await new Route({
    carrier: carrier2,
    weekday: 2,
    departureSecondInDay: 28700,
    durationInSeconds: 5900,
    departureAirport: airport3,
    arrivalAirport: airport4,
    numberOfSeats: 6,
    seatPrice: 1000,
  }).save()

  const route3: IRoute = await new Route({
    carrier: carrier3,
    weekday: 1,
    departureSecondInDay: 14400,
    durationInSeconds: 5400,
    departureAirport: airport5,
    arrivalAirport: airport6,
    numberOfSeats: 500,
    seatPrice: 69,
  }).save()

  const route4: IRoute = await new Route({
    carrier: carrier4,
    weekday: 4,
    departureSecondInDay: 20700,
    durationInSeconds: 4800,
    departureAirport: airport7,
    arrivalAirport: airport8,
    numberOfSeats: 6,
    seatPrice: 69,
  }).save()

  const route5: IRoute = await new Route({
    carrier: carrier5,
    weekday: 2,
    departureSecondInDay: 28340,
    durationInSeconds: 8900,
    departureAirport: airport6,
    arrivalAirport: airport2,
    numberOfSeats: 299,
    seatPrice: 149,
  }).save()

  const route6: IRoute = await new Route({
    carrier: carrier6,
    weekday: 5,
    departureSecondInDay: 57600,
    durationInSeconds: 21600,
    departureAirport: airport10,
    arrivalAirport: airport1,
    numberOfSeats: 245,
    seatPrice: 456,
  }).save()

  const route7: IRoute = await new Route({
    carrier: carrier7,
    weekday: 3,
    departureSecondInDay: 28390,
    durationInSeconds: 10990,
    departureAirport: airport6,
    arrivalAirport: airport9,
    numberOfSeats: 300,
    seatPrice: 1000,
  }).save()

  const route8: IRoute = await new Route({
    carrier: carrier10,
    weekday: 5,
    departureSecondInDay: 35700,
    durationInSeconds: 1500,
    departureAirport: airport5,
    arrivalAirport: airport7,
    numberOfSeats: 150,
    seatPrice: 899,
  }).save()

  /** Legs Week 48*/
  const leg1: ILeg = await new Leg({ route: route1, week: 48, year: 2020 }).save()
  const leg2: ILeg = await new Leg({ route: route2, week: 48, year: 2020 }).save()
  const leg3: ILeg = await new Leg({ route: route3, week: 48, year: 2020 }).save()
  const leg4: ILeg = await new Leg({ route: route4, week: 48, year: 2020 }).save()
  const leg5: ILeg = await new Leg({ route: route5, week: 48, year: 2020 }).save()
  const leg6: ILeg = await new Leg({ route: route6, week: 48, year: 2020 }).save()
  const leg7: ILeg = await new Leg({ route: route7, week: 48, year: 2020 }).save()
  const leg8: ILeg = await new Leg({ route: route8, week: 48, year: 2020 }).save()

  /** Legs Week 49*/
  const leg9: ILeg = await new Leg({ route: route1, week: 49, year: 2020 }).save()
  const leg10: ILeg = await new Leg({ route: route2, week: 49, year: 2020 }).save()
  const leg11: ILeg = await new Leg({ route: route3, week: 49, year: 2020 }).save()
  const leg12: ILeg = await new Leg({ route: route4, week: 49, year: 2020 }).save()
  const leg14: ILeg = await new Leg({ route: route5, week: 49, year: 2020 }).save()
  const leg15: ILeg = await new Leg({ route: route6, week: 49, year: 2020 }).save()
  const leg16: ILeg = await new Leg({ route: route7, week: 49, year: 2020 }).save()
  const leg17: ILeg = await new Leg({ route: route8, week: 49, year: 2020 }).save()

  /** Legs Week 50*/
  const leg18: ILeg = await new Leg({ route: route1, week: 50, year: 2020 }).save()
  const leg19: ILeg = await new Leg({ route: route2, week: 50, year: 2020 }).save()
  const leg20: ILeg = await new Leg({ route: route3, week: 50, year: 2020 }).save()
  const leg21: ILeg = await new Leg({ route: route4, week: 50, year: 2020 }).save()
  const leg22: ILeg = await new Leg({ route: route5, week: 50, year: 2020 }).save()
  const leg23: ILeg = await new Leg({ route: route6, week: 50, year: 2020 }).save()
  const leg24: ILeg = await new Leg({ route: route7, week: 50, year: 2020 }).save()
  const leg25: ILeg = await new Leg({ route: route8, week: 50, year: 2020 }).save()

  /** Legs Week 51*/
  const leg26: ILeg = await new Leg({ route: route1, week: 51, year: 2020 }).save()
  const leg27: ILeg = await new Leg({ route: route2, week: 51, year: 2020 }).save()
  const leg28: ILeg = await new Leg({ route: route3, week: 51, year: 2020 }).save()
  const leg29: ILeg = await new Leg({ route: route4, week: 51, year: 2020 }).save()
  const leg30: ILeg = await new Leg({ route: route5, week: 51, year: 2020 }).save()
  const leg31: ILeg = await new Leg({ route: route6, week: 51, year: 2020 }).save()
  const leg32: ILeg = await new Leg({ route: route7, week: 51, year: 2020 }).save()
  const leg33: ILeg = await new Leg({ route: route8, week: 51, year: 2020 }).save()

  /** Persons */
  const person1: IPerson = { firstName: "Per", lastName: "Nielsen" }
  const person2: IPerson = { firstName: "Adam", lastName: "Lassie" }
  const person3: IPerson = { firstName: "Kurt", lastName: "Wonnegut" }
  const person4: IPerson = { firstName: "Step", lastName: "Hansen" }
  const person5: IPerson = { firstName: "Martin", lastName: "Garrix" }
  const person6: IPerson = { firstName: "Poul", lastName: "Herning" }
  const person7: IPerson = { firstName: "Margrethe", lastName: "Pestager" }
  const person8: IPerson = { firstName: "Samuel", lastName: "Hackson" }
  const person9: IPerson = { firstName: "Rasmus", lastName: "Klumpen" }
  const person10: IPerson = { firstName: "Per", lastName: "Nielsen" }
  const person11: IPerson = { firstName: "Hans", lastName: "Nielsen" }
  const person12: IPerson = { firstName: "Nikolaj", lastName: "Nielsen" }
  const person13: IPerson = { firstName: "Stephan", lastName: "Nielsen" }
  const person14: IPerson = { firstName: "Ane", lastName: "Nielsen" }
  const person15: IPerson = { firstName: "Hanne", lastName: "Hansen" }
  const person16: IPerson = { firstName: "Margrethe", lastName: "Olsen" }
  const person17: IPerson = { firstName: "Hannah", lastName: "Johnson" }
  const person18: IPerson = { firstName: "Johanne", lastName: "Olesen" }
  const person19: IPerson = { firstName: "Anni", lastName: "Bæk" }
  const person20: IPerson = { firstName: "Dorthe", lastName: "Hansen" }

  /** Passengers */
  const passenger1: IPassenger = { pnr: "B1BS34", person: person1 }
  const passenger2: IPassenger = { pnr: "X2BS32", person: person2 }
  const passenger3: IPassenger = { pnr: "R3BS45", person: person3 }
  const passenger4: IPassenger = { pnr: "A4BS63", person: person4 }
  const passenger5: IPassenger = { pnr: "H5BS72", person: person5 }
  const passenger6: IPassenger = { pnr: "J6BS64", person: person6 }
  const passenger7: IPassenger = { pnr: "K7BS76", person: person7 }
  const passenger8: IPassenger = { pnr: "L8BS65", person: person8 }
  const passenger9: IPassenger = { pnr: "M9BS83", person: person9 }
  const passenger10: IPassenger = { pnr: "K7BS27", person: person10 }
  const passenger11: IPassenger = { pnr: "L8BS11", person: person11 }
  const passenger12: IPassenger = { pnr: "M9FS52", person: person12 }
  const passenger13: IPassenger = { pnr: "N9HS81", person: person13 }
  const passenger14: IPassenger = { pnr: "O9JS99", person: person14 }
  const passenger15: IPassenger = { pnr: "S9SS11", person: person15 }
  const passenger16: IPassenger = { pnr: "J9LS42", person: person16 }
  const passenger17: IPassenger = { pnr: "A9WS71", person: person17 }
  const passenger18: IPassenger = { pnr: "B9LS76", person: person18 }
  const passenger19: IPassenger = { pnr: "R9YS63", person: person19 }
  const passenger20: IPassenger = { pnr: "K9OS71", person: person20 }

  /** Booking Legs */
  const bookingLeg1: IBookingLeg = { leg: leg1, passengers: [passenger1, passenger2] }
  const bookingLeg2: IBookingLeg = { leg: leg1, passengers: [passenger3, passenger4, passenger5, passenger6] }
  const bookingLeg3: IBookingLeg = { leg: leg1, passengers: [passenger7, passenger8, passenger9] }
  const bookingLeg4: IBookingLeg = { leg: leg2, passengers: [passenger10, passenger11, passenger12, passenger13] }
  const bookingLeg5: IBookingLeg = { leg: leg2, passengers: [passenger14, passenger15] }
  const bookingLeg6: IBookingLeg = { leg: leg3, passengers: [passenger16, passenger17, passenger18] }
  const bookingLeg7: IBookingLeg = { leg: leg3, passengers: [passenger19, passenger20] }

  /** Bookings */
  const booking1: IBooking = await new Booking({ bookingLegs: [bookingLeg1], frequentFlyerID: "A12B34C", creditCardNumber: "1234567891234567" }).save()
  const booking2: IBooking = await new Booking({ bookingLegs: [bookingLeg2], frequentFlyerID: "B12B34C", creditCardNumber: "2234567891234567" }).save()
  const booking3: IBooking = await new Booking({ bookingLegs: [bookingLeg3], frequentFlyerID: "C12B34C", creditCardNumber: "3234567891234567" }).save()
  const booking4: IBooking = await new Booking({ bookingLegs: [bookingLeg4], frequentFlyerID: "D13B35D", creditCardNumber: "4234467895234567" }).save()
  const booking5: IBooking = await new Booking({
    bookingLegs: [bookingLeg5, bookingLeg6],
    frequentFlyerID: "E12D34D",
    creditCardNumber: "4231267789123457",
  }).save()
  const booking6: IBooking = await new Booking({ bookingLegs: [bookingLeg7], frequentFlyerID: "F16U34E", creditCardNumber: "2234867892234667" }).save()

  await dbHandler.disconnect()
}

populate()
