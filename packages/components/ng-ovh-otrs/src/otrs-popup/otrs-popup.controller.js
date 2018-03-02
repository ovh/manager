angular.module("ovh-angular-otrs").controller("OtrsPopupCtrl", function ($rootScope, $stateParams, $translate, $q, $transitions, OvhApiMeVipStatus, OvhApiMe, OvhApiSupport, OvhApiProductsAapi, OtrsPopupService, UNIVERSE,
                                                                         TICKET_CATEGORIES, OTRS_POPUP_ASSISTANCE_ENUM, OTRS_POPUP_BILLING_ENUM, OTRS_POPUP_INCIDENT_ENUM, OTRS_POPUP_INTERVENTION_ENUM, OTRS_POPUP_UNIVERSES) {
    "use strict";

    var self = this;
    var OTHER_SERVICE = "other";

    function initFields () {
        self.ticket = {
            body: null,
            serviceName: null,
            subject: null,
            type: null
        };

        self.universes = _.get(OTRS_POPUP_UNIVERSES, $rootScope.target, OTRS_POPUP_UNIVERSES.EU);

        var standardizedUniverse = UNIVERSE === "GAMMA" ? "SUNRISE" : UNIVERSE;

        self.selectedUniverse = _.includes(["CLOUD", "DEDICATED"], standardizedUniverse) || !standardizedUniverse ? "CLOUD_DEDICATED" : standardizedUniverse;
    }

    function manageAlert (message, type) {
        if (!message) {
            self.alert.visible = false;
            return;
        }

        self.alert.visible = true;
        self.alert.message = message;
        self.alert.type = type;
    }

    $transitions.onSuccess({}, function (transition) {
        var toParams = transition.params();
        if (toParams.projectId && self.services && self.services.indexOf(toParams.projectId) !== -1) {
            self.ticket.serviceName = toParams.projectId;
        }
    });

    self.sendTicket = function () {
        // hide alert
        manageAlert();

        if (!self.loaders.send && self.ticket.body) {
            self.loaders.send = true;

            if (self.ticket.serviceName === OTHER_SERVICE) {
                self.ticket.serviceName = "";
                self.ticket.category = TICKET_CATEGORIES.DEFAULT;
            }

            OvhApiSupport.Lexi().create(self.ticket).$promise.then(
                function (data) {
                    initFields();
                    self.otrsPopupForm.$setUntouched();
                    self.otrsPopupForm.$setPristine();
                    $rootScope.$broadcast("ticket.otrs.reload");
                    manageAlert($translate.instant("otrs_popup_sent_success", { ticketNumber: data.ticketNumber, ticketId: data.ticketId }), "success");
                },
                function (err) {
                    manageAlert([($translate.instant("otrs_popup_sent_error"), err.data && err.data.message) || ""].join(" "), "danger");
                }
            ).finally(function () {
                self.loaders.send = false;
            });
        }
    };


    self.getServices = function () {

        self.loaders.services = true;
        self.services = [];

        // hide alert
        manageAlert();

        OvhApiProductsAapi.get({
            includeInactives: true,
            universe: self.selectedUniverse === "CLOUD_DEDICATED" ? "DEDICATED" : self.selectedUniverse
        }).$promise.then(function (services) {
            var translationPromises = services.results.map(function (s) {
                return $translate("otrs_service_category_" + s.name, null, null, s.name).then(function (value) {
                    s.translatedName = value;
                    return s;
                });
            });

            return $q.all(translationPromises).then(function (services) { // eslint-disable-line no-shadow
                services = services.sort(function (a, b) { return a.translatedName.localeCompare(b.translatedName); }); // eslint-disable-line no-param-reassign

                services.push({
                    translatedName: $translate.instant("otrs_service_category_other"),
                    services: [
                        {
                            serviceName: OTHER_SERVICE,
                            displayName: $translate.instant("otrs_service_category_other")
                        }
                    ]
                });
                self.services = services;
            });
        })
            .catch(function (err) { manageAlert([($translate.instant("otrs_err_get_infos"), err.data && err.data.message) || ""].join(" "), "danger"); })
            .finally(function () { self.loaders.services = false; });
    };

    this.$onInit = function () {

        initFields();

        self.loaders = {
            send: false,
            models: true
        };

        self.alert = {
            visible: false,
            type: null,
            message: null
        };

        self.isVIP = false;

        self.getServices();

        // hide alert
        manageAlert();

        $q.all([OvhApiMe.Lexi().get().$promise, OvhApiSupport.Lexi().schema().$promise]).then(function (data) {
            self.types = data[1].models["support.TicketTypeEnum"].enum;
            self.categories = data[1].models["support.TicketProductEnum"].enum;
            self.requests = data[1].models["support.TicketCategoryEnum"].enum;

            self.subCategories = {
                assistance: [
                    OTRS_POPUP_ASSISTANCE_ENUM.USAGE,
                    OTRS_POPUP_ASSISTANCE_ENUM.START
                ],
                billing: [
                    OTRS_POPUP_BILLING_ENUM.INPROGRESS,
                    OTRS_POPUP_BILLING_ENUM.BILL
                ],
                incident: [
                    OTRS_POPUP_INCIDENT_ENUM.PERFS,
                    OTRS_POPUP_INCIDENT_ENUM.ALERTS,
                    OTRS_POPUP_INCIDENT_ENUM.DOWN
                ],
                intervention: [
                    OTRS_POPUP_INTERVENTION_ENUM.REPLACEMENTDISK,
                    OTRS_POPUP_INTERVENTION_ENUM.OTHER
                ]
            };

            if (data[0].ovhSubsidiary !== "FR") {
                self.subCategories.assistance.splice(2, 0, OTRS_POPUP_ASSISTANCE_ENUM.NEW);
                self.subCategories.assistance.splice(3, 0, OTRS_POPUP_ASSISTANCE_ENUM.OTHER);
                self.subCategories.billing.splice(1, 0, OTRS_POPUP_ASSISTANCE_ENUM.NEW);
                self.subCategories.billing.splice(3, 0, OTRS_POPUP_ASSISTANCE_ENUM.OTHER);
                self.subCategories.incident.splice(3, 0, OTRS_POPUP_ASSISTANCE_ENUM.OTHER);
            }

            if (self.categories.length === 1) {
                self.ticket.product = self.categories[0];
            }
        }
        )
            .catch(function (err) { manageAlert([($translate.instant("otrs_err_get_infos"), err.data && err.data.message) || ""].join(" "), "danger"); })
            .finally(function () { self.loaders.models = false; });

        OvhApiMeVipStatus.Lexi().get().$promise.then(function (vipStatus) {
            self.isVIP = _.values(vipStatus.toJSON()).indexOf(true) !== -1;
        });
    };

});
