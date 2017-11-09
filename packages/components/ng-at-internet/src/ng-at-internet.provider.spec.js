"use strict";

describe("AtInternet provider unit testing", function () {

    var atInternet;
    var $window;

    /**
     * Mocking of AtInternet JS lib.
     */

    var tagMock = function () {
        // Do nothing
    };
    var tagMockPageData = {};
    var tagMockCartData = { id: null, products: [] };
    var tagMockOrderData = {};
    var tagMockCustomVarsData = null;

    tagMock.prototype.dispatch = jasmine.createSpy();

    tagMock.prototype.identifiedVisitor = {
        set: jasmine.createSpy()
    };

    tagMock.prototype.page = {
        set: function (data) {
            tagMockPageData = data;
        },
        send: jasmine.createSpy()
    };

    tagMock.prototype.click = {
        send: jasmine.createSpy()
    };

    tagMock.prototype.cart = {
        set: function (id) {
            tagMockCartData.id = id;
        },
        add: function (product) {
            tagMockCartData.products.push(product);
        }
    };

    tagMock.prototype.order = {
        set: function (data) {
            tagMockOrderData = data;
        }
    };

    tagMock.prototype.customVars = {
        set: function (data) {
            tagMockCustomVarsData = data;
        }
    };


    /**
     * Dependency injection.
     */


    beforeEach(function () {
        angular.mock.module("ng-at-internet");
    });

    /**
     * Tests.
     */

    describe("configuration test", function () {

        beforeEach(function () {
            angular.mock.module("ng-at-internet", function (atInternetProvider) {
                atInternetProvider.setEnabled(true);
                atInternetProvider.setDebug(true);
                atInternetProvider.setDefaults({
                    foo: "bar"
                });
            });

            inject(function (_atInternet_) {
                atInternet = _atInternet_;
            });
        });

        it("should have a valid config", function () {
            expect(atInternet.getConfig()).toEqual({
                enabled: true,
                debug: true,
                defaults: {
                    foo: "bar"
                }
            });
        });

        it("should update existing defaults", function () {
            atInternet.setDefaults({
                foo: "newValue",
                foo2: "bar2"
            });

            expect(atInternet.getConfig()).toEqual({
                enabled: true,
                debug: true,
                defaults: {
                    foo: "newValue",
                    foo2: "bar2"
                }
            });
        });
    });

    describe("tracking test", function () {

        beforeEach(function () {
            angular.mock.module("ng-at-internet", function (atInternetProvider, $provide) {
                $window = {
                    ATInternet: { Tracker: { Tag: tagMock } }
                };
                $provide.factory("$window", function () {
                    return $window;
                });
                atInternetProvider.setEnabled(true);
                atInternetProvider.setDefaults({
                    countryCode: "defaultCountry"
                });
            });

            inject(function (_atInternet_) {
                atInternet = _atInternet_;
            });

            // reset the lib mock between each test
            tagMockPageData = {};
            tagMockCartData = { id: null, products: [] };
            tagMockOrderData = {};
            tagMock.prototype.dispatch.calls.reset();
            tagMock.prototype.click.send.calls.reset();
            tagMock.prototype.page.send.calls.reset();
        });

        describe("track page", function () {

            it("track page", function () {
                atInternet.trackPage({
                    name: "foo",
                    level2: 1
                });
                expect(tagMock.prototype.page.send).toHaveBeenCalledWith({
                    name: "foo",
                    level2: 1,
                    countryCode: "defaultCountry",
                    customVars: { site: { 2: "[defaultCountry]" } }
                });
            });

            it("track page with visitorId", function () {
                atInternet.trackPage({
                    name: "foo",
                    level2: 1,
                    visitorId: "1234"
                });
                expect(tagMock.prototype.identifiedVisitor.set).toHaveBeenCalledWith({
                    id: "1234"
                });
            });

            it("should track page missing level2 but force 0", function () {
                atInternet.trackPage({
                    name: "foo"
                });
                expect(tagMock.prototype.page.send).toHaveBeenCalledWith({
                    name: "foo",
                    level2: 0,
                    countryCode: "defaultCountry",
                    customVars: { site: { 2: "[defaultCountry]" } }
                });
            });

        });

        describe("track click", function () {

            it("track click", function () {
                atInternet.trackClick({
                    name: "bar",
                    type: "action",
                    level2: 1
                });
                expect(tagMock.prototype.click.send).toHaveBeenCalledWith({
                    name: "bar",
                    type: "action",
                    level2: 1,
                    countryCode: "defaultCountry"
                });
            });

            it("track click with visitorId", function () {
                atInternet.trackClick({
                    name: "bar",
                    type: "action",
                    level2: 1,
                    visitorId: "1234"
                });
                expect(tagMock.prototype.identifiedVisitor.set).toHaveBeenCalledWith({
                    id: "1234"
                });
            });

            it("should track click missing level2 but force 0", function () {
                atInternet.trackClick({
                    name: "bar",
                    type: "action"
                });
                expect(tagMock.prototype.click.send).toHaveBeenCalledWith({
                    name: "bar",
                    type: "action",
                    level2: 0,
                    countryCode: "defaultCountry"
                });
            });

            it("should not track click with invalid type", function () {
                atInternet.trackClick({
                    name: "bar",
                    type: "unknown",
                    level2: 1
                });
                expect(tagMock.prototype.click.send).not.toHaveBeenCalled();
            });

        });

        describe("track order", function () {

            it("track order", function () {
                var order = {
                    name: "productName",
                    page: "pageName",
                    level2: 1,
                    price: 42,
                    quantity: 3
                };

                atInternet.trackOrder(order);

                expect(tagMock.prototype.dispatch).toHaveBeenCalled();
                expect(tagMockPageData).toEqual({ name: order.page, level2: 1 });
                expect(tagMockOrderData.status).toEqual(3);
                expect(tagMockOrderData.amount.amountTaxIncluded).toEqual(order.price * order.quantity);
                expect(tagMockOrderData.amount.amountTaxFree).toBeUndefined();
                expect(tagMockOrderData.turnover).toEqual(order.price * order.quantity);
                expect(tagMockCartData.products.length).toEqual(1);
                expect(tagMockCartData.products[0]).toEqual({
                    product: {
                        productId: order.name,
                        quantity: order.quantity,
                        unitPriceTaxIncluded: order.price
                    }
                });
            });

            it("track order with tax free price", function () {

                var order = {
                    name: "foo",
                    page: "bar",
                    level2: 1,
                    priceTaxFree: 25,
                    quantity: 5
                };

                atInternet.trackOrder(order);

                expect(tagMock.prototype.dispatch).toHaveBeenCalled();
                expect(tagMockPageData).toEqual({ name: order.page, level2: order.level2 });
                expect(tagMockOrderData.status).toEqual(3);
                expect(tagMockOrderData.amount.amountTaxFree).toEqual(order.priceTaxFree * order.quantity);
                expect(tagMockOrderData.amount.amountTaxIncluded).toBeUndefined();
                expect(tagMockOrderData.turnover).toEqual(order.priceTaxFree * order.quantity);
                expect(tagMockCartData.products.length).toEqual(1);
                expect(tagMockCartData.products[0]).toEqual({
                    product: {
                        productId: order.name,
                        quantity: order.quantity,
                        unitPriceTaxFree: order.priceTaxFree
                    }
                });
            });

            it("track order with visitorId", function () {
                atInternet.trackOrder({
                    name: "productName",
                    page: "pageName",
                    level2: 1,
                    visitorId: "1234"
                });

                expect(tagMock.prototype.identifiedVisitor.set).toHaveBeenCalledWith({
                    id: "1234"
                });
            });

            it("should not track order without page attribute", function () {
                atInternet.trackOrder({
                    page: undefined,
                    name: "productName",
                    level2: 1,
                    price: 42
                });
                expect(tagMock.prototype.dispatch).not.toHaveBeenCalled();
            });

            it("should not track order without name attribute", function () {
                atInternet.trackOrder({
                    name: undefined,
                    page: "pageName",
                    level2: 1,
                    price: 42
                });
                expect(tagMock.prototype.dispatch).not.toHaveBeenCalled();
            });

            it("should not track order without price attribute", function () {
                atInternet.trackOrder({
                    price: undefined,
                    name: "productName",
                    page: "pageName",
                    level2: 1
                });
                expect(tagMock.prototype.dispatch).not.toHaveBeenCalled();
            });

            it("should not track order when tracking is not enabled", function () {
                atInternet.setEnabled(false);

                atInternet.trackOrder({
                    name: "productName",
                    page: "pageName",
                    price: 42
                });

                expect(tagMock.prototype.dispatch).not.toHaveBeenCalled();
            });

            it("should track order without level2 attribute but force 0", function () {
                atInternet.trackOrder({
                    name: "productName",
                    page: "pageName",
                    price: 42
                });
                expect(tagMock.prototype.dispatch).toHaveBeenCalled();
                expect(tagMockPageData).toEqual({ name: "pageName", level2: 0 });
            });

            it("should track order with customVars", function () {
                atInternet.trackOrder({
                    name: "productName",
                    page: "pageName",
                    level2: 1,
                    price: 42,
                    countryCode: "FR",
                    currencyCode: "EU",
                    referrerSite: "Site"
                });
                expect(tagMockCustomVarsData.site["2"]).toEqual("[defaultCountry]");
                expect(tagMockCustomVarsData.site["4"]).toEqual("[EU]");
                expect(tagMockCustomVarsData.site["5"]).toEqual("[Site]");
            });
        });

        describe("track event", function () {

            it("track event", function () {


                var event = {
                    name: "productName",
                    page: "pageName",
                    level2: 1,
                    price: 42,
                    countryCode: "FR",
                    currencyCode: "EU",
                    referrerSite: "Site",
                    event: "event"
                };

                atInternet.trackEvent(event);

                expect(tagMockCustomVarsData.site["2"]).toEqual("[defaultCountry]");
                expect(tagMockCustomVarsData.site["4"]).toEqual("[EU]");
                expect(tagMockCustomVarsData.site["5"]).toEqual("[Site]");
                expect(tagMockCustomVarsData.site["6"]).toEqual("[event]");
                expect(tagMock.prototype.dispatch).toHaveBeenCalled();
                expect(tagMockPageData).toEqual({ name: event.page, level2: event.level2 });
            });

            it("should not track event without page attribute", function () {
                atInternet.trackEvent({
                    page: undefined,
                    event: "event"
                });
                expect(tagMock.prototype.dispatch).not.toHaveBeenCalled();
            });

            it("should not track event without event attribute", function () {
                atInternet.trackEvent({
                    event: undefined,
                    page: "page"
                });
                expect(tagMock.prototype.dispatch).not.toHaveBeenCalled();
            });

            it("should not track event when tracking is not enabled", function () {

                atInternet.setEnabled(false);

                atInternet.trackEvent({
                    page: "pageName",
                    event: "event"
                });

                expect(tagMock.prototype.dispatch).not.toHaveBeenCalled();
            });

            it("should track event without level2 attribute but force 0", function () {
                var event = {
                    level2: undefined,
                    page: "pageName",
                    event: "event"
                };

                atInternet.trackEvent(event);

                expect(tagMock.prototype.dispatch).toHaveBeenCalled();
                expect(tagMockPageData).toEqual({ name: event.page, level2: 0 });
            });

        });

    }); // tracking test
});

