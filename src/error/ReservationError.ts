export default class ReservationError extends Error {
    constructor(message: string = "Unable to reserve flight", public status: number = 500) {
      super(message);
      this.name = "ReservationError";
      Object.setPrototypeOf(this, ReservationError.prototype);
    }
  }
  