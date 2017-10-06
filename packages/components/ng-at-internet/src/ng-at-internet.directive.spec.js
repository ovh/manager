"use strict";

describe("atInternetClick", function () {

    var atInternet;
    var $compile;
    var $scope;

    beforeEach(module("ng-at-internet"));
    beforeEach(inject(function (_$rootScope_, _$compile_, _atInternet_) {
        $scope = _$rootScope_;
        $compile = _$compile_;
        atInternet = _atInternet_;

        atInternet.trackClick = jasmine.createSpy();
    }));

    function compileDirective (template, scope) {
        angular.extend($scope, angular.copy(scope));
        var element = $compile(template)($scope);
        $scope.$digest();
        return element;
    }

    it("track click", function () {
        var $btn = compileDirective("<button at-internet-click=\"{ name : 'foo' }\"></button>");

        $btn.click();

        expect(atInternet.trackClick).toHaveBeenCalledWith({
            name: "foo",
            type: "action"
        });
    });

});

