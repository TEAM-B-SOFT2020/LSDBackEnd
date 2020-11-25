import mongoose from "mongoose";
import Carrier, { ICarrier } from "../schema/Carrier";
import Airport from "../schema/Airport";
import { IPerson } from "../schema/Person";
import { IPassenger } from "../schema/Passenger";
import Leg, { ILeg } from "../schema/Leg";
import Route, { IRoute } from "../schema/Route";
import { IBookingLeg } from "../schema/BookingLeg";
import Booking, { IBooking } from "../schema/Booking";


export async function connect(connectionString: string | undefined) {
  if (!connectionString) throw new Error("Invalid connection string");
  mongoose.connection.on("connected", function () {
    console.log("Mongoose default connection open ");
  });
  mongoose.connection.on("disconnected", function () {
    console.log("Mongoose connection closed ");
  });
  mongoose.connection.on("error", function (err) {
    console.log("Mongoose default connection error: " + err);
  });
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
  const carrier1 = new Carrier({ iata: "SK", name: "Scandinavian Airlines" });
  await carrier1.save();

  const airport1 = new Airport({ iata: "CPH", name: "Copenhagen Airport", timeZone: "Europe/Copenhagen" })
  await airport1.save()

  const airport2 = new Airport({ iata: "LHR", name: "London Heathrow Airport", timeZone: "Europe/London" })
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

  //an epoch ts in that could be: 1606120200000
  const leg1: ILeg = new Leg({
    route: route1,
    week: 48,
    year: 2020
  })
  await leg1.save()

  const person1: IPerson = { firstName: "Per", lastName: "Nielsen" }
  const person2: IPerson = { firstName: "Adam", lastName: "Lassie" }
  const person3: IPerson = { firstName: "Kurt", lastName: "Wonnegut" }
  const person4: IPerson = { firstName: "Step", lastName: "Hansen" }
  const person5: IPerson = { firstName: "Martin", lastName: "Garrix" }
  const person6: IPerson = { firstName: "Poul", lastName: "Herning" }
  const person7: IPerson = { firstName: "Margrethe", lastName: "Pestager" }
  const person8: IPerson = { firstName: "Samuel", lastName: "Hackson" }
  const person9: IPerson = { firstName: "Samuel", lastName: "Hackson" }

  const passenger1: IPassenger = { pnr: "B1BS34", person: person1 }
  const passenger2: IPassenger = { pnr: "X2BS32", person: person2 }
  const passenger3: IPassenger = { pnr: "R3BS45", person: person3 }
  const passenger4: IPassenger = { pnr: "A4BS67", person: person4 }
  const passenger5: IPassenger = { pnr: "H5BS78", person: person5 }
  const passenger6: IPassenger = { pnr: "J6BS67", person: person6 }
  const passenger7: IPassenger = { pnr: "K7BS78", person: person7 }
  const passenger8: IPassenger = { pnr: "L8BS67", person: person8 }
  const passenger9: IPassenger = { pnr: "M9BS78", person: person9 }


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

  const booking: IBooking = new Booking({
    bookingLegs: [bookingLeg1, bookingLeg2, bookingLeg3],
    frequentFlyerID: "A12B34C",
    creditCardNumber: "1234567891234567"
  })

  await booking.save()

}


