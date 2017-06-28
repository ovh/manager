"use strict";

describe("ovh-angular-responsive-tabs", function () {

    var $compile,
        $rootScope,
        $scope,
        elem,
        _locationProvider;

    beforeEach(angular.mock.module("templates"));
    beforeEach(angular.mock.module("ngSanitize"));
    beforeEach(angular.mock.module("ui.bootstrap"));
    beforeEach(angular.mock.module("ui.router"));
    beforeEach(angular.mock.module("ovh-angular-responsive-tabs"));

    beforeEach(angular.mock.module(function ($stateProvider, $locationProvider) {
        _locationProvider = $locationProvider;

        $stateProvider
            .state("main", {
                url: "",
                template: '<div id="tabs"></div>' +
                          '<div id="content"><ui-view></ui-view></div>'
            }).state("main.one", {
                url: "/one",
                template: "<span>one</span>"
            }).state("main.two", {
                url: "/two",
                template: "<span>two</span>"
            });

    }));

    beforeEach(angular.mock.inject(function (_$rootScope_, _$compile_) {
        $scope = _$rootScope_.$new();
        $compile = _$compile_;
        $rootScope = _$rootScope_;

        elem = $compile("<div><ui-view></ui-view></div>")($scope).prependTo("body");
        $scope.$digest();
    }));

    afterEach(function () {
        $scope.$destroy();
        elem.remove();
    });


    var templates = {
        "default": {
            element: "<responsive-tabs>" +
                         '<responsive-tab state="main.one">tab_1</responsive-tab>' +
                         '<responsive-tab state="main.two">tab_2</responsive-tab>' +
                         "<responsive-tab-more>" +
                             "<span>...</span>" +
                         "</responsive-tab-more>" +
                     "</responsive-tabs>"
        },
        withSecondElementCanBeDisabled: {
            element: "<responsive-tabs>" +
                         '<responsive-tab state="main.one">tab_1</responsive-tab>' +
                         '<responsive-tab state="main.two" disabled="isDisabled">tab_2</responsive-tab>' +
                         "<responsive-tab-more>" +
                             "<span>...</span>" +
                         "</responsive-tab-more>" +
                     "</responsive-tabs>",
            scope: {
                isDisabled: false
            }
        },
        withOnSelectFunction: {
            element: "<responsive-tabs>" +
                         '<responsive-tab data-state="main.one" data-dropdown-title=tab_1"">tab_1</responsive-tab>' +
                         '<responsive-tab data-state="main.two" data-dropdown-title=tab_2" select="callMe()">tab_2</responsive-tab>' +
                         "<responsive-tab-more>" +
                             "<i>...</i>" +
                         "</responsive-tab-more>" +
                     "</responsive-tabs>"
        },
        withStyle: {
            element: '<responsive-tabs style="width: 80px">' +
                         '<responsive-tab state="main.one" style="width: 30px">tab_1</responsive-tab>' +
                         '<responsive-tab state="main.two" style="width: 30px">tab_2</responsive-tab>' +
                         '<responsive-tab-more style="width: 30px">' +
                             "<span>...</span>" +
                         "</responsive-tab-more>" +
                     "</responsive-tabs>"
        },
        withStyleAndCustomDropdownTitle: {
            element: '<responsive-tabs style="width: 80px">' +
                         '<responsive-tab state="main.one" style="width: 30px">tab_1</responsive-tab>' +
                         '<responsive-tab state="main.two" style="width: 30px" dropdown-title="tab_alt">tab_2</responsive-tab>' +
                         '<responsive-tab-more style="width: 30px">' +
                             "<span>...</span>" +
                         "</responsive-tab-more>" +
                     "</responsive-tabs>"
        }
    };

    function compileDirective (template, locals) {
        template = templates[template];
        angular.extend($scope, angular.copy(template.scope) || angular.copy(templates.default.scope), locals);
        var element = $(template.element).appendTo(elem.find("#tabs"));
        element = $compile(element)($scope);
        $scope.$digest();
        return element;
    }

    // ---

    describe("pre-testing", function () {
        it("should load ui-router and go to main view", angular.mock.inject(function ($state) {

            $state.go("main");
            $scope.$digest();

            expect($state.$current.name).toBe("main");
            expect($state.is("main")).toBeTruthy();
            expect(elem.find("#tabs").text()).toBe("");

        }));
    });


    // ---


    describe("Testing the main directive reactivity", function () {

        it("should load the default directive", angular.mock.inject(function ($state) {

            $state.go("main");
            $scope.$digest();

            compileDirective("default");

            // have main elem
            expect(elem.find("#tabs").children().hasClass("tab-container")).toBeTruthy();

            var nav = elem.find("#tabs ul.nav");

            // count li
            expect(nav.find("> li").length).toEqual(3);

            // lastchild = response-tab-more
            expect(nav.find("> li:last-child").hasClass("tab-more")).toBeTruthy();

        }));

        it("should select the good tab on state change with ui.view updated", angular.mock.inject(function ($state) {

            $state.go("main");
            $scope.$digest();

            compileDirective("default");

            // one

            $state.go("main.one");
            $scope.$digest();

            expect($state.is("main.one")).toBeTruthy();
            expect(elem.find("#tabs ul.nav > li:eq(1)").hasClass("active")).toBeFalsy();
            expect(elem.find("#content").text()).toBe("one");

            // two

            $state.go("main.two");
            $scope.$digest();

            expect($state.is("main.two")).toBeTruthy();
            expect(elem.find("#tabs ul.nav > li:eq(0)").hasClass("active")).toBeFalsy();
            expect(elem.find("#content").text()).toBe("two");

        }));

        it("should change the $state when click on tabs", angular.mock.inject(function ($state) {

            $state.go("main");
            $scope.$digest();

            compileDirective("default");

            expect($state.is("main")).toBeTruthy();

            // one

            elem.find("#tabs ul.nav > li:eq(0) > a").trigger("click");
            expect($state.is("main.one")).toBeTruthy();
            expect(elem.find("#tabs ul.nav > li:eq(0)").hasClass("active")).toBeTruthy();
            expect(elem.find("#tabs ul.nav > li:eq(1)").hasClass("active")).toBeFalsy();
            expect(elem.find("#content").text()).toBe("one");

            // two

            elem.find("#tabs ul.nav > li:eq(1) > a").trigger("click");
            expect($state.is("main.two")).toBeTruthy();
            expect(elem.find("#tabs ul.nav > li:eq(0)").hasClass("active")).toBeFalsy();
            expect(elem.find("#tabs ul.nav > li:eq(1)").hasClass("active")).toBeTruthy();
            expect(elem.find("#content").text()).toBe("two");
        }));

        it("should disable the second tab via the user scope", angular.mock.inject(function ($state) {

            $state.go("main");
            $scope.$digest();

            compileDirective("withSecondElementCanBeDisabled");

            expect(elem.find("#tabs ul.nav > li:eq(1)").hasClass("disabled")).toBeFalsy();

            $scope.isDisabled = true;
            $scope.$digest();

            expect(elem.find("#tabs ul.nav > li:eq(1)").hasClass("disabled")).toBeTruthy();

        }));

        it("should call a custom function when a tab is clicked", angular.mock.inject(function ($state) {

            $state.go("main");
            $rootScope.$apply();

            var isCalled = false;

            compileDirective("withOnSelectFunction", {
                callMe: function () {
                    isCalled = true;
                }
            });

            $state.go("main.one");
            $scope.$digest();

            elem.find("#tabs ul.nav > li:eq(1) > a").trigger("click");

            expect(isCalled).toBeTruthy();

        }));
    });


    // ---


    describe("Testing the responsive", function () {

        it('should hide second tab after a resize, and show it in tab "more"', angular.mock.inject(function ($state) {

            $state.go("main");
            $scope.$digest();

            compileDirective("withStyle");

            $state.go("main.one");
            $scope.$digest();

            var tab1 = elem.find("#tabs ul.nav > li:eq(0)");
            var tab2 = elem.find("#tabs ul.nav > li:eq(1)");
            var tabMore = elem.find("#tabs ul.nav > li.tab-more");

            // Tab 2 is hidden
            expect(tab2.hasClass("hidden")).toBeTruthy();

            // Tab more is shown
            expect(tabMore.hasClass("hidden")).toBeFalsy();

            // Tab 2 is shown in dropdown
            expect(tabMore.find("li").length).toEqual(1);

            // The elem in dropdown is really the Tab 2
            expect(tabMore.find("li > a").text()).toBe("tab_2");

        }));

        it('should hide first tab after a resize, and show it in tab "more", because second tab is active', angular.mock.inject(function ($state) {

            $state.go("main");
            $scope.$digest();

            compileDirective("withStyle");

            $state.go("main.two");
            $scope.$digest();

            var tab1 = elem.find("#tabs ul.nav > li:eq(0)");
            var tab2 = elem.find("#tabs ul.nav > li:eq(1)");
            var tabMore = elem.find("#tabs ul.nav > li.tab-more");

            // Tab 1 is hidden
            expect(tab1.hasClass("hidden")).toBeTruthy();

            // Tab more is shown
            expect(tabMore.hasClass("hidden")).toBeFalsy();

            // Tab 1 is shown in dropdown
            expect(tabMore.find("li").length).toEqual(1);

            // The elem in dropdown is really the Tab 1
            expect(tabMore.find("li > a").text()).toBe("tab_1");

        }));

        it('should display the "more" dropdown', angular.mock.inject(function ($state) {

            $state.go("main");
            $scope.$digest();

            compileDirective("withStyle");

            $state.go("main.one");
            $scope.$digest();

            var tab1 = elem.find("#tabs ul.nav > li:eq(0)");
            var tab2 = elem.find("#tabs ul.nav > li:eq(1)");
            var tabMore = elem.find("#tabs ul.nav > li.tab-more");

            // Tab more is shown
            expect(tabMore.hasClass("hidden")).toBeFalsy();

            tabMore.find("a[dropdown-toggle]").trigger("click");

            // Dropdown is shown
            expect(tabMore.hasClass("open")).toBeTruthy();

        }));

        it('should select a tab in the "more" dropdown, and update the view', angular.mock.inject(function ($state) {

            $state.go("main");
            $scope.$digest();

            compileDirective("withStyle");

            $state.go("main.one");
            $scope.$digest();

            var tab1 = elem.find("#tabs ul.nav > li:eq(0)");
            var tab2 = elem.find("#tabs ul.nav > li:eq(1)");
            var tabMore = elem.find("#tabs ul.nav > li.tab-more");

            // Tab 2 is shown in dropdown at this moment
            expect(tabMore.find("li").length).toEqual(1);

            // Show dropdown
            tabMore.find("a[dropdown-toggle]").trigger("click");

            // Click on the tab in the dropdown
            tabMore.find("ul.dropdown-menu > li:first-child > a").trigger("click");

            // We are now in the second view
            expect($state.is("main.two")).toBeTruthy();

            // Tab 2 is active and shown in main tabs
            expect(tab2.hasClass("active")).toBeTruthy();
            expect(tab2.hasClass("hidden")).toBeFalsy();

            // ... and tab 1 is hidden and now in the "more" dropdown
            expect(tab1.hasClass("hidden")).toBeTruthy();
            expect(tabMore.find("ul.dropdown-menu > li:first-child > a").text()).toBe("tab_1");

        }));

        it('should hide second tab after a resize, and show it in tab "more", with a custom HTML', angular.mock.inject(function ($state) {

            $state.go("main");
            $scope.$digest();

            compileDirective("withStyleAndCustomDropdownTitle");

            $state.go("main.one");
            $scope.$digest();

            var tab1 = elem.find("#tabs ul.nav > li:eq(0)");
            var tab2 = elem.find("#tabs ul.nav > li:eq(1)");
            var tabMore = elem.find("#tabs ul.nav > li.tab-more");

            // Tab 2 is shown in dropdown
            expect(tabMore.find("li").length).toEqual(1);

            // The elem in dropdown is shown with an alt text
            expect(tabMore.find("li > a").html()).toBe("tab_alt");

        }));

    });

});
