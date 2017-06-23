angular.module("ovh-angular-tail-logs", [
    "luegg.directives"
]);

angular.module("ovh-angular-tail-logs").component("ovhTailLogs", {
    templateUrl: "ovh-angular-tail-logs.html",
    transclude: true
});

(function () {
    "use strict";

    angular.module("ovh-angular-tail-logs").factory("OvhTailLogs", ["$q", "$timeout", "$http", function ($q, $timeout, $http) {

        var OvhTailLogs = function (opts) {
            var funcSource = opts.source || angular.noop;

            this.logs = [];
            this.delay = opts.delay || 1000;

            this.__getFuncSource = function () {
                return $q.when(funcSource());
            };

            this.source = this.__getFuncSource().then(function (source) {
                return source;
            });
        };

        OvhTailLogs.prototype.log = function () {
            var self = this;

            return self.source.then(function (source) {
                return $http.get(source + "&sort=asc&limit=1000");
            }).then(function (response) {
                var tmpArray = self.logs;
                tmpArray.push(response.data.messages);

                self.logs = _.uniq(_.flatten(tmpArray), function (log) {
                    return log.message._id; // eslint-disable-line no-underscore-dangle
                });

                return self.logs;
            }).catch(function (err) { // eslint-disable-line consistent-return
                if (err.status === 410) {
                    self.source = self.__getFuncSource(); // eslint-disable-line no-underscore-dangle
                    return self.source.then(function () {
                        return self.log();
                    });
                }
            }).finally(function () {
                self.timer = $timeout(function () {
                    self.log.call(self); // eslint-disable-line no-useless-call
                }, self.delay);
                return self.logs;
            });
        };

        OvhTailLogs.prototype.stop = function () {
            var self = this;
            if (self.timer) {
                $timeout.cancel(self.timer);
            }
            return $q.when(self);
        };

        return OvhTailLogs;
    }]);
})();

angular.module('ovh-angular-tail-logs').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('ovh-angular-tail-logs.html',
    "<div class=ovh-angular-tail-logs data-scroll-glue><div data-ng-transclude></div><i class=ovh-angular-tail-logs__cursor></div>"
  );

}]);
