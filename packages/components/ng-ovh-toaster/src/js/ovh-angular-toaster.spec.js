"use strict";

describe("toaster", function () {

    var $scope;
    var $toast;
    var myToastProvider;

    beforeEach(function () {

        angular.mock.module("ovh-angular-toaster", function (ToastProvider) {
            myToastProvider = ToastProvider;
        });

    });

    beforeEach(angular.mock.inject(function (_$rootScope_, _Toast_) {
        $scope = _$rootScope_.$new();
        $toast = _Toast_;

        $scope.$digest();
    }));

    afterEach(function () {
        $scope.$digest();
        $scope.$destroy();
        new Messenger().hideAll();
    });

    describe("service", function () {

        var message = "test";
        var params;

        function getParams (type, msg, opts, id) {
            var ret = {
                type: type,
                id: id,
                message: msg,
                hideAfter: 7,
                showCloseButton: true
            };
            return angular.extend(opts, ret);
        }

        beforeEach(function () {
            spyOn(Messenger(), "post");
            params = { param: "test" };
        });

        it("should show success message", function () {
            params.id = 1;
            $toast.success(message, params);
            $scope.$digest();
            expect(Messenger().post).toHaveBeenCalledWith(getParams("success", message, params, 1));
        });

        it("should show error message", function () {
            params.id = 2;
            $toast.error(message, params);
            $scope.$digest();
            expect(Messenger().post).toHaveBeenCalledWith(getParams("error", message, params, 2));
        });

        it("should show info message", function () {
            params.id = 3;
            $toast.info(message, params);
            $scope.$digest();
            expect(Messenger().post).toHaveBeenCalledWith(getParams("info", message, params, 3));
        });

        it("should call update, show or hide on current instance", function () {
            var mock = jasmine.createSpyObj("Mock", ["update", "hide", "show"]);

            $toast.update(mock, message, params);
            expect(mock.update).toHaveBeenCalledWith(message, params);

            $toast.show(mock);
            expect(mock.show).toHaveBeenCalled();

            $toast.hide(mock);
            expect(mock.hide).toHaveBeenCalled();
        });

        it('should send "hideAll" action to Messenger', function () {
            spyOn(Messenger(), "hideAll");

            $toast.hideAll(message, params);

            expect(Messenger().hideAll).toHaveBeenCalled();
        });

        describe("test configuration of provider", function () {

            var oldValue = "toto";
            var newValue = "tata";

            it("should change theme when setTheme is called", function () {
                Messenger.options.theme = oldValue;
                myToastProvider.setTheme(newValue);

                expect(Messenger.options.theme).toEqual(newValue);
                expect(Messenger.options.theme).not.toEqual(oldValue);
            });

            it("should change hideAfter duration when setHideAfter is called", function () {
                Messenger.options.theme = oldValue;
                var newHideAfter = 42;
                var paramsMessenger = getParams("success", message, params);

                params.hideAfter = newHideAfter;
                myToastProvider.setHideAfter(newHideAfter);

                $toast.success(message, params);
                expect(Messenger().post).toHaveBeenCalledWith(paramsMessenger);

            });


            it("should change css classes when setExtraClasses is called", function () {
                Messenger.options.extraClasses = oldValue;
                myToastProvider.setExtraClasses(newValue);

                expect(Messenger.options.extraClasses).toEqual(newValue);
                expect(Messenger.options.extraClasses).not.toEqual(oldValue);
            });
        });


    });

});
