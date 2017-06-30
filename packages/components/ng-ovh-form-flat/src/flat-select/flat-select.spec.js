/* global describe:true, beforeEach:true, afterEach:true, it:true, expect: true */
"use strict";

describe("flat-select", function () {

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

    afterEach(angular.mock.inject(function () {
        $scope.$destroy();
        elem.remove();
    }));

    var templates = {
        "default": {
            element: '<select flat-select id="mySelect" name="mySelect" tabindex="1" ng-model="test">' +
                            '<option value="option1">Opt 1</option>' +
                            '<option value="option2">Opt 2</option>' +
                        "</select>",
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

    describe("Testing the flat-select directive reactivity", function () {

        it("should load the flat-select directive", angular.mock.inject(function () {

            compileDirective("default");

            // Have our flat-item-container

            var flatItemContainer = elem.find(".flat-select");

            expect(flatItemContainer.size()).toEqual(1);

        }));

        it("should add a focus class when the select is focused", angular.mock.inject(function () {

            compileDirective("default");

            var flatItemContainer = elem.find(".flat-select");
            var selectItem = elem.find("select");

            selectItem.focus();

            expect(flatItemContainer.hasClass("flat-focus")).toBeTruthy();

            selectItem.blur();

            expect(flatItemContainer.hasClass("flat-focus")).toBeFalsy();

        }));

    });
});
