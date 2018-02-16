angular.module("ovh-angular-otrs", ["ovh-api-services", "ovh-angular-toaster", "ovh-jquery-ui-draggable-ng"]);

angular.module("ovh-angular-otrs")
    .constant("OTRS_POPUP_ASSISTANCE_ENUM", {
        USAGE: "usage",
        START: "start",
        NEW: "new",
        OTHER: "other"
    })
    .constant("OTRS_POPUP_BILLING_ENUM", {
        INPROGRESS: "inProgress",
        NEW: "new",
        BILL: "bill",
        OTHER: "other"
    })
    .constant("OTRS_POPUP_INCIDENT_ENUM", {
        PERFS: "perfs",
        ALERTS: "alerts",
        DOWN: "down"
    })
    .constant("OTRS_POPUP_INTERVENTION_ENUM", {
        REPLACEMENTDISK: "replacement-disk",
        OTHER: "other"
    })
    .constant("OTRS_POPUP_CATEGORIES", {
        ASSISTANCE: "assistance",
        BILLING: "billing",
        INCIDENT: "incident",
        INTERVENTION: "intervention"
    })
    .constant("OTRS_POPUP_SERVICES", {
        DOMAIN: "DOMAIN",
        HOSTING: "HOSTING",
        EMAIL: "EMAIL_DOMAIN",
        ZONE: "ZONE",
        SQL: "PRIVATE_DATABASE",
        EXCHANGE: "EXCHANGE",
        OFFICE_365: "OFFICE_365",
        VPS: "VPS",
        LOAD_BALANCER: "LOAD_BALANCER",
        FAILOVER: "FAILOVER",
        CLOUD: "CLOUD",
        CDN: "CDN_WEBSTORAGE",
        DEDICATED: "DEDICATED",
        CDN_DEDICATED: "CDN_DEDICATED"
    })
    .constant("OTRS_POPUP_UNIVERSES", {
        EU: ["CLOUD_DEDICATED", "SUNRISE", "TELECOM", "WEB"],
        CA: ["CLOUD_DEDICATED", "SUNRISE"],
        US: ["CLOUD_DEDICATED"]
    });

angular.module("ovh-angular-otrs").controller("OtrsPopupCtrl", ["$rootScope", "$stateParams", "$translate", "$q", "OvhApiMeVipStatus", "OvhApiMe", "OvhApiSupport", "OvhApiProductsAapi", "Toast", "OtrsPopupService", "UNIVERSE", "TICKET_CATEGORIES", "OTRS_POPUP_ASSISTANCE_ENUM", "OTRS_POPUP_BILLING_ENUM", "OTRS_POPUP_INCIDENT_ENUM", "OTRS_POPUP_INTERVENTION_ENUM", "OTRS_POPUP_UNIVERSES", function ($rootScope, $stateParams, $translate, $q, OvhApiMeVipStatus, OvhApiMe, OvhApiSupport, OvhApiProductsAapi, Toast, OtrsPopupService, UNIVERSE,
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

    $rootScope.$on("$stateChangeSuccess", function (event, toState, toParams) {
        if (toParams.projectId && self.services && self.services.indexOf(toParams.projectId) !== -1) {
            self.ticket.serviceName = toParams.projectId;
        }
    });

    self.sendTicket = function () {
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
                    OtrsPopupService.close();
                    Toast.success($translate.instant("otrs_popup_sent_success", { ticketNumber: data.ticketNumber, ticketId: data.ticketId }));
                },
                function (err) {
                    Toast.error([($translate.instant("otrs_popup_sent_error"), err.data && err.data.message) || ""].join(" "));
                }
            ).finally(function () {
                self.loaders.send = false;
            });
        }
    };


    self.getServices = function () {

        self.loaders.services = true;
        self.services = [];


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
            .catch(function (err) { Toast.error([($translate.instant("otrs_err_get_infos"), err.data && err.data.message) || ""].join(" ")); })
            .finally(function () { self.loaders.services = false; });
    };

    this.$onInit = function () {

        initFields();

        self.loaders = {
            send: false,
            models: true
        };

        self.isVIP = false;

        self.getServices();

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
            .catch(function (err) { Toast.error([($translate.instant("otrs_err_get_infos"), err.data && err.data.message) || ""].join(" ")); })
            .finally(function () { self.loaders.models = false; });

        OvhApiMeVipStatus.Lexi().get().$promise.then(function (vipStatus) {
            self.isVIP = _.values(vipStatus.toJSON()).indexOf(true) !== -1;
        });
    };

}]);

angular.module("ovh-angular-otrs")
    .directive("otrsPopup", function () {
        "use strict";
        return {
            restrict: "A",
            scope: {},
            replace: false,
            templateUrl: "app/module-otrs/otrs-popup/otrs-popup.html",
            link: function ($scope) {

                $scope.status = {
                    minimize: false,
                    maximize: false,
                    close: false
                };

                $scope.minimize = function () {
                    $scope.status.maximize = false;
                    $scope.status.minimize = true;
                    $scope.status.close = false;
                };

                $scope.maximize = function () {
                    $scope.status.maximize = true;
                    $scope.status.minimize = false;
                    $scope.status.close = false;
                };

                $scope.restore = function () {
                    $scope.status.maximize = false;
                    $scope.status.minimize = false;
                    $scope.status.close = false;
                };

                $scope.toggle = function () {
                    if ($scope.status.maximize || $scope.status.minimize) {
                        $scope.restore();
                    } else {
                        $scope.maximize();
                    }
                };

                $scope.close = function () {
                    $scope.restore();
                    $scope.status.close = true;
                };

                $scope.$on("otrs.popup.maximize", $scope.maximize);
                $scope.$on("otrs.popup.minimize", $scope.minimize);
                $scope.$on("otrs.popup.restore", $scope.restore);
                $scope.$on("otrs.popup.toggle", $scope.toggle);
                $scope.$on("otrs.popup.close", $scope.close);
            }
        };
    });


angular.module("ovh-angular-otrs")
    .service("OtrsPopupService", ["$rootScope", "$compile", function ($rootScope, $compile) {
        "use strict";

        var self = this;
        var actions = ["minimize", "maximize", "restore", "close"];
        var isLoaded = false;

        angular.forEach(actions, function (action) {
            self[action] = function (id) {
                $rootScope.$broadcast("otrs.popup." + action, id);
            };
        });

        this.toggle = function () {
            if ($("[otrs-popup] .draggable").hasClass("close")) {
                self.restore();
            } else {
                self.close();
            }
        };

        this.init = function () {
            $compile("<div otrs-popup></div>")($rootScope, function (el) {
                $("body").append(el);
                isLoaded = true;
            });
        };

        this.isLoaded = function () {
            return isLoaded;
        };

    }]);

angular.module("ovh-angular-otrs").constant("TICKET_CATEGORIES", {
    LIST: {
        WEB: [
            "cdn",
            "domain",
            "exchange",
            "hosting",
            "mail",
            "ssl",
            "vps",
            "web-billing",
            "web-other"
        ],
        TELECOM: [
            "adsl",
            "voip",
            "fax",
            "sms",
            "telecom-billing",
            "telecom-other"
        ],
        DEDICATED: [
            "dedicated",
            "dedicatedcloud",
            "housing",
            "dedicated-other",
            "dedicated-billing"
        ],
        CLOUD: [
            "publiccloud"
        ]
    },
    DEFAULT: "billing"
});


angular.module('ovh-angular-otrs').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('app/module-otrs/otrs-popup/otrs-popup.html',
    "<div class=\"draggable otrs-popup\" data-draggable data-options=\"{\n" +
    "         containment: 'body',\n" +
    "         handle: '#headerPopup,\n" +
    "         #contentPopup form'\n" +
    "     }\" data-ng-class=\"{\n" +
    "        'minimize': status.minimize,\n" +
    "        'maximize': status.maximize,\n" +
    "        'close': status.close\n" +
    "    }\"><div class=draggable-header id=headerPopup><span data-translate=otrs_popup_title></span><div class=\"otrs_popup_tools float-right\"><button type=button aria-label=\"{{:: 'otrs_popup_icon_minimize' | translate }}\" data-ng-click=minimize()><span class=\"fa fa-window-minimize\" aria-hidden=true></span></button> <button type=button aria-label=\"{{:: 'otrs_popup_icon_maximize' | translate }}\" data-ng-click=toggle()><span class=\"fa fa-window-maximize\" aria-hidden=true></span></button> <button type=button aria-label=\"{{:: 'otrs_popup_icon_close' | translate }}\" data-ng-click=close()><span class=\"fa fa-close\" aria-hidden=true></span></button></div></div><div id=contentPopup data-ng-controller=\"OtrsPopupCtrl as OtrsPopupCtrl\"><p class=\"text-center font-italic\" data-translate=otrs_popup_move></p><p class=\"text-center font-italic\" data-ng-if=OtrsPopupCtrl.isVIP data-translate=otrs_vip_phone></p><form id=otrsPopupForm name=OtrsPopupCtrl.otrsPopupForm novalidate data-ng-submit=OtrsPopupCtrl.sendTicket()><div class=form-group data-ng-if=\"OtrsPopupCtrl.universes.length > 1\"><label for=select-universe class=control-label data-translate=otrs_universe_choice></label><select class=form-control id=select-universe name=select-universe required data-ng-model=OtrsPopupCtrl.selectedUniverse data-ng-options=\"universe as ( 'otrs_universe_'+ universe | translate ) for universe in OtrsPopupCtrl.universes\" data-ng-change=OtrsPopupCtrl.getServices()></select></div><div class=form-group><label for=select-services class=control-label><span data-translate=otrs_popup_service></span><oui-spinner data-ng-show=OtrsPopupCtrl.loaders.services data-size=s></oui-spinner></label><select class=form-control id=select-services name=select-services required data-ng-model=OtrsPopupCtrl.ticket.serviceName data-ng-disabled=OtrsPopupCtrl.loaders.services><optgroup label=\"{{ category.translatedName }}\" data-ng-repeat=\"category in OtrsPopupCtrl.services track by $index\"><option value=\"{{ service.serviceName }}\" data-ng-repeat=\"service in category.services track by $index\" data-ng-bind=service.displayName></option></optgroup></select></div><div class=form-group data-ng-if=OtrsPopupCtrl.isVIP><label for=select-types class=control-label><span data-translate=otrs_popup_type></span><oui-spinner data-ng-show=OtrsPopupCtrl.loaders.models data-size=s></oui-spinner></label><select class=form-control id=select-types name=select-types data-ng-model=OtrsPopupCtrl.ticket.type data-ng-options=\"type as ( 'otrs_types_'+type | translate ) for type in OtrsPopupCtrl.types\" data-ng-disabled=OtrsPopupCtrl.loaders.models></select></div><div class=form-group><label for=select-requests class=control-label><span data-translate=otrs_category_choice></span><oui-spinner data-ng-show=OtrsPopupCtrl.loaders.models data-size=s></oui-spinner></label><select class=form-control id=select-requests name=select-requests required data-ng-model=OtrsPopupCtrl.ticket.category data-ng-options=\"request as ( 'otrs_category_'+request | translate ) for request in OtrsPopupCtrl.requests\" data-ng-disabled=OtrsPopupCtrl.loaders.models></select></div><div class=form-group data-ng-show=OtrsPopupCtrl.ticket.category><label for=select-subCategories class=control-label><span data-translate=otrs_subCategory_choice></span><oui-spinner data-ng-show=OtrsPopupCtrl.loaders.models data-size=s></oui-spinner></label><select class=form-control id=select-subCategories name=select-requests required data-ng-model=OtrsPopupCtrl.ticket.subcategory data-ng-options=\"subCategory as ('otrs_subCategory_' + OtrsPopupCtrl.ticket.category + '_' + subCategory | translate) for subCategory in OtrsPopupCtrl.subCategories[OtrsPopupCtrl.ticket.category]\" data-ng-disabled=OtrsPopupCtrl.loaders.models></select></div><div class=form-group><label for=txt-subject class=control-label data-translate=otrs_popup_subject></label><input id=txt-subject name=txt-subject class=form-control required placeholder=\"{{:: 'otrs_popup_subject' | translate }}\" data-ng-model=OtrsPopupCtrl.ticket.subject></div><div class=form-group><label for=txt-message class=control-label data-translate=otrs_popup_body></label><textarea id=txt-message name=txt-message class=form-control rows=8 required placeholder=\"{{:: 'otrs_popup_body' | translate }}\" data-ng-model=OtrsPopupCtrl.ticket.body>\n" +
    "                </textarea></div><div class=form-group><button type=submit class=\"btn btn-block btn-primary\" data-ng-disabled=\"!OtrsPopupCtrl.otrsPopupForm.$valid || OtrsPopupCtrl.loaders.services || OtrsPopupCtrl.loaders.send\"><span class=\"fa fa-envelope\" aria-hidden=true></span> <span data-translate=otrs_popup_add_ticket></span><oui-spinner data-ng-show=OtrsPopupCtrl.loaders.send data-size=s></oui-spinner></button></div></form></div></div>"
  );

}]);
