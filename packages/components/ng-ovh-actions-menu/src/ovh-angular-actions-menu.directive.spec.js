describe("Directive: actionsMenu", function () {

    "use strict";

    var $compile;
    var $rootScope;
    var $scope;
    var elem;

    beforeEach(angular.mock.module("templates"));
    beforeEach(module("actionsMenuMock"));

    beforeEach(inject(function (_$rootScope_, _$compile_) {
        $scope = _$rootScope_.$new();
        $compile = _$compile_;
        $rootScope = _$rootScope_;

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
            element: "<actions-menu></actions-menu>"
        },
        asAttribute: {
            element: "<div data-actions-menu></div>"
        },
        defaultWithAttr: {
            element: "<actions-menu data-actions-menu-options=\"options\"" +
                                    " data-actions-menu-popover-settings=\"popoverSettings\">" +
                     "</actions-menu>",
            scope: {
                popoverSettings: {
                    placement: "bottom-left",
                    "class": "my-custom-class"
                },
                options: [{
                    title: "Item 1",
                    subActions: [{
                        title: "Item 1.1"
                    }, {
                        title: "Item 1.2"
                    }, {
                        title: "Item 1.3"
                    }]
                }, {
                    title: "Item 2",
                    state: "my-state-2"
                }, {
                    title: "Item 3",
                    state: "my-state-3"
                }]
            }
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

        it("should load the component as element", function () {
            var compiledElem = compileDirective("default");
            expect(compiledElem.find("button.actions-menu-button").length).toEqual(1);
        });

        it("should not load the component as attribute", function () {
            var compiledElem = compileDirective("asAttribute");
            expect(compiledElem.find("button.actions-menu-button").length).toEqual(0);
        });

    });

    describe("Playing with component", function () {

        var compiledElem;

        beforeEach(function () {
            compiledElem = compileDirective("defaultWithAttr").find("button.actions-menu-button");

            compiledElem.click();
            $scope.$digest();
        });

        it("should add custom class to popover element", function () {
            expect(compiledElem.next(".responsive-popover").hasClass("my-custom-class")).toBeTruthy();
        });

        it("should display three actions", function () {
            var leftPage = compiledElem.next(".responsive-popover").find(".actions-menu-page.main-page");
            var rightPage = compiledElem.next(".responsive-popover").find(".actions-menu-page.secondary-page");
            expect(leftPage.find(".actions-list-item").length).toEqual(3);

            leftPage.find(".actions-list-item").eq(0).find(".actions-menu-item-link").click();
            $scope.$digest();

            // expect the right page to be displayed/visible
            expect(compiledElem.next(".responsive-popover").find(".actions-menu-pages").hasClass("move")).toBeTruthy();
            expect(rightPage.find(".actions-list-item").length).toEqual(4);     // 4 because back link is considered as a link
        });

    });
});
