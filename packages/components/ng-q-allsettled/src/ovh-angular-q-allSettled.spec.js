/* global describe:true, beforeEach:true, afterEach:true, it:true, expect: true */
"use strict";

describe("ovh-angular-q-allSettled", function () {

    beforeEach(angular.mock.module("ovh-angular-q-allSettled"));

    // ---

    describe("Initialization", function () {

        it("should load overload the $q service with 'allSettled'", angular.mock.inject(function ($q) {
            expect(typeof $q.allSettled).toBe("function");
        }));

        it("should execute all the promises before stating the result", angular.mock.inject(function ($q, $timeout) {
            var iMustBeSet;
            $q.allSettled([
                $q.reject(),
                $timeout(function () {
                    iMustBeSet = true;
                }, 100)
            ]).then(function () {
                // If the test come here, it must crash !
                expect(false).toBeTruthy();
            }).catch(function () {
                expect(iMustBeSet).toBeTruthy();
            });
        }));

    });

});
