"use strict";

describe("track", function () {

    var atInternet;
    var $compile;
    var $scope;
    var DEFAULT_TYPE = "action";

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

    it("Should send specified track name when specified event raised", function () {
        var elementId = "id1";
        var eventToTrack = "click";
        var trackName = "name";
        var element = compileDirective("<button id='" + elementId + "' track-on='" + eventToTrack + "' track-name='{{trackName}}'></button>", { trackName: trackName });

        element.click();

        expect(atInternet.trackClick).toHaveBeenCalledWith({
            name: trackName,
            type: DEFAULT_TYPE
        });
    });

    it("Should send specified track name when it changes after compiling", function () {
        var elementId = "id1";
        var eventToTrack = "click";
        var trackName = "name";
        var element = compileDirective("<button id='" + elementId + "' track-on='" + eventToTrack + "' track-name='{{trackName}}'></button>");
        $scope.trackName = trackName;

        $scope.$apply();
        element.click();

        expect(atInternet.trackClick).toHaveBeenCalledWith({
            name: trackName,
            type: DEFAULT_TYPE
        });
    });

    it("Should send specified track type when specified event raised", function () {
        var elementId = "id1";
        var eventToTrack = "click";
        var trackType = "type";
        var element = compileDirective("<button id='" + elementId + "' track-on='" + eventToTrack + "' + track-type='" + trackType + "'></button>");

        element.click();

        expect(atInternet.trackClick).toHaveBeenCalledWith({
            name: elementId + "-" + eventToTrack,
            type: trackType
        });
    });

    it("Should send element id and event name when specified event raised without a specified track name", function () {
        var elementId = "id1";
        var eventToTrack = "click";
        var element = compileDirective("<button id='" + elementId + "' track-on='" + eventToTrack + "'></button>");

        element.click();

        expect(atInternet.trackClick).toHaveBeenCalledWith({
            name: elementId + "-" + eventToTrack,
            type: DEFAULT_TYPE
        });
    });

});

