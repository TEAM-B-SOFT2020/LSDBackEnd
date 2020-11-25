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

  getFlightsAvailable(departure: IAirportIdentifier, arrival: IAirportIdentifier, depart: number): Promise<IFlightSummary[]> {
    throw new Error("Method not implemented.");
  }
  reserveFlight(id: IFlightIdentifier, amountSeats: number): Promise<IReservationSummary> {
    throw new Error("Method not implemented.");
  }
  createBooking(reservationDetails: IReservationDetail[], creditCardNumber: number, frequentFlyerNumber?: number): Promise<IBookingDetail> {
    throw new Error("Method not implemented.");
  }
  getBooking(id: IBookingIdentifier): Promise<IBookingDetail> {
    throw new Error("Method not implemented.");
  }
  cancelBooking(id: IBookingIdentifier): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
