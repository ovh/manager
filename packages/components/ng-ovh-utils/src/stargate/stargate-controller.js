angular.module('ua.stargate').controller('stargateCtrl',
['$scope', '$http', 'utils-angular.conf.STARGATE_URL',
function ($scope, $http, STARGATE_URL) {
    'use strict';

    var apiCommonUnivers = STARGATE_URL || 'api/common/univers';

    $scope.gates = null;
    $scope.loading = true;

    $http.get(apiCommonUnivers).then(function (success) {
        $scope.loading = false;
        var univers = success.results;
        if (angular.isObject(success.results)) {
            for (var i = 0 ; i < univers.length ; i++) {
                if (univers[i].name !== "univers-cloud") {
                    univers[i].targetEndpoint = univers[i].targetEndpoint.replace('login.html', 'index.html');
                }
            }
            $scope.gates = angular.copy(univers);
        } else {
            throw '[ovh-utils-angular] ovhDirectives.stargateCtrl : request result are not recognized ';
        }

    })["catch"](function () {
        $scope.loading = false;
    });

}]);
