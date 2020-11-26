import { customAlphabet } from 'nanoid'

const alphabet: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const numbers: string = "1234567890"
const first = customAlphabet(alphabet, 1)
const second = customAlphabet(alphabet + numbers, 5)


export default function () {
    return first() + second()
}
