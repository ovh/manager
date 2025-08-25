export type Result<T, E = string> =
  | { success: true; data: T }
  | { success: false; error: E };

export const createSuccess = <T>(data: T): Result<T, never> => ({
  success: true,
  data,
});
export const createError = <E>(error: E): Result<never, E> => ({
  success: false,
  error,
});
export const isSuccess = <T, E>(
  result: Result<T, E>,
): result is { success: true; data: T } => result.success === true;
export const isError = <T, E>(
  result: Result<T, E>,
): result is { success: false; error: E } => result.success === false;
