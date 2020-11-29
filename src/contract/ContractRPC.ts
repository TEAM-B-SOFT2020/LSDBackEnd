// libraries
import * as http from "http";
import { createServer, RPCFunctions } from "@node-rpc/server";
import { jsonDeserializer as deserializer } from "@node-rpc/server/dist/deserializers/jsonDeserializer";

// classes, interfaces & functions
import IContract from "contract";
import Contract from "./Contract";
import IBookingIdentifier from "contract/src/IBookingIdentifier";
import IReservationDetail from "contract/src/DTO/IReservationDetail";
import IFlightIdentifier from "contract/src/IFlightIdentifier";
import IAirportIdentifier from "contract/src/IAirportIdentifier";
import IPassengerIdentifier from "contract/src/IPassengerIdentifier";

// ...
const contract: IContract = new Contract();

const api: RPCFunctions<IContract, { lang: string }> = {
  cancelBooking: (passenger: IPassengerIdentifier) => async () => await contract.cancelBooking(passenger),

  createBooking: (reservationDetails: IReservationDetail[], creditCardNumber: number, frequentFlyerNumber?: string) => async () =>
    await contract.createBooking(reservationDetails, creditCardNumber, frequentFlyerNumber),

  getBooking: (passenger: IPassengerIdentifier) => async () => await contract.getBooking(passenger),
  
  getBookingOnBookingId: (id: IBookingIdentifier) => async () => await contract.getBookingOnBookingId(id),

  getAirportInformation: (iata: string) => async () => await contract.getAirportInformation(iata),

  getCarrierInformation: (iata: string) => async () => await contract.getCarrierInformation(iata),

  reserveFlight: (id: IFlightIdentifier, amountSeats: number) => async () => await contract.reserveFlight(id, amountSeats),

  getFlightsAvailable: (departure: IAirportIdentifier, arrival: IAirportIdentifier, depart: number) => async () =>
    await contract.getFlightsAvailable(departure, arrival, depart),
};

const RPCServer = createServer({ api, deserializer });

async function RPCRequestHandler(req: http.IncomingMessage, res: http.ServerResponse) {
  try {
    const result = await RPCServer.handleAPIRequest(req, { lang: "en" });
    const json: string = String(JSON.stringify(result));
    res.write(json);
  } catch (error: any) {
    console.error(error.message);

    // handle errors
    res.writeHead(error.status || 500);
    res.write(error.message);
  }

  res.end();
}

export default RPCRequestHandler;
