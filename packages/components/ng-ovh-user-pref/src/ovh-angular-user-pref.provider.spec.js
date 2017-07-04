describe("Provider: ovhUserPref", function () {
    "use strict";

    // instantiate service
    var ovhUserPref;
    var ovhUserPrefProvider;
    var $rootScope;
    var init = function () {
        angular.mock.inject(function (_ovhUserPref_, _$rootScope_) {
            ovhUserPref = _ovhUserPref_;
            $rootScope = _$rootScope_;
        });
    };
    var $httpBackend;

    // ---

    beforeEach(angular.mock.module("ovh-angular-user-pref"));

    beforeEach(angular.mock.module("ovh-angular-user-pref", function (_ovhUserPrefProvider_) {
        _ovhUserPrefProvider_.setRegex(/[A-Z]+_[^0-9][A-Z0-9]+_?[^0-9][A-Z0-9]+/);
        ovhUserPrefProvider = _ovhUserPrefProvider_;
    }));

    beforeEach(angular.mock.module("ovh-angular-proxy-request", ["ovh-proxy-request.proxyProvider", function (_proxyProvider_) {
        _proxyProvider_.pathPrefix("/test");
    }]));

    beforeEach(angular.mock.inject(function (_$httpBackend_) {
        $httpBackend = _$httpBackend_;
    }));

    beforeEach(init);

    afterEach(angular.mock.inject(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    }));


    describe("Initialization", function () {

        it("should do something", function () {
            expect(!!ovhUserPref).toBe(true);
        });

    });

    describe("Param injector", function () {
        it("should inject nothing", function () {
            var url = ovhUserPrefProvider.paramsInjector("hello/world/{id}", null, "prefix");
            expect(url).toEqual("prefix/hello/world/");
        });

        it("should inject id", function () {
            var url = ovhUserPrefProvider.paramsInjector("hello/world/{id}", { id: "hello world" }, "prefix");
            expect(url).toEqual("prefix/hello/world/hello%20world");
        });
    });

    describe("Request GET", function () {
        it("should request getKeys", function () {
            $httpBackend.expectGET("/test/me/preferences/manager").respond(200, ["COMMON_LANG"]);

            ovhUserPref.getKeys()
                .then(function (keys) {
                    expect(keys).toEqual(["COMMON_LANG"]);
                });

            $httpBackend.flush();
        });

        it("should request getValue", function () {

            $httpBackend.expectGET("/test/me/preferences/manager/COMMON_LANG").respond(200, {
                key: "COMMON_LANG",
                value: {
                    value: "fr_FR",
                    name: "Français"
                }
            });

            ovhUserPref.getValue("COMMON_LANG")
                .then(function (keys) {
                    expect(keys).toEqual({
                        value: "fr_FR",
                        name: "Français"
                    });
                });

            $httpBackend.flush();
        });
    });

    describe("Request POST", function () {
        it("should not request create", function () {
            ovhUserPref.create("COUCOU", "toi")
                .then(function (value) {
                    expect(value).toBe(null);
                }, function (err) {
                    expect(err).toEqual("Invalid format key");
                });
        });

        it("should request create", function () {
            var stringObj = JSON.stringify("fr_FR");
            $httpBackend.expectPOST("/test/me/preferences/manager", { key: "COMMON_LANG", value: stringObj }).respond(200, null);

            ovhUserPref.create("COMMON_LANG", "fr_FR")
                .then(function (value) {
                    expect(value).toBe(null);
                });

            $httpBackend.flush();
        });

        it("should not leave a promise in pending state when calling two sequential assign", function () {
            var assignPromise = function () {
                return ovhUserPref.assign("123", "foo");
            };
            var a = assignPromise();
            var b = assignPromise();
            var pendingAssign = 2;
            a.finally(function () {
                pendingAssign -= 1;
            });
            b.finally(function () {
                pendingAssign -= 1;
            });
            $rootScope.$apply();

            // they should be resolved or rejected (not pending!)
            expect(pendingAssign).toEqual(0);
        });

    });

    describe("Request DELETE", function () {
        it("should request delete", function () {
            $httpBackend.expectDELETE("/test/me/preferences/manager/COMMON_LANG").respond(200, null);

            ovhUserPref.remove("COMMON_LANG")
                .then(function (value) {
                    expect(value).toBe(null);
                });

            $httpBackend.flush();
        });

    });

});
