export default class NotFoundError extends Error {
  constructor(message: string = "Not Found Error", public status: number = 404) {
    super(message);
    this.name = "NotFoundError";
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}
