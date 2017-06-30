/* jshint jasmine:true */

describe("provider: SidebarMenu", function () {
    "use strict";

    beforeEach(angular.mock.module("templates"));

    beforeEach(module("ovh-angular-sidebar-menu"));

    describe("Initialization", function () {

        var $q;
        var $timeout;
        var translationParts = [];
        var sidebarMenu;
        var sidebarMenuProvider;

        beforeEach(module(function (_SidebarMenuProvider_) {
            sidebarMenuProvider = _SidebarMenuProvider_;
        }));

        beforeEach(inject(function (_SidebarMenu_) {
            sidebarMenu = _SidebarMenu_;
        }));

        beforeEach(inject(function (_$q_, _$timeout_, _$translate_, _$translatePartialLoader_) {
            $q = _$q_;
            $timeout = _$timeout_;
            spyOn(_$translate_, "refresh").and.returnValue(_$q_.when(true));
            spyOn(_$translatePartialLoader_, "addPart").and.callFake(function (part) {
                translationParts.push(part);
            });
        }));

        it("should resolve initialization promise", function () {
            var deferred = $q.defer();
            var initResult = null;
            deferred.resolve("foo");
            sidebarMenu.setInitializationPromise(deferred.promise);
            sidebarMenu.loadInit().then(function (init) {
                initResult = init;
            });
            $timeout.flush();
            expect(initResult).toBe("foo");
        });

        it("should load translations", function () {
            sidebarMenuProvider.addTranslationPath("foo");
            sidebarMenuProvider.addTranslationPath("bar");
            sidebarMenu.setInitializationPromise($q.when(true));
            sidebarMenu.loadInit();
            $timeout.flush();
            expect(translationParts).toContain("foo");
            expect(translationParts).toContain("bar");
        });
    });

    describe("Menu items handling", function () {

        var sidebarMenu;
        var sidebarMenuProvider;
        var $timeout;

        beforeEach(module(function (_SidebarMenuProvider_) {
            sidebarMenuProvider = _SidebarMenuProvider_;
        }));

        beforeEach(inject(function (_SidebarMenu_, _$timeout_) {
            sidebarMenu = _SidebarMenu_;
            $timeout = _$timeout_;
        }));

        it("should add top level menu item", function () {
            sidebarMenu.addMenuItem({ level: 3, id: "foo" });
            sidebarMenu.addMenuItem({ level: 3, id: "bar" });
            expect(sidebarMenu.items.length).toBe(2);
            expect(sidebarMenu.items[0].level).toBe(1);
            expect(sidebarMenu.items[1].level).toBe(1);
            expect(sidebarMenu.items[0].id).toBe("foo");
            expect(sidebarMenu.items[1].id).toBe("bar");
        });

        it("should add child menu item", function () {

            var parentItem = sidebarMenu.addMenuItem({
                id: "hello",
                allowSubItems: true
            });

            var childItemLevel1 = sidebarMenu.addMenuItem({
                id: "world",
                allowSubItems: true
            },parentItem);

            var childItemLevel2 = sidebarMenu.addMenuItem({
                id: "ninja"
            }, childItemLevel1);

            expect(sidebarMenu.items.length).toBe(1);
            expect(parentItem.level).toBe(1);
            expect(childItemLevel1.level).toBe(2);
            expect(childItemLevel2.level).toBe(3);
            expect(parentItem.parentId).toBe(null);
            expect(childItemLevel1.parentId).toBe(parentItem.id);
            expect(childItemLevel2.parentId).toBe(childItemLevel1.id);
        });

        it("should not add child menu item to the DOM is parent item is closed", function () {
            var parentItem = sidebarMenu.addMenuItem({
                id: "hello",
                allowSubItems: true
            });
            var childItemLevel1 = sidebarMenu.addMenuItem({
                id: "world"
            },parentItem);
            expect(parentItem.getSubItems()[0]).toBe(childItemLevel1);
            expect(parentItem.getSubItems().length).toBe(1);
            expect(parentItem.subItems.length).toBe(0);
            expect(parentItem.subItemsPending[0]).toBe(childItemLevel1);
            expect(parentItem.subItemsPending.length).toBe(1);
        });

        it("should add pending menu item to the DOM when parent is opened", function () {
            var parentItem = sidebarMenu.addMenuItem({
                id: "hello",
                allowSubItems: true
            });
            var childItemLevel1 = sidebarMenu.addMenuItem({
                id: "world"
            },parentItem);
            expect(parentItem.getSubItems()[0]).toBe(childItemLevel1);
            expect(parentItem.getSubItems().length).toBe(1);
            expect(parentItem.subItems.length).toBe(0);
            expect(parentItem.subItemsPending[0]).toBe(childItemLevel1);
            expect(parentItem.subItemsPending.length).toBe(1);
            parentItem.toggleOpen();
            $timeout.flush();
            expect(parentItem.subItems.length).toBe(1);
            expect(parentItem.subItems[0]).toBe(childItemLevel1);
            expect(parentItem.subItemsPending.length).toBe(0);
        });

        it("should find item by id", function () {

            var parentItem = sidebarMenu.addMenuItem({
                id: "hello",
                allowSubItems: true
            });

            var childItemLevel1 = sidebarMenu.addMenuItem({
                id: "world",
                allowSubItems: true
            },parentItem);

            var childItemLevel2 = sidebarMenu.addMenuItem({
                id: "ninja"
            }, childItemLevel1);

            expect(sidebarMenu.getItemById("hello")).toBe(parentItem);
            expect(sidebarMenu.getItemById("world")).toBe(childItemLevel1);
            expect(sidebarMenu.getItemById("ninja")).toBe(childItemLevel2);
            expect(sidebarMenu.getItemById("pirate")).not.toBeDefined();
        });

        it("should find item path", function () {
            var A = sidebarMenu.addMenuItem({ id: "A", allowSubItems: true });
            var AB = sidebarMenu.addMenuItem({ id: "AB", allowSubItems: true }, A);
            var ABC = sidebarMenu.addMenuItem({ id: "ABC", allowSubItems: true }, AB);
            var ABD = sidebarMenu.addMenuItem({ id: "ABD", allowSubItems: true }, AB);
            var ABCE = sidebarMenu.addMenuItem({ id: "ABCE", allowSubItems: true }, ABC);
            var ABCEF = sidebarMenu.addMenuItem({ id: "ABCEF", allowSubItems: true }, ABCE);
            var ABDG = sidebarMenu.addMenuItem({ id: "ABDG", allowSubItems: true }, ABD);
            var ABDH = sidebarMenu.addMenuItem({ id: "ABDH", allowSubItems: true }, ABD);
            var orphan = {};

            expect(sidebarMenu.getPathToMenuItem(A).path).toEqual([A]);
            expect(sidebarMenu.getPathToMenuItem(AB).path).toEqual([A, AB]);
            expect(sidebarMenu.getPathToMenuItem(ABC).path).toEqual([A, AB, ABC]);
            expect(sidebarMenu.getPathToMenuItem(ABD).path).toEqual([A, AB, ABD]);
            expect(sidebarMenu.getPathToMenuItem(ABCE).path).toEqual([A, AB, ABC, ABCE]);
            expect(sidebarMenu.getPathToMenuItem(ABCEF).path).toEqual([A, AB, ABC, ABCE, ABCEF]);
            expect(sidebarMenu.getPathToMenuItem(ABDG).path).toEqual([A, AB, ABD, ABDG]);
            expect(sidebarMenu.getPathToMenuItem(ABDH).path).toEqual([A, AB, ABD, ABDH]);
            expect(sidebarMenu.getPathToMenuItem(orphan).path).toEqual([]);
        });

        it("should get all menu items", function () {
            var A = sidebarMenu.addMenuItem({ id: "A", allowSubItems: true });
            var AB = sidebarMenu.addMenuItem({ id: "AB", allowSubItems: true }, A);
            var ABC = sidebarMenu.addMenuItem({ id: "ABC", allowSubItems: true }, AB);
            var ABD = sidebarMenu.addMenuItem({ id: "ABD", allowSubItems: true }, AB);
            var items = sidebarMenu.getAllMenuItems();
            expect(items).toContain(A);
            expect(items).toContain(AB);
            expect(items).toContain(ABC);
            expect(items).toContain(ABD);
            expect(items.length).toBe(4);
        });

        it("should manage active menu item", function () {
            var cool = sidebarMenu.addMenuItem({ id: "cool", state: true, isActive: false });
            var kiss = sidebarMenu.addMenuItem({ id: "kiss", state: true, isActive: false });
            var frog = sidebarMenu.addMenuItem({ id: "frog", state: true, isActive: false });
            sidebarMenu.manageActiveMenuItem(cool);
            expect(cool.isActive).toBe(true);
            expect(kiss.isActive).toBe(false);
            expect(frog.isActive).toBe(false);
            sidebarMenu.manageActiveMenuItem(kiss);
            expect(cool.isActive).toBe(false);
            expect(kiss.isActive).toBe(true);
            expect(frog.isActive).toBe(false);
            sidebarMenu.manageActiveMenuItem(frog);
            expect(cool.isActive).toBe(false);
            expect(kiss.isActive).toBe(false);
            expect(frog.isActive).toBe(true);
        });

    });

    describe("State management", function () {

        var sidebarMenu;
        var sidebarMenuProvider;
        var $timeout;

        beforeEach(module(function (_SidebarMenuProvider_) {
            sidebarMenuProvider = _SidebarMenuProvider_;
        }));

        beforeEach(inject(function (_SidebarMenu_, _$timeout_, _$state_, _$q_, _$translate_) {
            sidebarMenu = _SidebarMenu_;
            $timeout = _$timeout_;
            spyOn(_$state_, "includes").and.callFake(function (state) {
                return "a.b.c".indexOf(state) >= 0;
            });
            spyOn(_$state_, "is").and.callFake(function (state) {
                return "a.b.c" === state;
            });
            spyOn(_$translate_, "refresh").and.returnValue(_$q_.when(true));
        }));

        describe("an active state", function () {
          var A;
          var AB;
          var ABC;
          var ABD;
          var ABCE;

          beforeEach(function(){
            A = sidebarMenu.addMenuItem({ id: "A", state: "a", allowSubItems: true });
            AB = sidebarMenu.addMenuItem({ id: "AB", state: "a.b", allowSubItems: true }, A);
            ABC = sidebarMenu.addMenuItem({ id: "ABC", state: "a.b.c",  allowSubItems: true }, AB);
            ABD = sidebarMenu.addMenuItem({ id: "ABD", state: "a.b.d", allowSubItems: true }, AB);
            ABCE = sidebarMenu.addMenuItem({ id: "ABCE", state: "a.b.c.e",  allowSubItems: true }, ABC);
            sidebarMenu.manageStateChange();
            $timeout.flush();
          });

          it("should have parents state that are opened", function () {
              expect(A.isOpen).toBe(true);
              expect(AB.isOpen).toBe(true);
              expect(ABC.isActive).toBe(true);
          });

          it("Should have sibling states that are not active", function () {
              expect(ABC.isActive).toBe(true);
              expect(ABD.isOpen).toBe(false);
              expect(ABD.isActive).toBe(false);
          });

          it("Should be opened if active", function(){
            expect(ABC.isOpen).toBe(true);
            expect(ABC.isActive).toBe(true);
          });

          it("Should not have its child opened or active", function () {
              expect(ABCE.isOpen).toBe(false);
              expect(ABCE.isActive).toBe(false);
          });
        });



        it("should manage state change after loading", function () {
            sidebarMenu.setInitializationPromise($timeout(angular.noop, 100));
            var A = sidebarMenu.addMenuItem({ id: "A", state: "a", allowSubItems: true });
            var AB = sidebarMenu.addMenuItem({ id: "AB", state: "a.b", allowSubItems: true }, A);
            sidebarMenu.addMenuItem({ id: "ABC", state: "a.b.c",  allowSubItems: true }, AB);
            sidebarMenu.loadInit();
            expect(A.isOpen).toBe(false);
            $timeout.flush();
            expect(A.isOpen).toBe(true);
        });
    });
});
