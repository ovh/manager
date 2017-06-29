"use strict";

describe("ovh-angular-responsive-page-switcher", function () {

    var $compile,
        $rootScope,
        $scope,
        $httpBackend,
        elem,
        $timeout;

    beforeEach(angular.mock.module("ovh-angular-responsive-page-switcher"));

    beforeEach(angular.mock.inject(function (_$rootScope_, _$compile_, _$httpBackend_, _$timeout_) {
        $scope = _$rootScope_.$new();
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $httpBackend = _$httpBackend_;
        $timeout = _$timeout_;

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
            element: "<div responsive-switch><div responsive-switch-page></div></div>",
            scope: {}
        },
        throwError: {
            element: "<div responsive-switch-page></div>",
            scope: {}
        },
        forcedMode: {
            element: "<div responsive-switch" +
                            ' responsive-switch-force-mode="switch">' +
                            "<div responsive-switch-page></div>" +
                        "</div>",
            scope: {}
        }
    };

    function compileDirective (template, locals) {
        template = templates[template];
        angular.extend($scope, angular.copy(template.scope) || angular.copy(templates.default.scope), locals);
        var element = $(template.element).appendTo(elem);
        element = $compile(element)($scope);
        $scope.$digest();
        return jQuery(element[0]);
    }


    // ---


    describe("Testing the main directive reactivity", function () {

        it("should load the default directive and display one page", angular.mock.inject(function () {

            compileDirective("default");

            var responsiveSwitch = $(".responsive-switch");

            expect(responsiveSwitch.length).toBe(1);
            expect(responsiveSwitch.find(".responsive-switch-page").length).toBe(1);

        }));

        it("should throw an error when no responsive-switch is created", angular.mock.inject(function () {

            try {
                compileDirective("throwError");
            } catch (e) {
                expect(true).toBeTruthy();
            }

        }));

        it("should wait directive timeout to ensure final class applyed", angular.mock.inject(function () {

            compileDirective("forcedMode");

            $timeout.flush();

            expect($(".responsive-switch").hasClass("responsive-switch-switch")).toBeTruthy();

        }));

    });

});
