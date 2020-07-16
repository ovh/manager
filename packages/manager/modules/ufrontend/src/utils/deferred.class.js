/**
 * Deferred object, implementing behavior similar to promises.
 * examples:
 *
 * // without initial value
 * const foo = Deferred();
 * foo.isPending(); // true
 * foo.resolve('bar');
 * foo.isPending(); // false
 * foo.promise.then(x => ...) // x = 'bar'
 *
 * // with initial value
 * const hello = Deferred('value');
 * hello.isPending(); // true
 * hello.resolve();
 * hello.promise.then(x => ...) // x = 'value'
 */
export default function Deferred(result) {
  const defer = {};
  let isPending = true;
  defer.promise = new Promise(function resolver(resolve, reject) {
    defer.resolve = (...args) => {
      isPending = false;
      if (result) {
        resolve(result);
      } else {
        resolve(...args);
      }
      return defer.promise;
    };
    defer.reject = (...args) => {
      isPending = false;
      reject.apply(...args);
      return defer.promise;
    };
    defer.isPending = () => isPending;
  });
  return defer;
}
