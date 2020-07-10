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
