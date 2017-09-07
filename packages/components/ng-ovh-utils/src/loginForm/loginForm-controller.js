angular.module('ua.loginForm').controller('LoginFormCtrl',
['$scope', '$http', '$location', 'translator',
function ($scope, $http, $location, Translator) {
    'use strict';

    var sessionId = $location.path().search("sessionid"),
        startIndex,
        endIndex,
        sessionV6;

    $scope.loginInProgress = !sessionId;
    $scope.errors = [];

    function errorOnLoginRedirect() {
        $('body').css('display', '');
        $scope.loginInProgress = false;
        $scope.errors = [{
            'message' : 'error_request',
            'sevices' : []
        }];
    }

    //Login from V6 session
    if ($location.path().search("sessionid") !== -1 || $location.path().search("sessionv6") !== -1) {

        startIndex = $location.path().indexOf('=') + 1;
        endIndex = $location.path().length;
        sessionV6 = $location.path().substring(startIndex, endIndex);

        $('body').css('display', 'none');

        $http.post('api/auth/loginSessionid', {
            sessionid: sessionV6,
            redirectTo: '#/'
        }).success(function (result) {
            if (!!result && !!result.url) {
                window.location.href = result.url;
            } else {
                errorOnLoginRedirect();
            }
        }).error(errorOnLoginRedirect);

    }

    //Login from V6 session
    if (!!$location.search().sessionid || !!$location.search().sessionv6) {

        $('body').css('display', 'none');

        $http.post('api/auth/loginSessionid', {
            sessionid: $location.search().sessionid || $location.search().sessionv6,
            redirectTo: '#' + ($location.path() || '/')
        }).success(function (result) {
            if (!!result && !!result.url) {
                window.location.href = result.url;
            } else {
                errorOnLoginRedirect();
            }
        }).error(errorOnLoginRedirect);
    }


    // languages choice
    $scope.availableLanguages = Translator.getAvailableLanguages();

    $scope.$watch('selectedLanguage', function (newLanguage) {
        $scope.updateSelectedLanguage(newLanguage);
    });
}]);
