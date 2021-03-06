import IContract from "contract"
import IAirportDetail from "contract/src/DTO/IAirportDetail"
import IBookingDetail from "contract/src/DTO/IBookingDetail"
import ICarrierDetail from "contract/src/DTO/ICarrierDetail"
import IFlightSummary from "contract/src/DTO/IFlightSummary"
import IReservationDetail from "contract/src/DTO/IReservationDetail"
import IReservationSummary from "contract/src/DTO/IReservationSummary"
import { NotFoundError } from "../error"
import IAirportIdentifier from "contract/src/IAirportIdentifier"
import IBookingIdentifier from "contract/src/IBookingIdentifier"
import IFlightIdentifier from "contract/src/IFlightIdentifier"
import Carrier, { ICarrier } from "../schema/Carrier"
import Reservation, { IReservation } from "../schema/Reservation"
import Airport, { IAirport } from "../schema/Airport"
import { IBookingLeg } from "../schema/BookingLeg"
import InputError from "../error/InputError"
import Route, { IRoute } from "../schema/Route"
import Leg, { ILeg } from "../schema/Leg"
import moment, { Moment } from "moment-timezone"
import Booking, { IBooking } from "../schema/Booking"
import IFlightBookingDetail from "contract/src/DTO/IFlightBookingDetail"
import { IPassenger } from "../schema/Passenger"
import IFlightPassenger from "contract/src/DTO/IFlightPassenger"
import ReservationError from "../error/ReservationError"
import createPNR from "../util/createPNR"
import IPassengerIdentifier from "contract/src/IPassengerIdentifier"
import { startSession } from "../util/dbHandler"
import BookingError from "../error/BookingError"

export default class Contract implements IContract {
  async getCarrierInformation(iata: string): Promise<ICarrierDetail> {
    if (!iata) {
      throw new InputError("Please define a IATA code")
    }

    if (iata.length !== 2) {
      throw new InputError("IATA must be 2 characters long")
    }

    const carrier: ICarrier | null = await Carrier.findOne({ iata })
    if (!carrier) {
      throw new NotFoundError(`Could not find Carrier Information for IATA: ${iata}`)
    }
    const carrierDetail: ICarrierDetail = { iata: carrier.iata, name: carrier.name }
    return carrierDetail
  }

  async getAirportInformation(iata: string): Promise<IAirportDetail> {
    if (!iata) {
      throw new InputError("Please define a IATA code")
    }

    if (iata.length !== 3) {
      throw new InputError("IATA must be 3 characters long")
    }

    const airport: IAirport | null = await Airport.findOne({ iata })
    if (!airport) {
      throw new NotFoundError(`Could not find Airport Information for IATA: ${iata}`)
    }
    const { name, timeZone } = airport
    const airportDetail: IAirportDetail = {
      iata,
      name,
      timeZone,
    }
    return airportDetail
  }

  async getFlightsAvailable(departure: IAirportIdentifier, arrival: IAirportIdentifier, depart: number): Promise<IFlightSummary[]> {
    if (!departure) {
      throw new InputError("Please define a departure airport")
    }

    if (!arrival) {
      throw new InputError("Please define a arrival airport")
    }

    if (!depart) {
      throw new InputError("Please define a departure time")
    }

    if (depart < 0) {
      throw new InputError("Departure time cannot be negative")
    }

    const departureAirport: IAirport | null = await Airport.findOne({ iata: departure.iata })
    const arrivalAirport: IAirport | null = await Airport.findOne({ iata: arrival.iata })

    if (!departureAirport) {
      throw new NotFoundError("Could not find departure airport")
    }

    const { timeZone } = departureAirport

    if (!arrivalAirport) {
      throw new NotFoundError("Count not find arrival airport")
    }

    const date: Moment = moment(depart).tz(timeZone)
    const weekday: number = date.weekday()
    const week: number = date.week()
    const year: number = date.year()

    const airportRoutes: IRoute[] = await Route.find({ arrivalAirport, departureAirport, weekday }).populate("carrier")

    let flightSummaries: IFlightSummary[] = []

    for (const airportRoute of airportRoutes) {
      const { carrier, seatPrice, departureSecondInDay, durationInSeconds } = airportRoute

      const currentDate: Moment = date.clone().startOf("day")

      currentDate.add(departureSecondInDay, "seconds")
      const departureDate: number = currentDate.toDate().getTime()

      currentDate.add(durationInSeconds, "seconds")
      const arrivalDate: number = currentDate.tz(arrivalAirport.timeZone).toDate().getTime()

      let leg: ILeg | null = await Leg.findOne({ route: airportRoute, week, year })

      if (!leg) {
        leg = new Leg({ route: airportRoute, week, year })
        await leg.save()
      }

      const flightCode: string = `${carrier.iata}${leg.paddedId}`

      const bookings: IBooking[] = await Booking.find({
        bookingLegs: {
          $elemMatch: {
            leg,
          },
        },
      }).populate("bookingLegs.leg")

      let availableSeats = airportRoute.numberOfSeats

      for (const booking of bookings) {
        let bookingLeg = booking.bookingLegs.find((bookingLeg) => bookingLeg.leg._id.toString() === leg?._id.toString())
        availableSeats -= bookingLeg?.passengers.length || 0
      }

      const reservations: IReservation[] = await Reservation.find({ leg })

      for (const { amountOfSeats } of reservations) {
        availableSeats -= amountOfSeats
      }

      const carrierDetail: ICarrierDetail = {
        iata: carrier.iata,
        name: carrier.name,
      }

      const departureAirportDetail: IAirportDetail = {
        iata: departureAirport.iata,
        name: departureAirport.name,
        timeZone: departureAirport.timeZone,
      }

      const arrivalAirportDetail: IAirportDetail = {
        iata: arrivalAirport.iata,
        name: arrivalAirport.name,
        timeZone: arrivalAirport.timeZone,
      }

      const flightSummary: IFlightSummary = {
        carrier: carrierDetail,

        departureDate,
        arrivalDate,

        departureAirport: departureAirportDetail,
        arrivalAirport: arrivalAirportDetail,

        flightCode,

        availableSeats,
        seatPrice,
      }

      if (availableSeats > 0) {
        flightSummaries.push(flightSummary)
      }
    }

    return flightSummaries
  }

  async reserveFlight(id: IFlightIdentifier, amountSeats: number): Promise<IReservationSummary> {
    if (!id) {
      throw new InputError("Please define a flight identifier")
    }

    if (!amountSeats || amountSeats < 1 || amountSeats > 9) {
      throw new InputError("Please define a valid seat amount between 1 and 9")
    }

    if (!/^[A-Z]{2}[0-9]{3}$/.test(id.flightCode)) {
      throw new InputError("Flight code of flight identifier does not match the required format")
    }

    const legId: string = id.flightCode.slice(2)
    const leg: ILeg | null = await Leg.findOne({ id: legId }).populate("route").exec()

    if (!leg) {
      throw new NotFoundError("Could not find flight")
    }

    const bookings: IBooking[] = await Booking.find({
      bookingLegs: {
        $elemMatch: {
          leg,
        },
      },
    }).populate("bookingLegs.leg")

    let availableSeats = leg.route.numberOfSeats

    for (const booking of bookings) {
      let bookingLeg = await booking.bookingLegs.find((bookingLeg) => bookingLeg.leg._id.toString() === leg?._id.toString())
      availableSeats -= bookingLeg?.passengers.length || 0
    }

    const reservations: IReservation[] = await Reservation.find({ leg })

    for (const { amountOfSeats } of reservations) {
      availableSeats -= amountOfSeats
    }

    if (availableSeats - amountSeats < 0) {
      throw new ReservationError("There isn't enough seats for this reservation")
    }

    const reservation: IReservation = new Reservation({
      leg,
      amountOfSeats: amountSeats,
    })

    await reservation.save()

    const price: number = leg.route.seatPrice * amountSeats
    const reservationSummary: IReservationSummary = { id: String(reservation._id), price }
    return reservationSummary
  }

  async createBooking(reservationDetails: IReservationDetail[], creditCardNumber: number, frequentFlyerNumber?: string): Promise<IBookingDetail> {
    if (!reservationDetails || reservationDetails.length === 0) {
      throw new InputError("Please define valid reservations")
    }

    if (!creditCardNumber) {
      throw new InputError("Please define valid credit card")
    }

    if (frequentFlyerNumber && frequentFlyerNumber.length !== 7) {
      throw new InputError("Wrong length of given frequent flyer number")
    }

    if (creditCardNumber.toString().length !== 16) {
      throw new InputError("Please define a credit card number with a valid length of 16")
    }

    let booking: IBooking | null = null

    const session = await startSession()

    try {
      session.startTransaction()

      const bookingLegs: IBookingLeg[] = []

      for (const reservationDetail of reservationDetails) {
        const id: string = reservationDetail.id

        try {
          var reservation: IReservation | null = await Reservation.findOne({ _id: id }).populate("leg").exec()
        } catch (e) {
          throw new NotFoundError("Could not find reservation")
        }

        if (reservationDetail.passengers.length !== reservation?.amountOfSeats) {
          throw new BookingError(`The length of a passenger list does not match the respective reserved amount of seats`)
        }

        await reservation?.leg.populate("route").execPopulate()
        await reservation?.leg.route.populate("carrier").execPopulate()
        await reservation?.leg.route.populate("departureAirport").execPopulate()
        await reservation?.leg.route.populate("arrivalAirport").execPopulate()

        if (reservation) {
          const leg: ILeg = reservation.leg

          const pnr = createPNR()

          const passengers: IPassenger[] = reservationDetail.passengers.map((passenger) => ({ person: passenger, pnr }))

          const bookingLeg: IBookingLeg = { leg, passengers }
          bookingLegs.push(bookingLeg)
          await reservation.deleteOne()
        } else {
          throw new NotFoundError("Could not find the reservation")
        }
      }

      booking = new Booking({ bookingLegs, creditCardNumber, frequentFlyerID: frequentFlyerNumber || null })

      await booking.save()
      await session.commitTransaction()
    } catch (e) {
      await session.abortTransaction()
      throw e
    }

    const flightBookings: IFlightBookingDetail[] = convertLegsToFlights(booking.bookingLegs)

    const price: number = calculateBookingPrice(booking)

    const bookingDetail: IBookingDetail = {
      id: booking._id,
      frequentFlyerId: frequentFlyerNumber || "",
      creditCardNumber,
      price,
      flightBookings,
    }

    return bookingDetail
  }

  async getBookingOnBookingId(id: IBookingIdentifier): Promise<IBookingDetail> {
    if (!id) {
      throw new InputError("Please define a booking identifier")
    }

    if (!id.id) {
      throw new InputError("Please define id in your booking identifier")
    }
    let booking: IBooking | null = null

    try {
      booking = await Booking.findOne({ _id: id.id })
    } catch (e) {}

    return await processBooking(booking)
  }

  async getBooking(passenger: IPassengerIdentifier): Promise<IBookingDetail> {
    const booking: IBooking | null = await findBooking(passenger)

    return await processBooking(booking)
  }

  async cancelBooking(passenger: IPassengerIdentifier): Promise<void> {
    const booking: IBooking | null = await findBooking(passenger)
    if (!booking) {
      throw new NotFoundError("Could not find booking")
    }
    await booking.deleteOne()
  }
}

function convertLegsToFlights(bookingLegs: IBookingLeg[]): IFlightBookingDetail[] {
  return bookingLegs.map(({ leg, passengers }) => {
    const flightPassengers: IFlightPassenger[] = passengers.map(({ person: { firstName, lastName }, pnr }) => {
      if (!pnr) {
        throw new Error("PNR is not defined")
      }

      return { firstName, lastName, pnr }
    })

    const { departureAirport, arrivalAirport } = leg.route
    const departureAirportIdentifier: IAirportIdentifier = { iata: departureAirport.iata }
    const arrivalAirportIdentifier: IAirportIdentifier = { iata: arrivalAirport.iata }

    const carrier: ICarrier = leg.route.carrier
    const carrierDetail: ICarrierDetail = { iata: carrier.iata, name: carrier.name }

    const { week, year, route } = leg
    const { weekday, departureSecondInDay, durationInSeconds } = route

    let baseTime: Moment = moment.tz(departureAirport.timeZone).year(year).week(week).day(weekday).startOf("day").add(departureSecondInDay, "seconds")
    const departureDate: number = baseTime.valueOf()
    baseTime.add(durationInSeconds, "seconds")
    const arrivalDate: number = baseTime.valueOf()

    const flightCode: string = `${carrier.iata}${leg.paddedId}`

    return {
      passengers: flightPassengers,
      departureAirport: departureAirportIdentifier,
      arrivalAirport: arrivalAirportIdentifier,
      carrier: carrierDetail,
      departureDate,
      arrivalDate,
      flightCode,
    }
  })
}

function calculateBookingPrice(booking: IBooking): number {
  return booking.bookingLegs.reduce((prev, { leg, passengers }) => prev + passengers.length * leg.route.seatPrice, 0)
}

async function findBooking(passenger: IPassengerIdentifier): Promise<IBooking | null> {
  if (!passenger) {
    throw new InputError("Please define a passenger identifier")
  }

  if (!passenger.pnr) {
    throw new InputError("Please define a pnr as a passenger identifier")
  }

  let booking: IBooking | null = null

  try {
    booking = await Booking.findOne({
      bookingLegs: {
        $elemMatch: {
          passengers: {
            $elemMatch: {
              pnr: passenger.pnr,
            },
          },
        },
      },
    })
  } catch (e) {}
  return booking
}

async function processBooking(booking: IBooking | null): Promise<IBookingDetail> {
  if (booking) {
    await booking.populate("bookingLegs.leg").execPopulate()
    await Promise.all(booking.bookingLegs.map((bookingLeg) => bookingLeg.leg.populate("route").execPopulate()))
    await Promise.all(booking.bookingLegs.map((bookingLeg) => bookingLeg.leg.route.populate("carrier").execPopulate()))
    await Promise.all(booking.bookingLegs.map((bookingLeg) => bookingLeg.leg.route.populate("arrivalAirport").execPopulate()))
    await Promise.all(booking.bookingLegs.map((bookingLeg) => bookingLeg.leg.route.populate("departureAirport").execPopulate()))
  } else {
    throw new NotFoundError(`Booking not found`)
  }

  const reducedPrice: number = calculateBookingPrice(booking)

  const flightBookings: IFlightBookingDetail[] = convertLegsToFlights(booking.bookingLegs)

  const bookingDetail: IBookingDetail = {
    creditCardNumber: Number.parseInt(booking.creditCardNumber),
    flightBookings,
    frequentFlyerId: booking.frequentFlyerID,
    id: String(booking._id),
    price: reducedPrice,
  }

  return bookingDetail
}
