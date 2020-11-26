import mongoose, { MongooseDocument } from "mongoose";
import Carrier, { ICarrier } from "../schema/Carrier";
import Airport, { IAirport } from "../schema/Airport";
import { IPerson } from "../schema/Person";
import { IPassenger } from "../schema/Passenger";
import Leg, { ILeg } from "../schema/Leg";
import Route, { IRoute } from "../schema/Route";
import { IBookingLeg } from "../schema/BookingLeg";
import Booking, { IBooking } from "../schema/Booking";
import Reservation, { IReservation } from "../schema/Reservation";
const shortid = require("short-id")

export async function connect(connectionString: string | undefined, isTestConnection: boolean = false) {
  if (isTestConnection) {
    shortid.configure({
      length: 10
    })

    const connectionStringSplit = connectionString?.split("?")
    if (!connectionStringSplit) {
      throw new Error("Couldn't split connection string")
    }
    connectionString = `${connectionStringSplit[0]}_${shortid.generate()}?${connectionStringSplit[1]}`
  }

  if (!connectionString) throw new Error("Invalid connection string");
  // mongoose.connection.on("connected", function () {
  //   console.log("Mongoose default connection open ");
  // });
  // mongoose.connection.on("disconnected", function () {
  //   console.log("Mongoose connection closed ");
  // });
  mongoose.connection.on("error", function (err) {
    console.log("Mongoose default connection error: " + err);
  });
  mongoose.set('useCreateIndex', true)
  return await mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
}

export async function drop() {
  const collections = await mongoose.connection.db.collections();

  for (const collection of collections) {
    await collection.drop();
  }
}

export async function disconnect() {
  await mongoose.disconnect()
}

export async function populate() {
  const carrier1: ICarrier = new Carrier({ iata: "SK", name: "Scandinavian Airlines" });
  await carrier1.save();

  const carrier2: ICarrier = new Carrier({ iata: "FR", name: "Ryanair" });
  await carrier2.save();

  const airport1: IAirport = new Airport({ iata: "CPH", name: "Copenhagen Airport", timeZone: "Europe/Copenhagen" })
  await airport1.save()

  const airport2: IAirport = new Airport({ iata: "LHR", name: "London Heathrow Airport", timeZone: "Europe/London" })
  await airport2.save()

  const route1: IRoute = new Route({
    carrier: carrier1,

    weekday: 1,
    departureSecondInDay: 28800,
    durationInSeconds: 5400,

    departureAirport: airport1,
    arrivalAirport: airport2,

    numberOfSeats: 366,
    seatPrice: 510
  })
  await route1.save()

  const route2: IRoute = new Route({
    carrier: carrier2,

    weekday: 2,
    departureSecondInDay: 28800,
    durationInSeconds: 5400,

    departureAirport: airport2,
    arrivalAirport: airport1,

    numberOfSeats: 6,
    seatPrice: 69
  })
  await route2.save()

  //an epoch ts in that could be: 1606120200000
  const leg1: ILeg = new Leg({
    route: route1,
    week: 48,
    year: 2020
  })
  await leg1.save()

  const leg2: ILeg = new Leg({
    route: route2,
    week: 49,
    year: 2020
  })
  await leg2.save()

  const person1: IPerson = { firstName: "Per", lastName: "Nielsen" }
  const person2: IPerson = { firstName: "Adam", lastName: "Lassie" }
  const person3: IPerson = { firstName: "Kurt", lastName: "Wonnegut" }
  const person4: IPerson = { firstName: "Step", lastName: "Hansen" }
  const person5: IPerson = { firstName: "Martin", lastName: "Garrix" }
  const person6: IPerson = { firstName: "Poul", lastName: "Herning" }
  const person7: IPerson = { firstName: "Margrethe", lastName: "Pestager" }
  const person8: IPerson = { firstName: "Samuel", lastName: "Hackson" }
  const person9: IPerson = { firstName: "Rasmus", lastName: "Klumpen" }

  const passenger1: IPassenger = { pnr: "B1BS34", person: person1 }
  const passenger2: IPassenger = { pnr: "X2BS32", person: person2 }
  const passenger3: IPassenger = { pnr: "R3BS45", person: person3 }
  const passenger4: IPassenger = { pnr: "A4BS67", person: person4 }
  const passenger5: IPassenger = { pnr: "H5BS78", person: person5 }
  const passenger6: IPassenger = { pnr: "J6BS67", person: person6 }
  const passenger7: IPassenger = { pnr: "K7BS78", person: person7 }
  const passenger8: IPassenger = { pnr: "L8BS67", person: person8 }
  const passenger9: IPassenger = { pnr: "M9BS78", person: person9 }
  const passenger10: IPassenger = { pnr: "K7BS71", person: person7 }
  const passenger11: IPassenger = { pnr: "L8BS61", person: person8 }
  const passenger12: IPassenger = { pnr: "M9BS71", person: person9 }


  const bookingLeg1: IBookingLeg = {
    leg: leg1,
    passengers: [passenger1, passenger2]
  }

  const bookingLeg2: IBookingLeg = {
    leg: leg1,
    passengers: [passenger3, passenger4, passenger5, passenger6]
  }

  const bookingLeg3: IBookingLeg = {
    leg: leg1,
    passengers: [passenger7, passenger8, passenger9]
  }

  const bookingLeg4: IBookingLeg = {
    leg: leg2,
    passengers: [passenger10, passenger11, passenger12]
  }

  const booking1: IBooking = new Booking({
    bookingLegs: [bookingLeg1],
    frequentFlyerID: "A12B34C",
    creditCardNumber: "1234567891234567"
  })
  await booking1.save()

  const booking2: IBooking = new Booking({
    bookingLegs: [bookingLeg2],
    frequentFlyerID: "B12B34C",
    creditCardNumber: "2234567891234567"
  })
  await booking2.save()

  const booking3: IBooking = new Booking({
    bookingLegs: [bookingLeg3],
    frequentFlyerID: "C12B34C",
    creditCardNumber: "3234567891234567"
  })
  await booking3.save()

  const booking4: IBooking = new Booking({
    bookingLegs: [bookingLeg4],
    frequentFlyerID: "C12B34D",
    creditCardNumber: "4234567891234567"
  })

  await booking4.save()

  const bookingIds = [
    String(booking1._id),
    String(booking2._id),
    String(booking3._id),
    String(booking4._id),
  ]

  const reservation1: IReservation = new Reservation({
    leg: leg1,
    amountOfSeats: 3
  })

  await reservation1.save()

  const reservation2: IReservation = new Reservation({
    leg: leg2,
    amountOfSeats: 1
  })

  await reservation2.save()

  const reservationIds = [
    String(reservation1._id),
    String(reservation2._id),
  ]

  return {
    bookingIds,
    reservationIds
  }
}


