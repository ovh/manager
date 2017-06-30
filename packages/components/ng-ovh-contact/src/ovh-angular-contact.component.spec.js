describe("Component: ovhContact", function () {
    "use strict";

    var $compile;
    var $rootScope;
    var $scope;
    var $httpBackend;
    var $q;
    var elem;
    var OvhContact;

    beforeEach(angular.mock.module("templates"));
    beforeEach(module("ovhContactMock"));

    beforeEach(inject(function (_$rootScope_, _$compile_, _$httpBackend_, _$q_, _OvhContact_) {
        $scope = _$rootScope_.$new();
        $httpBackend = _$httpBackend_;
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $q = _$q_;
        OvhContact = _OvhContact_;

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
            element: "<ovh-contact data-ng-model=\"model.contact\" data-ovh-contact-only-create=\"{{onlyCreate}}\" data-ovh-contact-choice-options=\"choiceOptions\"></ovh-contact>"
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

        it("should load the directive, select a contact by default, display create and edit buttons on choice directive", function () {
            var compiledElem = compileDirective("default", {
                model: {
                    contact: null
                }
            });
            expect($scope.model.contact).toBeNull();
            $httpBackend.flush();
            // test if directive is well displayed
            expect(compiledElem.find(".ovh-contact").length).toBe(1);
            // test if contact is setted
            expect($scope.model.contact.constructor.name).toBe("OvhContact");
            expect($scope.model.contact.id).toBeDefined();
            // test default choice options
            expect(compiledElem.find("button[type=\"button\"]").length).toBe(3);
        });

        it("should load the directive and hide some buttons", function () {
            var compiledElem = compileDirective("default", {
                model: {
                    contact: null
                },
                choiceOptions: {
                    options: {
                        allowCreation: false,
                        allowEdition: false
                    }
                }
            });
            $httpBackend.flush();
            expect(compiledElem.find("button[type=\"button\"]").length).toBe(1);
        });

        it("should load the directive and only allow creating a contact", function () {
            var compiledElem = compileDirective("default", {
                model: {
                    contact: null
                },
                onlyCreate: true
            });
            $httpBackend.flush();
            expect(compiledElem.find("form.ovh-contact-edit").length).toBe(1);
        });

        it("should load the directive and display custom filtered list of contact", function () {
            var compiledElem = compileDirective("default", {
                model: {
                    contact: null
                },
                choiceOptions: {
                    customList: [
                        new OvhContact({
                            firstName: "azerty",
                            lastName: "uiop",
                            address: {
                                city: "var",
                                country: "DE",
                                zip: 55555,
                                line1: "somewhere"
                            },
                            id: 13579
                        }),
                        new OvhContact({
                            firstName: "foo",
                            lastName: "bar",
                            address: {
                                city: "test",
                                country: "FR",
                                zip: 12345,
                                line1: "the address"
                            },
                            id: 54321
                        }),
                        new OvhContact({
                            firstName: "azerty",
                            lastName: "uiop",
                            address: {
                                city: "somewhere",
                                country: "BE",
                                zip: 1234,
                                line1: "over the rainbow"
                            },
                            id: 7711
                        })
                    ],
                    filter: function (contacts) {
                        return _.filter(contacts, function (contact) {
                            return contact.address.country === "BE" || contact.address.country === "FR";
                        });
                    },
                    options: {
                        allowCreation: false,
                        allowEdition: false
                    }
                }
            });
            $httpBackend.flush();
            expect($scope.model.contact.id).toBe(54321);
        });

    });

    describe("Playing with choice directive", function () {

        it("display edit form when clicking on add contact button", function () {
            var compiledElem = compileDirective("default", {
                model: {
                    contact: null
                }
            });
            $httpBackend.flush();
            expect(compiledElem.find("form.ovh-contact-edit").length).toBe(0);

            compiledElem.find("button[type=\"button\"]").eq(1).click();
            $scope.$digest();

            expect(compiledElem.find("form.ovh-contact-edit").length).toBe(1);
        });

    });

});
