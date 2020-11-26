export default class BookingError extends Error {
    constructor(message: string = "Booking Error", public status: number = 500) {
        super(message);
        this.name = "BookingError";
        Object.setPrototypeOf(this, BookingError.prototype);
    }
}
