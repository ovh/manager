/* global describe:true, beforeEach:true, afterEach:true, it:true, expect: true */
"use strict";

describe("flat-radio", function () {

    var $compile;
    var $scope;
    var elem;

    beforeEach(angular.mock.module("ovh-angular-form-flat"));

    beforeEach(angular.mock.inject(function (_$rootScope_, _$compile_) {
        $scope = _$rootScope_.$new();
        $compile = _$compile_;

        elem = $('<form id="testForm"></form>').prependTo("body");
        $scope.$digest();
    }));

    afterEach(function () {
        $scope.$destroy();
        elem.remove();
    });

    var templates = {
        "default": {
            element: "<label>" +
                        "<flat-radio>" +
                            '<input type="radio" id="myInputId1" name="myInput" ng-model="myInputValue" value="value1">' +
                        "</flat-radio>" +
                     "</label>" +
                     "<label>" +
                        "<flat-radio>" +
                            '<input type="radio" id="myInputId2" name="myInput" ng-model="myInputValue" value="value2">' +
                        "</flat-radio>" +
                     "</label>",
            scope: {
                myInputValue: null
            }
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

    // Testing

    describe("Testing the flat-radio directive reactivity", function () {

        it("should load the flat-radio directive", angular.mock.inject(function () {

            compileDirective("default");

            // Have our flat radio

            var flatRadios = elem.find(".flat-radio");
            expect(flatRadios.size()).toBeGreaterThan(0);

            // Check if we have a flat-radio-off
            expect(elem.find(".flat-radio-off").size()).toEqual(flatRadios.size());

            // Check if we have a flat-radio-on
            expect(elem.find(".flat-radio-on").size()).toEqual(flatRadios.size());

        }));

    });
});
