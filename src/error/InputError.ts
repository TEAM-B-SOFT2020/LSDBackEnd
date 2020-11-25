export default class InputError extends Error {
    constructor(message: string = "Input Error", public status: number = 422) {
        super(message);
        this.name = "InputError";
        Object.setPrototypeOf(this, InputError.prototype);
    }
}
