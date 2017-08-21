"use strict";

describe("ovh-angular-http", function () {

    var $compile;
    var $scope;
    var $httpBackend;
    var elem;

    beforeEach(angular.mock.module("ovh-angular-http"));

    beforeEach(angular.mock.inject(function (_$rootScope_, _$compile_, _$httpBackend_) {
        $scope = _$rootScope_.$new();
        $compile = _$compile_;
        $httpBackend = _$httpBackend_;

        elem = $("<div>").prependTo("body");
        $scope.$digest();
    }));

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
        $scope.$destroy();
        elem.remove();
    });

    var templates = {
        "default": {
            element: "<div data-ovh-http></div>",
            scope: {}
        }
    };

    function compileDirective (templateParam, locals) {
        var template = templates[templateParam];
        angular.extend($scope, angular.copy(template.scope) || angular.copy(templates.default.scope), locals);
        var element = $(template.element).appendTo(elem);
        element = $compile(element)($scope);
        $scope.$digest();
        return jQuery(element[0]);
    }


    // ---


    describe("Initialization", function () {

        it("should load the default directive", angular.mock.inject(function () {

            compileDirective("default");

            expect(true).toBeTruthy();

        }));

    });

});
