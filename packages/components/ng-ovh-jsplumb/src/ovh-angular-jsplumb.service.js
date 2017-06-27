/**
 * @ngdoc service
 * @name ovh-angular-jsplumb.jsPlumbService
 * @description
 *
 * Main service
 */
angular.module("ovh-angular-jsplumb").service("jsPlumbService", function ($q) {

    "use strict";

    var initDeferred = $q.defer();

    /**
         * @ngdoc function
         * @name jsplumbInit
         * @methodOf ovh-angular-jsplumb.jsPlumbService
         * @description
         *
         * Initialize jsPlumb
         *
         */
    this.jsplumbInit = function () {
        jsPlumb.ready(function () {
            initDeferred.resolve();
        });

        return initDeferred.promise;
    };

    /**
         * @ngdoc function
         * @name importDefaults
         * @methodOf ovh-angular-jsplumb.jsPlumbService
         * @description
         *
         * Configure jsPlumb
         *
         */
    this.importDefaults = function (defaults) {
        jsPlumb.importDefaults(defaults);
    };
}
);
