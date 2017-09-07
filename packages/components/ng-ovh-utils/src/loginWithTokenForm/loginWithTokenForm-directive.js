/**
 * @type directive
 * @name ovhDirectives:loginWithTokenForm
 * @version 0.0.1
 * @description
 * Provide the login with token form
 * @example
 * <code:html>
 *   <button data-login-with-token-form></button>
 * </code>
 */
angular.module('ua.loginWithTokenForm').directive('loginWithTokenForm', ['$http', function ($http) {
    "use strict";
    return {
        restrict   : 'A',
        replace    : false,
        controller : 'LoginWithTokenFormCtrl',
        link       : function ($scope, $elm) {
            var loginButton = $elm;

            function errorOnLoginRedirect() {
                $('body').css('display', '');
                $scope.loginInProgress = false;
                $scope.errors = [{
                    'message' : 'error_request',
                    'sevices' : []
                }];
            }

            $scope.errors = [];
            if ($.cookie('X-OVH-V6-LOGGED') === "false") {
                $('#error').css('display', 'block');
            }
            (function () {

                loginButton.bind('click', function () {
                    $('body').css('display', 'none');

                    $http.post('api/auth/loginWithToken', {
                        redirectTo: (window.location.hash || '#/')
                    }).then(function (result) {
                        if (!!result && !!result.url) {
                            window.location.href = result.url;
                        } else {
                            errorOnLoginRedirect();
                        }
                    })["catch"](errorOnLoginRedirect);
                });

            })();

        }// end Link
    };//end return
}]);
