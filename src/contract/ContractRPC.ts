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

// ...
const contract: IContract = new Contract();

const api: RPCFunctions<IContract, { lang: string }> = {
  cancelBooking: (id: IBookingIdentifier) => async () => await contract.cancelBooking(id),

  createBooking: (reservationDetails: IReservationDetail[], creditCardNumber: number, frequentFlyerNumber?: number) => async () =>
    await contract.createBooking(reservationDetails, creditCardNumber, frequentFlyerNumber),

  getBooking: (id: IBookingIdentifier) => async () => await contract.getBooking(id),

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
    res.writeHead(500);
    res.write(error.message);

    /** ETO Structure
     *
     * https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
     * res.writeHead(500);
     *
     * 400 - Bad Request: InvalidInputError
     * 404 - Not Found: NotFoundError
     * 4xx - TBD : InconsistentLengthError
     */
  }

  res.end();
}

export default RPCRequestHandler;
