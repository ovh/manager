/* global describe:true, beforeEach:true, afterEach:true, it:true, expect: true */
/* eslint no-underscore-dangle: 0 */
"use strict";

describe("ovh-angular-simple-country-list", function () {

    var countryCount;

    beforeEach(angular.mock.module("ovh-angular-simple-country-list"));

    beforeEach(angular.mock.inject(function (OVH_SIMPLE_COUNTRY_LIST) {
        countryCount = Object.keys(OVH_SIMPLE_COUNTRY_LIST).length;
    }));

    // ---

    describe("Initialization", function () {

        it("should init the country array at the first call of setLanguage", angular.mock.inject(function (OvhSimpleCountryList) {

            OvhSimpleCountryList.setLanguage("en_GB");

            expect(_.isArray(OvhSimpleCountryList.asArray)).toBeTruthy();
            expect(OvhSimpleCountryList.asArray.length).toEqual(countryCount);
            expect(OvhSimpleCountryList._data.asArray.length).toEqual(countryCount);

        }));

        it("should get the length", angular.mock.inject(function (OvhSimpleCountryList) {

            expect(OvhSimpleCountryList.length).toEqual(countryCount);


        }));

    });

});

