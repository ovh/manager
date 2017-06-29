/* global describe:true, beforeEach:true, it:true, expect: true */
describe("angular-ovh-proxy-request", function () {
    "use strict";

    var proxyRequestProvider;

    beforeEach(angular.mock.module("ovh-angular-proxy-request"));

    beforeEach(function () {
        module(["ovh-proxy-request.proxyProvider", function (proxyProvider) {
            proxyRequestProvider = proxyProvider;
        }]);
    });

    describe("Provider", function () {
        it("should get the current path prefix", angular.mock.inject(function () {
            expect(proxyRequestProvider.pathPrefix()).toEqual("/");
        }));

        it("should set the current path prefix", angular.mock.inject(function () {
            proxyRequestProvider.pathPrefix("/hello/world");
            expect(proxyRequestProvider.pathPrefix()).toEqual("/hello/world");
        }));

        it("should get the current proxy", angular.mock.inject(function () {
            expect(proxyRequestProvider.proxy()).toEqual("$http");
        }));

        it("should set the current proxy", angular.mock.inject(function () {
            proxyRequestProvider.proxy("$myProxy");
            expect(proxyRequestProvider.proxy()).toEqual("$myProxy");
        }));
    });
});
