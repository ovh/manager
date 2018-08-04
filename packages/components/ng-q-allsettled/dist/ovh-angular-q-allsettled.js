angular.module("ovh-angular-q-allSettled", []);

angular.module("ovh-angular-q-allSettled").config(["$provide", function ($provide) {
    "use strict";
    $provide.decorator("$q", ["$delegate", function ($delegate) {
        var $q = $delegate;

        // Extention for q
        $q.allSettled = $q.allSettled || function (promises) {
            var deferred = $q.defer();
            if (angular.isArray(promises)) {
                var states = [];
                var results = [];
                var didAPromiseFail = false;

                if (promises.length === 0) {
                    deferred.resolve([]);
                }

                // First create an array for all promises setting their state to false (not completed)
                angular.forEach(promises, function (promise, key) {
                    states[key] = false;
                });

                // Helper to check if all states are finished
                var checkStates = function (stateList, result, toDefer, failed) {
                    var allFinished = true;
                    angular.forEach(stateList, function (state) {
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
                // a second loop to be sure that checkStates is called when all states are set to false first
                angular.forEach(promises, function (promise, key) {
                    $q.when(promise).then(function (result) {
                        states[key] = true;
                        results[key] = result;
                        checkStates(states, results, deferred, didAPromiseFail);
                    }, function (reason) {
                        states[key] = true;
                        results[key] = reason;
                        didAPromiseFail = true;
                        checkStates(states, results, deferred, didAPromiseFail);
                    });
                });
            } else {
                throw "allSettled can only handle an array of promises (for now)"; // eslint-disable-line no-throw-literal
            }

            return deferred.promise;
        };

        return $q;
    }]);
}]);
