"use strict";

describe("atInternetClick", function () {

    var atInternet;
    var $compile;
    var $scope;
    var elem;

    beforeEach(function () {
        angular.mock.module("ng-at-internet");

        inject(function (_atInternet_) {
            atInternet = _atInternet_;
            atInternet.trackClick = jasmine.createSpy();
        });

        atInternet.trackClick.calls.reset();
    });

    beforeEach(angular.mock.inject(function (_$rootScope_, _$compile_) {
        $scope = _$rootScope_.$new();
        $compile = _$compile_;
        elem = $compile("<div></div>")($scope).prependTo("body");
        $scope.$digest();
    }));

    afterEach(function () {
        $scope.$destroy();
        elem.remove();
    });

    var templates = {
        action: {
            element: "<button at-internet-click=\"{ name : 'foo' }\"></button>"
        }
    };

    function compileDirective (tpl, locals) {
        var template = templates[tpl];
        angular.extend($scope, angular.copy(template.scope) || angular.copy(templates.action.scope), locals);
        var element = $(template.element).appendTo(elem);
        element = $compile(element)($scope);
        $scope.$digest();
        return jQuery(element[0]);
    }

    it("track click", function () {
        compileDirective("action");
        var $btn = elem.find("button");
        $btn.click();
        expect(atInternet.trackClick).toHaveBeenCalledWith({
            name: "foo",
            type: "action"
        });
    });

});

