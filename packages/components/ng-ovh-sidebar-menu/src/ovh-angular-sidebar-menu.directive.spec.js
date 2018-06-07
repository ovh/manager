/* jshint jasmine:true */

describe("directive: sidebarMenu", function () {
    "use strict";

    var $compile;
    var $rootScope;
    var $scope;
    var $httpBackend;
    var $q;
    var elem;
    var SidebarMenu;
    var elems = {};

    beforeEach(angular.mock.module("sidebarMenuMock"));

    beforeEach(angular.mock.inject(function (_$rootScope_, _$compile_, _$httpBackend_, _$q_, _SidebarMenu_) {
        $scope = _$rootScope_.$new();
        $httpBackend = _$httpBackend_;
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $q = _$q_;
        SidebarMenu = _SidebarMenu_;

        elem = $("<div>").prependTo("body");
        $scope.$digest();
    }));

    afterEach(function () {
        $scope.$destroy();
        elem.remove();
    });

    /*----------  TEMPLATES DECLARATION  ----------*/

    var templates = {
        default: {
            element: "<div data-sidebar-menu></div>"
        },
        asElement: {
            element: "<sidebar-menu></sidebar-menu>"
        }
    };

    function compileDirective (template, locals) {
        template = templates[template];
        angular.extend($scope, angular.copy(template.scope) || angular.copy(templates["default"].scope), locals);
        var element = $(template.element).appendTo(elem);
        element = $compile(element)($scope);
        $scope.$digest();
        return jQuery(element[0]);
    }

    // ---

    describe("Initialization", function () {

        it("should load the directive as attribute", function () {
            var compiledElem = compileDirective("default");
            expect(compiledElem.attr("id")).toBe("sidebar-menu");
        });

        it("should load the directive and show a button", function () {
            var compiledElem = compileDirective("default");
            $httpBackend.flush();
            expect(compiledElem.find(".actions-menu-button").length).toEqual(1);
        });

        it("should not load the directive as element", function () {
            var compiledElem = compileDirective("asElement");
            expect(compiledElem.attr("id")).toBeUndefined();
        });

    });

    describe("Load directive and play with items", function () {

        var $timeout;

        beforeEach(angular.mock.inject(function (_$timeout_) {
            $timeout = _$timeout_;

            elems["item-1"] = SidebarMenu.addMenuItem({
                title: "Item 1",
                category: "my-category",
                icon: "my-ovh-font-icon",
                allowSubItems: true,
                loadOnState: "freefax"
            });

            elems["item-2"] = SidebarMenu.addMenuItem({
                title: "Item 2",
                category: "other-category",
                icon: "other-category",
                allowSubItems: true,
                loadOnState: "freefax"
            });

            elems["item-3"] = SidebarMenu.addMenuItem({
                title: "Item 3",
                loadOnState: "task",
                state: "task"
            });
        }));

        it("should load the directive with 3 first level entries", function () {
            var compiledElem = compileDirective("default");
            var firstLevelDomItem;
            $httpBackend.flush();
            firstLevelDomItem = compiledElem.find(".sidebar-menu-list");

            expect(firstLevelDomItem.hasClass("menu-level-1")).toBe(true);
            expect(firstLevelDomItem.find("> li.item-container").length).toEqual(3);
        });

        it("should add sub items to elements and show them when clicking", function () {
            var compiledElem;
            var lvl1FirstItem;
            var lvl1SecondItem;
            var lvl1ThirdItem;

            // add sub items to first elem when loaded
            elems["item-1"].onLoad = function () {
                return $q.when(true).then(function () {
                    elems["item-1"].addSubItems([{
                        title: "Item 1.1",
                        state: "myState1-1"
                    }, {
                        title: "Item 1.2",
                        state: "myState1-2"
                    }, {
                        title: "Item 1.3",
                        state: "myState1-3"
                    }, {
                        title: "Item 1.4",
                        state: "myState1-4"
                    }]);
                });
            };

            // add sub item to second elem when loaded
            elems["item-2"].onLoad = function () {
                return $q.when(true).then(function () {
                    elems["item-2"].addSubItems([{
                        title: "Item 2.1",
                        state: "myState2-1"
                    }, {
                        title: "Item 2.2",
                        state: "myState2-2"
                    }]);
                });
            };

            compiledElem = compileDirective("default");
            $scope.$digest();
            $httpBackend.flush();
            lvl1FirstItem = compiledElem.find(".sidebar-menu-list").find("> li.item-container").eq(0);
            lvl1SecondItem = compiledElem.find(".sidebar-menu-list").find("> li.item-container").eq(1);
            lvl1ThirdItem = compiledElem.find(".sidebar-menu-list").find("> li.item-container").eq(2);

            // clicking on first item
            lvl1FirstItem.find(".menu-item").click();
            $scope.$digest();
            $timeout.flush();

            expect(elems["item-1"].hasSubItems()).toBe(true);
            expect(lvl1FirstItem.find(".menu-sub-items ul li").length).toEqual(4);
            expect(lvl1FirstItem.hasClass("open")).toBe(true);

            // clicking on second item
            lvl1SecondItem.find(".menu-item").click();
            $scope.$digest();
            $timeout.flush();

            expect(elems["item-1"].hasSubItems()).toBe(true);                         // item-1 should still have subItems
            expect(elems["item-2"].hasSubItems()).toBe(true);
            expect(lvl1SecondItem.find(".menu-sub-items ul li").length).toEqual(2);
            expect(lvl1FirstItem.hasClass("active")).toBe(false);
            expect(lvl1FirstItem.hasClass("open")).toBe(false);                         // active and open state must be changed
            expect(lvl1SecondItem.hasClass("open")).toBe(true);

            // clicking on third item
            lvl1ThirdItem.find(".menu-item").click();
            $scope.$digest();

            expect(elems["item-1"].hasSubItems()).toBe(true);                         // item-1 should still have subItems
            expect(elems["item-2"].hasSubItems()).toBe(true);                         // item-2 should still have subItems
            expect(elems["item-3"].hasSubItems()).toBe(false);
            expect(lvl1ThirdItem.find(".menu-sub-items ul li").length).toEqual(0);
            expect(lvl1FirstItem.hasClass("open")).toBe(false);
            expect(lvl1SecondItem.hasClass("open")).toBe(false);                        // active and open state must be changed
            expect(lvl1ThirdItem.hasClass("open")).toBe(false);
        });

        it("should not add sub item to third element", function () {
            var compiledElem;
            var lvl1ThirdItem;

            compiledElem = compileDirective("default");
            $scope.$digest();
            $httpBackend.flush();
            lvl1ThirdItem = compiledElem.find(".sidebar-menu-list").find("> li.item-container").eq(2);

            lvl1ThirdItem.find(".menu-item").click();
            $scope.$digest();

            expect(elems["item-3"].hasSubItems()).toBe(false);
            expect(lvl1ThirdItem.find(".menu-sub-items ul li").length).toEqual(0);
        });

    });

    describe("Action menu", function () {
        var clickSpy;
        var compiledElem;
        var itemId = "itemId";

        beforeEach(function () {
            clickSpy = jasmine.createSpy("clickSpy");

            SidebarMenu.addActionsMenuOptions([{
                id: itemId,
                title: "Item title",
                icon: "Item icon",
                href: "https://foo.bar/"
            }]);

            SidebarMenu.addActionsMenuItemClickHandler(clickSpy);

            compiledElem = compileDirective("default");

            $scope.$digest();
            $httpBackend.flush();
        });

        it("should display actions menu", function () {
            var actionsMenuItems = compiledElem.find("actions-menu button");

            expect(actionsMenuItems.length).toEqual(1);
        });

        it("should call click handler", function () {
            var actionsMenu = compiledElem.find("actions-menu button.actions-menu-button");
            actionsMenu.click();
            $scope.$digest();

            var leftPage = actionsMenu.next(".responsive-popover").find(".actions-menu-page.main-page");

            leftPage.find(".actions-list-item").eq(0).find(".actions-menu-item-link").click();
            $scope.$digest();

            expect(clickSpy).toHaveBeenCalledWith(itemId);
        });
    });

    describe("Allowing search items", function () {

        beforeEach(angular.mock.inject(function () {
            elems["item-1"] = SidebarMenu.addMenuItem({
                title: "Item 1",
                category: "my-category",
                icon: "my-ovh-font-icon",
                allowSubItems: true,
                loadOnState: "freefax",
                onLoad: function () {
                    return $q.when(true).then(function () {
                        for (var i = 0 ; i < 20 ; i++) {
                            elems["item-1"].addSubItem([{
                                title: "Item 1." + i,
                                state: "myState1-" + i
                            }]);
                        }
                    });
                }
            });

            elems["item-2"] = SidebarMenu.addMenuItem({
                title: "Item 2",
                category: "other-category",
                icon: "other-category",
                allowSubItems: true,
                loadOnState: "freefax",
                allowSearch: true,
                onLoad: function () {
                    return $q.when(true).then(function () {
                        for (var i = 0 ; i < 20 ; i++) {
                            elems["item-2"].addSubItem([{
                                title: "Item 2." + i,
                                state: "myState2-" + i
                            }]);
                        }
                    });
                }
            });

            elems["item-3"] = SidebarMenu.addMenuItem({
                title: "Item 3",
                loadOnState: "task",
                state: "task"
            });
        }));

        it("should display a search input when item 2 is opened", function () {
            var compiledElem = compileDirective("default");

            $scope.$digest();
            $httpBackend.flush();

            var item1El = compiledElem.find(".sidebar-menu-list > li.item-container").eq(0);
            var item2El = compiledElem.find(".sidebar-menu-list > li.item-container").eq(1);

            // clicking on second item
            item2El.find(".menu-item").click();
            elems["item-2"].appendPendingListItems(); // subItems are async
            $scope.$digest();

            expect(item2El.find(".group-search").length).toBe(1);

            // clicking on first item
            item2El.find(".menu-item").click();
            $scope.$digest();
            expect(item1El.find(".group-search").length).toBe(0);
        });
    });

});
