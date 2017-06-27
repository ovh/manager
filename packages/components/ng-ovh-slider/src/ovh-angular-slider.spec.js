/* global describe:true, beforeEach:true, afterEach:true, it:true, expect: true */
describe("ovh-angular-slider", function () {
    "use strict";

    var $compile;
    var $scope;
    var elem;

    beforeEach(angular.mock.module("ovh-angular-slider"));

    beforeEach(angular.mock.inject(function (_$rootScope_, _$compile_) {
        $scope = _$rootScope_.$new();
        $compile = _$compile_;

        elem = $("<div>").prependTo("body");
        $scope.$digest();
    }));

    afterEach(function () {
        $scope.$destroy();
        elem.remove();
    });

    var templates = {
        "default": {
            element: "<div data-ovh-slider></div>",
            scope: {}
        }
    };

    function compileDirective (templateName, locals) {
        var template = templates[templateName];
        angular.extend($scope, angular.copy(template.scope) || angular.copy(templates.default.scope), locals);
        var element = $(template.element).appendTo(elem);
        element = $compile(element)($scope);
        $scope.$digest();
        return jQuery(element[0]);
    }


    // ---


    describe("Initialization", function () {

        it("should load the default directive", angular.mock.inject(function () {

            var elt = compileDirective("default");

            expect(elt.hasClass("ng-scope")).toBeTruthy();

        }));

    });

});
