describe("directive: paginationFront", function () {
    "use strict";

    var $compile;
    var $rootScope;
    var $scope;
    var $httpBackend;
    var $q;
    var elem;
    var elems = {};

    //beforeEach(angular.mock.module("sidebarMenuMock"));

    beforeEach(angular.mock.inject(function (_$rootScope_, _$compile_, _$httpBackend_, _$q_) {
        $scope = _$rootScope_.$new();
        $httpBackend = _$httpBackend_;
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $q = _$q_;

        elem = $("<div>").prependTo("body");
        $scope.$digest();
    }));

    describe("Test", function () {

       it("should prove that test running...", function () {
           expect(true).not.toBeFalsy();
       });

   });
});
