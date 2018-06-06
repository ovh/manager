describe("factory: SidebarMenuListItem", function () {
    "use strict";

    var SidebarMenuListItem;

    beforeEach(module("ovh-angular-sidebar-menu"));

    beforeEach(inject(function (_SidebarMenuListItem_) {
        SidebarMenuListItem = _SidebarMenuListItem_;
    }));

    describe("Toggling", function () {

        it("should not be opened by default", function () {
            var factory = new SidebarMenuListItem();
            expect(factory.isOpen).toBe(false);
        });

        it("should not toggle with empty subItems", function () {
            var factory = new SidebarMenuListItem();
            expect(factory.isOpen).toBe(false);
            factory.toggleOpen();
            expect(factory.isOpen).toBe(false);
        });

        it("should toggle with subItems", function () {
            var factory = new SidebarMenuListItem({
                allowSubItems: true
            });
            factory.addSubItem({ foo: "bar" });
            expect(factory.isOpen).toBe(false);
            factory.toggleOpen();
            expect(factory.isOpen).toBe(true);
        });
    });

    describe("SubItems adding", function () {

        it("should be empty of subItems when created", function () {
            var factory = new SidebarMenuListItem();
            expect(factory.hasSubItems()).toBe(false);
        });

        it("should add subItems with allowSubItems enabled", function () {
            var factory = new SidebarMenuListItem({ allowSubItems: true });
            for (var i = 0; i < 42; i++) {
                factory.addSubItem({ foo: "bar" });
            }
            expect(factory.getSubItems().length).toEqual(42);
            expect(factory.hasSubItems()).toBe(true);
        });

        it("should add list of subItems with allowSubItems enabled", function () {
            var factory = new SidebarMenuListItem({ allowSubItems: true });
            var subItemsList = [];
            for (var i = 0; i < 42; i++) {
                subItemsList.push({ foo: "bar" });
            }
            factory.addSubItems(subItemsList);
            expect(factory.getSubItems().length).toEqual(42);
            expect(factory.hasSubItems()).toBe(true);
        });

        it("should not add subItems with allowSubItems disabled", function () {
            var factory = new SidebarMenuListItem({ allowSubItems: false });
            for (var i = 0; i < 5; i++) {
                factory.addSubItem({ foo: "bar" });
            }
            expect(factory.subItems.length).toEqual(0);
            expect(factory.hasSubItems()).toBe(false);
        });

        it("should not add list of subItems with allowSubItems disabled", function () {
            var factory = new SidebarMenuListItem({ allowSubItems: false });
            var subItemsList = [];
            for (var i = 0; i < 42; i++) {
                subItemsList.push({ foo: "bar" });
            }
            factory.addSubItems(subItemsList);
            expect(factory.subItems.length).toEqual(0);
            expect(factory.hasSubItems()).toBe(false);
        });
    });

    describe("SubItems loading", function () {

        var $q;
        var $timeout;

        beforeEach(inject(function (_$q_, _$timeout_) {
            $q = _$q_;
            $timeout = _$timeout_;
        }));

        it("should load subItems", function () {
            var resolvedResult = null;
            var subItems = ["foo", "bar"];
            var factory = new SidebarMenuListItem({
                allowSubItems: true,
                onLoad: function () {
                    return $q.when(subItems);
                }
            });
            var promise = factory.loadSubItems();
            promise.then(function (result) {
                resolvedResult = result;
            });
            $timeout.flush();
            expect(resolvedResult).toEqual(subItems);
        });

        it("should not load subItems if loading is pending", function () {
            var resolvedResult1 = null;
            var resolvedResult2 = null;
            var subItems = ["foo", "bar"];
            var factory = new SidebarMenuListItem({
                allowSubItems: true,
                onLoad: function () {
                    var deferred = $q.defer();
                    deferred.resolve(subItems);
                    return deferred.promise;
                }
            });
            var promise1 = factory.loadSubItems();
            promise1.then(function (result) {
                resolvedResult1 = result;
            });
            var promise2 = factory.loadSubItems();
            promise2.then(function (result) {
                resolvedResult2 = result;
            });
            $timeout.flush();
            expect(resolvedResult1).toEqual(subItems);
            expect(resolvedResult2).toEqual([]);
        });
    });

    describe("SubItems searching", function () {

        it("should use id and title as searchKey by default", function () {
            var factory = new SidebarMenuListItem({
                id: "hello",
                title: "world"
            });
            expect(factory.searchKey).toEqual("hello world");
        });

        it("should add search key and ignore case", function () {
            var factory = new SidebarMenuListItem({
                id: "hello"
            });
            factory.addSearchKey("Foo");
            expect(factory.searchKey).toEqual("hello foo");
        });

        it("should filter sub items", function () {
            var root = new SidebarMenuListItem({
                id: "root",
                allowSearch: true,
                allowSubItems: true
            });
            var child1 = root.addSubItem({
                id: "child1",
                allowSubItems: true
            });
            var child2 = root.addSubItem({
                id: "child2",
                allowSubItems: true
            });
            var child1A = child1.addSubItem({
                id: "child1A"
            });
            var child2A = child2.addSubItem({
                id: "child2A"
            });
            child1.addSubItem(child1A);
            child2.addSubItem(child2A);

            expect(root.getSubItems().length).toEqual(2);
            expect(root.getSubItems()[0]).toEqual(child1);
            expect(root.getSubItems()[1]).toEqual(child2);

            root.filterSubItems("child2A");

            expect(root.getSubItems().length).toEqual(1);
            expect(root.getSubItems()[0]).toEqual(child2);

            root.filterSubItems("");

            expect(root.getSubItems().length).toEqual(2);
            expect(root.getSubItems()[0]).toEqual(child1);
            expect(root.getSubItems()[1]).toEqual(child2);
        });

        it("should not search item with searchable set to false", function () {
            var root = new SidebarMenuListItem({
                id: "root",
                allowSearch: true,
                allowSubItems: true
            });
            root.addSubItem({
                id: "hello",
                title: "world",
                searchable: false
            });
            root.addSubItem({
                id: "hi",
                title: "world"
            });
            root.filterSubItems("world");
            expect(root.getSubItems().length).toEqual(1);
        });
    });
});
