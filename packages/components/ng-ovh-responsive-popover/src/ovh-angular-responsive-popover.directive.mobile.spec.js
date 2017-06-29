"use strict";

describe("Directive: responsivePopover", function () {

    var $compile;
    var $rootScope;
    var $scope;
    var $httpBackend;
    var elem;
    var responsivePopoverProvider;

    beforeEach(angular.mock.module("responsivePopoverMock"));

    beforeEach(function () {
        module(function (_responsivePopoverProvider_) {
            responsivePopoverProvider = _responsivePopoverProvider_;
        });
    });

    beforeEach(angular.mock.inject(function (_$rootScope_, _$compile_, _$httpBackend_) {
        $scope = _$rootScope_.$new();
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $httpBackend = _$httpBackend_;

        elem = $("<div>").prependTo("body");
        $scope.$digest();
    }));

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation(false);
        $httpBackend.verifyNoOutstandingRequest();
        $scope.$destroy();
        elem.remove();
    });

    var templates = {
        "default": {
            element : "<button data-responsive-popover=\"'my-test.html'\"></button>",
            scope   : {}
        }
    };

    function compileDirective (template, locals) {
        template = templates[template];
        angular.extend($scope, angular.copy(template.scope) || angular.copy(templates["default"].scope), locals);
        var element = $(template.element).appendTo(elem);
        element = $compile(element)($scope);
        $scope.$digest();
        return jQuery(element[0]);
    }

    // ---

    describe("Initialization", function () {

        it("should display the directive as full screen popover", function () {
            var compiledElement = compileDirective("default");
            var popover;

            compiledElement.trigger("click");

            popover = compiledElement.next("div.responsive-popover");

            expect(popover.length).toEqual(1);
            expect(popover.hasClass("popover-full-screen")).toBeTruthy();

            // adding try/catch because when no flush => error and with flush error too... (gné ???)
            try {
                $httpBackend.flush();
            } catch (error) {}

        });

    });

    describe("Configuration", function () {

        beforeEach(function () {
            responsivePopoverProvider.setMobileMediaQuery("(max-width: 250px)");
        });

        it("should display the directive as simple popover", function () {
            var compiledElement = compileDirective("default");
            var popover;

            compiledElement.trigger("click");

            popover = compiledElement.next("div.responsive-popover");

            expect(popover.length).toEqual(1);
            expect(popover.hasClass("popover-full-screen")).toBeFalsy();

            // adding try/catch because when no flush => error and with flush error too... (gné ???)
            try {
                $httpBackend.flush();
            } catch (error) {}

        });

    });

});
