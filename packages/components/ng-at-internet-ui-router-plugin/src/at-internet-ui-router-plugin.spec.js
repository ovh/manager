"use strict";

describe("atInterntUiRouterPlugin unit testing", function () {

    var $state;
    var atInternet;

    beforeEach(function () {

        angular.mock.module("ng-at-internet", function (atInternetProvider) {
            atInternetProvider.setEnabled(true);
        });

        angular.mock.module("atInternetUiRouterPlugin", function (atInternetUiRouterPluginProvider) {
            atInternetUiRouterPluginProvider.setTrackStateChange(true);
            atInternetUiRouterPluginProvider.addStateNameFilter(function (name) {
                return name.replace(/world/g, "hello");
            });
        });

        angular.mock.module("ui.router", function ($stateProvider) {
            $stateProvider.state("foo", {
                url: "/foo"
            });
            $stateProvider.state("bar", {
                url: "/bar",
                atInternet: { rename: "foobar" }
            });
            $stateProvider.state("helloworld", {
                url: "/helloworld"
            });
            $stateProvider.state("ignored", {
                url: "/helloworld",
                atInternet: { ignore: true }
            });
        });

        inject(function (_$state_, _atInternet_) {
            $state = _$state_;
            atInternet = _atInternet_;
            spyOn(atInternet, "trackPage");
        });

    });

    it("should have a valid configuration", function () {
        expect(atInternet.getConfig().enabled).toBe(true);
    });

    it("should track state change", function () {
        $state.go("foo");
        expect(atInternet.trackPage).toHaveBeenCalledWith({ name: "foo" });
    });

    it("should rename state", function () {
        $state.go("bar");
        expect(atInternet.trackPage).toHaveBeenCalledWith({ name: "foobar" });
    });

    it("should filter state name", function () {
        $state.go("helloworld");
        expect(atInternet.trackPage).toHaveBeenCalledWith({ name: "hellohello" });
    });

    it("should ignore state", function () {
        $state.go("ignored");
        expect(atInternet.trackPage).not.toHaveBeenCalled();
    });

});
