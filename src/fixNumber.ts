/**
 *  This function fixes oddties with JS numbers, mainly with floating point precision.
 *  I made the function cause I didn't want to switch to decimal representations and
 *  keep the library small. So, I found an answer on StackOverflow with this nifty
 *  workaround: https://stackoverflow.com/a/3644302
 * 
 *  This function should be used whenever we return a probablity from a process. It
 *  will shave the last digits (assuming 64-bit system) and return a probability
 *  that makes sense. Of course, some precision is lost, but it's better than having
 *  to deal with all edge cases outside the library.
 */
export function fixNumber(value: number) : number {
    return Number(value.toPrecision(15));
}