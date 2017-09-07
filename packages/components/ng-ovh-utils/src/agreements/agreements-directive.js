/**
 * @type directive
 * @name ovhDirectives:agreements
 * @version 0.0.1
 * @description
 * provide a pagination for contract
 * # Usage
 * <code:html>
 * <div id="myContracts" data-agreements="'services/administration/agreement'" data-agreements-request-params="agreementsParams"></div>
 * </code>
 * <code:js>
 * function ctrl ($scope) {
 *      $scope.agreementsParams = [
 *          { agreementName : 'contract1' },
 *          { agreementName : 'contract2' },
 *          { agreementName : 'contract3' },
 *      ];
 * }
 * </code>
 **/
angular.module('ua.agreements').directive('agreements', ['$http', function (http) {
    'use strict';
    return {
        'restrict': 'A',
        'transclude': true,
        'replace': false,
        'scope': true,
        'templateUrl' : 'components/ovh-utils-angular/agreements/agreements.html',
        'compile' : function () {
            return function (scope, elt, attrs) {
                var agreements = null;
                scope.loading = true;

                if (!attrs.agreements) {
                    throw '[ovh-utils-angular] ovhDirectives.agreements : No agrements found';
                }

                agreements = scope.$eval(attrs.agreements);

                scope.getAgreements = function () {
                    scope.requestParams = scope.$eval(attrs.agreementsRequestParams);
                    if (scope.requestParams) {

                        scope.loading = true;

                        // Oh paginated
                        if (angular.isArray(scope.requestParams)) {

                            scope.paginator = {
                                currentPage: 0
                            };

                            scope.$watch('paginator.currentPage', function (newPage) {
                                scope.loading = true;

                                if (newPage !== undefined) {
                                    http.get(agreements, {
                                        params : scope.requestParams[newPage],
                                        cache: true
                                    }).then(function (success) {
                                        scope.loading = false;

                                        if (angular.isObject(success)) {
                                            scope.agreements = success;
                                        } else {
                                            throw '[ovh-utils-angular] ovhDirectives.agreements : request result are not recognized ';
                                        }

                                    }, function (error) {
                                        scope.loading = false;
                                        scope.errors = [error];
                                        angular.element('#agreements-modal').modal('hide');
                                    });
                                }
                            });
                        // Juste one, no pagination
                        } else if (angular.isObject(scope.requestParams)) {

                            scope.paginator =  null;

                            http.get(agreements, {
                                params: scope.requestParams,
                                cache: true
                            }).then(function (success) {

                                scope.loading = false;

                                if (angular.isArray(success)) {
                                    scope.agreements = success;
                                } else if (angular.isObject(success)) {
                                    scope.agreements = success;
                                } else {
                                    throw '[ovh-utils-angular] ovhDirectives.agreements : request result are not recognized ';
                                }

                            }, function (error) {
                                scope.loading = false;
                                scope.errors = [error];
                                angular.element('#agreements-modal').modal('hide');
                            });
                        }
                    } else {
                        scope.agreements = [];
                    }
                };

                if (angular.isString(agreements)) {
                    scope.getAgreements();
                } else if (angular.isArray(agreements)) {
                    scope.agreements = agreements;
                } else if (angular.isObject(agreements)) {
                    scope.agreements = [agreements];
                } else if (agreements !== undefined) {
                    throw '[ovh-utils-angular] ovhDirectives.agreements : agreements must be an url or an array or an object';
                }

                scope.isFirstPage = function () {
                    if (scope.paginator) {
                        return scope.paginator.currentPage === 0;
                    }
                };

                scope.isLastPage = function () {
                    if (scope.paginator) {
                        return scope.paginator.currentPage + 1 >= scope.requestParams.length;
                    }
                };

                scope.incPage = function () {
                    if (scope.paginator && !scope.isLastPage()) {
                        scope.paginator.currentPage++;
                    }
                };

                scope.decPage = function () {
                    if (scope.paginator && !scope.isFirstPage()) {
                        scope.paginator.currentPage--;
                    }
                };

                scope.firstPage = function () {
                    if (scope.paginator) {
                        scope.paginator.currentPage = 0;
                    }
                };

                scope.numberOfPages = function () {
                    if (scope.paginator) {
                        if (angular.isArray) {
                            return scope.requestParams.length;
                        } else {
                            return 1;
                        }
                    } else {
                        return 1;
                    }
                };
            };// end return
        }// end compile
    };
}]);
