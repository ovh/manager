"use strict";

angular.module("unit.testing", ["ui.router"])
.config(function ($stateProvider) {
    $stateProvider.state("foobar", {
        resolve: {
            $title: function () {
                return "foobar-title";
            }
        }
    });
    $stateProvider.state("untitled", {});
});

describe("angular-uirouter-title unit testing", function () {

    var $rootScope;
    var $state;

    beforeEach(module("angular.uirouter.title"));
    beforeEach(module("unit.testing"));

    beforeEach(function () {
        inject(function (_$state_, _$rootScope_) {
            $state = _$state_;
            $rootScope = _$rootScope_;
        });
    });

    it("should update document title", function () {
        expect(document.title).toBe("");
        $state.go("foobar");
        $rootScope.$apply();
        expect(document.title).toBe("foobar-title");
    });

    it("should reset document title", function () {
        document.title = "original title";
        $state.go("foobar");
        $rootScope.$apply();
        $state.go("untitled");
        $rootScope.$apply();
        expect(document.title).toBe("original title");
    });
});
