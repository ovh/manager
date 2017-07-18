'use strict';

describe('ovh-angular-doc-url', function () {

    var $compile, $scope

    beforeEach(angular.mock.module('ovh-angular-doc-url', function (ovhDocUrlProvider) {
        ovhDocUrlProvider.setUserLocale("fr_ca");
    }));

    beforeEach(angular.mock.inject(function (_$rootScope_, _$compile_) {
        $scope = _$rootScope_;
        $compile = _$compile_;
    }));

     function compileDirective (template) {
        var element = $compile(template)($scope);
        $scope.$digest();
        return element;
    };

    describe('Initialization', function () {

        it('should generate doc-resolver link with configured locale', angular.mock.inject(function () {

            var element = compileDirective('<ovh-doc-url doc-id="g1769.creating_ssh_keys">My link</ovh-doc-url>');

            console.log(element.html())
            expect(element.html().indexOf('<a data-ng-href="/engine/2api/doc-resolver?id=g1769.creating_ssh_keys&amp;locale=fr_ca" target="_blank" href="/engine/2api/doc-resolver?id=g1769.creating_ssh_keys&amp;locale=fr_ca"><span data-ng-transclude="">My link</span><i class="fa fa-external-link" aria-hidden="true"></i></a>') !== -1).toBe(true);
        }));

    });

});
