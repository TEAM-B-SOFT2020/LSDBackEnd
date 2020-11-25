import IContract from "contract";
import IAirportDetail from "contract/src/DTO/IAirportDetail";
import IBookingDetail from "contract/src/DTO/IBookingDetail";
import ICarrierDetail from "contract/src/DTO/ICarrierDetail";
import IFlightSummary from "contract/src/DTO/IFlightSummary";
import IReservationDetail from "contract/src/DTO/IReservationDetail";
import IReservationSummary from "contract/src/DTO/IReservationSummary";
import { NotFoundError } from "../error";
import IAirportIdentifier from "contract/src/IAirportIdentifier";
import IBookingIdentifier from "contract/src/IBookingIdentifier";
import IFlightIdentifier from "contract/src/IFlightIdentifier";
import Carrier, { ICarrier } from "../schema/Carrier";
import Airport, { IAirport } from "../schema/Airport";
import InputError from "../error/InputError";
import Route, { IRoute } from "../schema/Route";
import Leg, { ILeg } from "../schema/Leg";
import moment, { Moment } from "moment-timezone";
import Booking, { IBooking } from "../schema/Booking";
import IFlightBookingDetail from "contract/src/DTO/IFlightBookingDetail";
import IPassenger from "contract/src/IPassenger";
import IFlightPassenger from "contract/src/DTO/IFlightPassenger";

export default class Contract implements IContract {
  async getCarrierInformation(iata: string): Promise<ICarrierDetail> {
    if (!iata) {
      throw new InputError("Please define a IATA code")
    }

    if (iata.length !== 2) {
      throw new InputError("IATA must be 2 characters long")
    }

    const carrier: ICarrier | null = await Carrier.findOne({ iata });
    if (!carrier) {
      throw new NotFoundError(`Could not find Carrier Information for IATA: ${iata}`);
    }
    const carrierDetail: ICarrierDetail = { iata: carrier.iata, name: carrier.name };
    return carrierDetail;
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
      timeZone
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
            leg
          }
        }
      }).populate("bookingLegs.leg")

      let availableSeats = airportRoute.numberOfSeats

      for (const booking of bookings) {
        let bookingLeg = booking.bookingLegs.find(bookingLeg => bookingLeg.leg._id.toString() === leg?._id.toString())
        availableSeats -= bookingLeg?.passengers.length || 0
      }

      const carrierDetail: ICarrierDetail = {
        iata: carrier.iata,
        name: carrier.name
      }

      const departureAirportDetail: IAirportDetail = {
        iata: departureAirport.iata,
        name: departureAirport.name,
        timeZone: departureAirport.timeZone
      }

      const arrivalAirportDetail: IAirportDetail = {
        iata: arrivalAirport.iata,
        name: arrivalAirport.name,
        timeZone: arrivalAirport.timeZone
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
  reserveFlight(id: IFlightIdentifier, amountSeats: number): Promise<IReservationSummary> {
    throw new Error("Method not implemented.");
  }
  createBooking(reservationDetails: IReservationDetail[], creditCardNumber: number, frequentFlyerNumber?: number): Promise<IBookingDetail> {
    throw new Error("Method not implemented.");
  }
  async getBooking(id: IBookingIdentifier): Promise<IBookingDetail> {
    if (!id) {
      throw new InputError("Please define a booking identifier")
    }

    const booking: IBooking | null = await Booking.findOne({ _id: id.id }).populate("bookingLegs.leg.route")

    if (!booking) {
      throw new NotFoundError(`No booking with id ${id.id} exists`)
    }

    const reducedPrice: number = booking.bookingLegs.reduce((prev, { leg, passengers }) => prev + (passengers.length * leg.route.seatPrice), 0)

    const flightBookings: IFlightBookingDetail[] = booking.bookingLegs.map(({ leg, passengers }) => {

      const flightPassengers: IFlightPassenger[] = passengers.map(({ person: { firstName, lastName }, pnr }) => ({ firstName, lastName, pnr }))

      const { departureAirport, arrivalAirport } = leg.route
      const departureAirportIdentifier: IAirportIdentifier = { iata: departureAirport.iata }
      const arrivalAirportIdentifier: IAirportIdentifier = { iata: arrivalAirport.iata }


      const carrier: ICarrier = leg.route.carrier
      const carrierDetail: ICarrierDetail = { iata: carrier.iata, name: carrier.name }

      const { week, year, route } = leg
      const { weekday, departureSecondInDay, durationInSeconds, } = route

      const baseTime: Moment = moment().tz(departureAirport.timeZone).year(year).week(week).day(weekday).second(departureSecondInDay);
      const departureDate: number = baseTime.toDate().getTime()
      baseTime.add(durationInSeconds, "seconds")
      const arrivalDate: number = baseTime.toDate().getTime()

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

    const bookingDetail: IBookingDetail = {
      creditCardNumber: Number.parseInt(booking.creditCardNumber),
      flightBookings,
      frequentFlyerId: booking.frequentFlyerID,
      id: booking._id,
      price: reducedPrice,

    }

    return bookingDetail
  }
  cancelBooking(id: IBookingIdentifier): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
