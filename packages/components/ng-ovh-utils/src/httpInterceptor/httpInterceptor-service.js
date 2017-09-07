/**
 * @type service
 * @name ovhServices:HttpInterceptor
 * @description
 * Handle HTTP errors.
 * HTTP 401 error status automatically redirect to login page (`login.html`).
 */
angular.module('ua.httpInterceptor').factory('HttpInterceptor',
['$q',

function ($q) {
    'use strict';

    return {
        'responseError' : function (err) {

            if (err.status === 500) {

                if (err.data === null || err.data === undefined || err.data === "") {
                    err.data = {};
                }

                err.data.toAlert = function (scope) {
                    scope.errors = [{
                        'message' : scope.tr('error_request'),
                        'sevices' : [err.config.method + ' ' + err.config.url]
                    }];
                };
            }
            return $q.reject(err);
        }
    };
}

]);
