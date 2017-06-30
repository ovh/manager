/* global describe:true, beforeEach:true, afterEach:true, it:true, expect: true */
"use strict";

describe("flat-input-container", function () {

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
            element: "<div flat-input-container>" +
                        '<label class="control-label" for="myInputId">My Input Label Example</label>' +
                        '<input type="text" id="myInputId" name="myInputId" ng-model="myInputValue" required pattern=".{5,}">' +
                     "</div>",
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

    describe("Testing the flat-input-container directive reactivity", function () {

        it("should load the flat-input-container directive", inject(function () {

            compileDirective("default");

            // Have our flat-item-container

            var flatItemContainer = elem.find("[flat-input-container]");

            expect(flatItemContainer.size()).toEqual(1);

            // Have our flat-item

            var flatItem = flatItemContainer.find(".flat-item");

            expect(flatItem.size()).toEqual(1);

        }));

        it("should add a flat-focus class on container when item is focus", angular.mock.inject(function () {

            compileDirective("default");

            // Get items

            var flatItemContainer = elem.find("[flat-input-container]");
            var flatItem = flatItemContainer.find(".flat-item");

            // Focus item

            flatItem.focus();

            expect(flatItemContainer.hasClass("flat-focus")).toBeTruthy();

            // Unfocus item

            flatItem.blur();

            expect(flatItemContainer.hasClass("flat-focus")).toBeFalsy();
        }));

        it("should add a flat-valid class on container when item is valid", angular.mock.inject(function () {

            compileDirective("default", {
                myInputValue: "Testouille"
            });

            // Get items

            var flatItemContainer = elem.find("[flat-input-container]");

            expect(flatItemContainer.hasClass("flat-valid")).toBeTruthy();
        }));

        it("should add a flat-invalid class on container when item is invalid", angular.mock.inject(function () {

            compileDirective("default", {
                myInputValue: "Test"
            });

            // Get items

            var flatItemContainer = elem.find("[flat-input-container]");

            expect(flatItemContainer.hasClass("flat-invalid")).toBeTruthy();
        }));

        it("should add a flat-show class on container when item is not empty", angular.mock.inject(function () {

            compileDirective("default", {
                myInputValue: "A"
            });

            // Get items

            var flatItemContainer = elem.find("[flat-input-container]");
            var flatInput = flatItemContainer.find("input");
            var label = flatItemContainer.find("label");

            // Trigger the key up event to check value and replace classes

            flatInput.trigger("keyup");

            expect(label.hasClass("flat-show")).toBeTruthy();

            // Change scope value

            $scope.myInputValue = "";
            $scope.$digest();

            // Trigger the key up event to check value and replace classes

            flatInput.trigger("keyup");

            expect(label.hasClass("flat-show")).toBeFalsy();
        }));

        it("should add a flat-hide class on container when item is empty", angular.mock.inject(function () {

            compileDirective("default", {
                myInputValue: "A"
            });

            // Get items

            var flatItemContainer = elem.find("[flat-input-container]");
            var flatInput = flatItemContainer.find("input");
            var label = flatItemContainer.find("label");

            // Trigger the key up event to check value and replace classes

            flatInput.trigger("keyup");

            expect(label.hasClass("flat-hide")).toBeFalsy();

            // Change scope value

            $scope.myInputValue = "";
            $scope.$digest();

            // Trigger the key up event to check value and replace classes

            flatInput.trigger("keyup");

            expect(label.hasClass("flat-hide")).toBeTruthy();
        }));
    });
});
