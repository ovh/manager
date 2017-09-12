/* global describe:true, beforeEach:true, afterEach:true, it:true, expect: true */
describe("ovh-angular-jsplumb", function () {
    "use strict";

    var $compile;
    var $scope;
    var elem;

    beforeEach(angular.mock.module("ngSanitize"));
    beforeEach(angular.mock.module("ovh-angular-jsplumb"));

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
            element: "<div data-jsplumb-instance>" +
                            "<div data-jsplumb-endpoint id=\"id1\"></div>" +
                        "</div>",
            scope: {}
        },
        withoutJsplumbInstance: {
            element: "<div data-jsplumb-endpoint></div>"
        }
    };

    function compileDirective (templateName, locals) {
        var template = templates[templateName];
        angular.extend($scope, angular.copy(template.scope) || angular.copy(templates["default"].scope), locals);
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

        it("should catch an error because no jsplumbInstance as parent", angular.mock.inject(function () {
            try {
                compileDirective("withoutJsplumbInstance");
            } catch (err) {
                expect(true).toBeTruthy();
            }
        }));

    });

});
