import angular from 'angular';

const moduleName = 'ngQAllSettled';

angular
  .module(moduleName, [])
  .config(/* @ngInject */($provide) => {
    $provide.decorator('$q', /* @ngInject */ ($delegate) => {
      const $q = $delegate;

      // Extention for q
      $q.allSettled = $q.allSettled || ((promises) => {
        const deferred = $q.defer();
        if (angular.isArray(promises)) {
          const states = [];
          const results = [];
          let didAPromiseFail = false;

          if (promises.length === 0) {
            deferred.resolve([]);
          }

          // First create an array for all promises setting their state to false (not completed)
          angular.forEach(promises, (promise, key) => {
            states[key] = false;
          });

          // Helper to check if all states are finished
          const checkStates = (stateList, result, toDefer, failed) => {
            let allFinished = true;
            angular.forEach(stateList, (state) => {
              if (!state) {
                allFinished = false;
              }
            });
            if (allFinished) {
              if (failed) {
                toDefer.reject(result);
              } else {
                toDefer.resolve(result);
              }
            }
          };

          // Loop through the promises
          // a second loop to be sure that checkStates is called
          // when all states are set to false first
          angular.forEach(promises, (promise, key) => {
            $q.when(promise)
              .then((result) => {
                states[key] = true;
                results[key] = result;
                checkStates(states, results, deferred, didAPromiseFail);
              }, (reason) => {
                states[key] = true;
                results[key] = reason;
                didAPromiseFail = true;
                checkStates(states, results, deferred, didAPromiseFail);
              });
          });
        } else {
          throw new Error('allSettled can only handle an array of promises (for now)');
        }

        return deferred.promise;
      });

      return $q;
    });
  });

export default moduleName;
