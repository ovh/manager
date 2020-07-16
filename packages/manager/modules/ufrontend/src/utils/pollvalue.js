/**
 * Returns a Promise resolved when the value returned by getValue() is set (not falsy).
 * A timeout (in sec.) can be provided in which case the returning promise might be
 * rejected if the value is not set during the given time.
 */
export default function pollValue({
  getValue,
  timeout,
  checkInterval = 100,
  timeoutError = new Error('pollValue timeout'),
}) {
  const startTime = new Date().getTime();
  return new Promise((resolve, reject) => {
    const watchAgain = () => {
      const elapsedTime = new Date().getTime() - startTime;
      if (timeout > 0 && elapsedTime > timeout * 1000) {
        reject(timeoutError);
      } else {
        try {
          const value = getValue();
          if (value) {
            resolve(value);
          } else {
            setTimeout(watchAgain, checkInterval);
          }
        } catch (err) {
          reject(err);
        }
      }
    };
    watchAgain();
  });
}
