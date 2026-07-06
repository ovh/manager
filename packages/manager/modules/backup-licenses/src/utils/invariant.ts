/**
 * Assert that a condition is true. If not, throw an error.
 *
 * @param condition The condition to check
 * @param message The error message to throw if the condition is false
 */
export function invariant(condition: unknown, message: string): asserts condition is true {
  if (condition) {
    return;
  }
  throw new Error(message);
}
