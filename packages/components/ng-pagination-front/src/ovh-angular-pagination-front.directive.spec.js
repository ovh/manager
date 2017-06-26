/* global describe:true, beforeEach:true, afterEach:true, it:true, expect: true */
describe("directive: paginationFront", function () {
    "use strict";

    var $scope;
    var elem;
    var $compile;

    beforeEach(angular.mock.module("ovh-angular-pagination-front"));
    beforeEach(angular.mock.module("templates"));

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
            element: "<div pagination-front></div>",
            scope: {}
        }
    };

    function compileDirective (templateName, locals) {
        var template = templates[templateName];
        angular.extend($scope, angular.copy(template.scope) || angular.copy(templates.default.scope), locals);
        var element = $(template.element).appendTo(elem);
        element = $compile(element)($scope);
        $scope.$digest();
        return jQuery(element);
    }

    describe("Test", function () {
        it("should load the directive", function () {
            var elt = compileDirective("default");
            var child = elt.children();
            expect(child.length).toEqual(1);
            expect(child.hasClass("pagination-container")).toBeTruthy();
        });

    });
});
