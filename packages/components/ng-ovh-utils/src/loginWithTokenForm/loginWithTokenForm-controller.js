angular.module('ua.loginWithTokenForm').controller('LoginWithTokenFormCtrl',
['$scope', '$http', '$location', 'translator',
function ($scope, $http, $location, Translator) {
    'use strict';

    var hasConsumerKey = $location.path().search("consumerKey"),
        startIndex,
        endIndex,
        consumerKey;

    $scope.loginInProgress = !hasConsumerKey;
    $scope.errors = [];

    //Login from consumer key
    if ($location.path().search("consumerKey") !== -1) {
        startIndex = $location.path().indexOf('=') + 1;
        endIndex = $location.path().length;
        consumerKey = $location.path().substring(startIndex, endIndex);
    }

    // languages choice
    $scope.availableLanguages = Translator.getAvailableLanguages();

    $scope.$watch('selectedLanguage', function (newLanguage) {
        $scope.updateSelectedLanguage(newLanguage);
    });
}]);
