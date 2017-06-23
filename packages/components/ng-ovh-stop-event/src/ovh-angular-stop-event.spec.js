/* global describe:true, beforeEach:true, afterEach:true, it:true, expect: true */
"use strict";

describe("ovh-angular-stop-event", function () {

    var $compile;
    var $scope;
    var elem;

    beforeEach(angular.mock.module("ovh-angular-stop-event"));

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
            element: "<div data-ovh-angular-stop-event></div>",
            scope: {}
        }
    };

    function compileDirective (template, locals) {
        template = templates[template]; // eslint-disable-line no-param-reassign
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
