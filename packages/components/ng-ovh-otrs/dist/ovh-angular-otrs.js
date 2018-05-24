angular.module("ovh-angular-otrs", ["ovh-api-services", "ovh-angular-toaster", "ovh-jquery-ui-draggable-ng"]);

angular.module("ovh-angular-otrs")
    .service("OtrsPopupInterventionService", ["$q", "OvhApiDedicatedServer", function ($q, OvhApiDedicatedServer) {
        "use strict";

        var self = this;

        self.sendDiskReplacement = function (serviceName, disk) {
            var diskToSend = _.assign({}, disk);

            if (!diskToSend.comment) {
                diskToSend.comment = "No message";
            }

            return OvhApiDedicatedServer.v6().askHardDiskDriveReplacement({
                serverName: serviceName
            }, {
                comment: diskToSend.comment,
                disks: diskToSend.disks,
                inverse: diskToSend.inverse
            }).$promise;
        };

        self.getServerInterventionInfo = function (serviceName) {
            return $q.all({
                serverInfo: getServerInfo(serviceName),
                hardwareInfo: getHardwareInfo(serviceName)
            }).then(function (results) {
                return {
                    canHotSwap: canHotSwap(results.serverInfo, results.hardwareInfo),
                    hasMegaRaid: hasMegaRaidCard(results.hardwareInfo),
                    slotInfo: slotInfo(results.serverInfo, results.hardwareInfo)
                };
            });
        };

        function getServerInfo (serviceName) {
            return OvhApiDedicatedServer.v6().get({
                serverName: serviceName
            }).$promise;
        }

        function getHardwareInfo (serviceName) {
            return OvhApiDedicatedServer.v6().getHardware({
                serverName: serviceName
            }).$promise;
        }

        function canHotSwap (serverInfo, hardwareInfo) {
            return serverInfo.commercialRange.toUpperCase() === "HG" && _.includes(["2U", "4U"], hardwareInfo.formFactor.toUpperCase());
        }

        function hasMegaRaidCard (hardwareInfo) {
            return _.some(hardwareInfo.diskGroups, { raidController: "MegaRaid" });
        }

        function slotInfo (serverInfo, hardwareInfo) {
            var canUseSlotId = serverInfo.commercialRange.toUpperCase() === "HG";
            var slotsCount = hardwareInfo.formFactor && hardwareInfo.formFactor.toUpperCase() === "4U" ? 24 : 12;

            return {
                canUseSlotId: canUseSlotId,
                slotsCount: slotsCount
            };
        }
    }]);

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
        INTERVENTION: "intervention",
        SALES: "sales"
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

angular.module("ovh-angular-otrs").controller("OtrsPopupCtrl", ["$q", "$rootScope", "$scope", "$stateParams", "$transitions", "$translate", "OvhApiMe", "OvhApiMeVipStatus", "OvhApiProductsAapi", "OvhApiSupport", "OtrsPopup", "OtrsPopupInterventionService", "OtrsPopupService", "OTRS_POPUP_ASSISTANCE_ENUM", "OTRS_POPUP_BILLING_ENUM", "OTRS_POPUP_CATEGORIES", "OTRS_POPUP_INCIDENT_ENUM", "OTRS_POPUP_INTERVENTION_ENUM", "OTRS_POPUP_SERVICES", "OTRS_POPUP_UNIVERSES", "TICKET_CATEGORIES", "UNIVERSE", function ($q, $rootScope, $scope, $stateParams, $transitions, $translate,
                                                                         OvhApiMe, OvhApiMeVipStatus, OvhApiProductsAapi, OvhApiSupport,
                                                                         OtrsPopup, OtrsPopupInterventionService, OtrsPopupService,
                                                                         OTRS_POPUP_ASSISTANCE_ENUM, OTRS_POPUP_BILLING_ENUM, OTRS_POPUP_CATEGORIES, OTRS_POPUP_INCIDENT_ENUM, OTRS_POPUP_INTERVENTION_ENUM, OTRS_POPUP_SERVICES, OTRS_POPUP_UNIVERSES,
                                                                         TICKET_CATEGORIES, UNIVERSE) {
    "use strict";

    var self = this;
    var OTHER_SERVICE = "other";

    self.loaders = {
        send: false,
        services: false,
        models: false,
        intervention: false
    };
    self.currentUser = null;
    self.isVIP = false;
    self.baseUrlTickets = null;
    self.services = [];

    $transitions.onSuccess({}, function (transition) {
        var toParams = transition.params();
        if (toParams.projectId && self.services && self.services.indexOf(toParams.projectId) !== -1) {
            self.ticket.serviceName = toParams.projectId;
        }
    });

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

        self.intervention = {
            serviceName: null,
            request: "intervention",
            disk: {
                comment: null,
                disks: [{
                    id: 1
                }],
                inverse: false
            },
            hasMegaRaid: false,
            slotInfo: {},
            enums: {
                slotID: []
            }
        };
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

    self.getServices = function () {
        self.loaders.services = true;

        // hide alert
        manageAlert();
        return OvhApiProductsAapi
            .get({
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

                    return services;
                });
            })
            .catch(function (err) {
                manageAlert([($translate.instant("otrs_err_get_infos"), err.data && err.data.message) || ""].join(" "), "danger");
            })
            .finally(function () {
                self.loaders.services = false;
            });
    };

    /**
     * Send ticket.
     * @return {Promise}
     */
    self.sendTicket = function () {
        // hide alert
        manageAlert();

        if (!self.loaders.send && self.ticket.body) {
            self.loaders.send = true;

            if (self.ticket.serviceName === OTHER_SERVICE) {
                self.ticket.serviceName = "";
                self.ticket.category = TICKET_CATEGORIES.DEFAULT;
            }

            return OvhApiSupport.v6()
                .create(self.ticket).$promise
                .then(function (data) {
                    initFields();
                    self.otrsPopupForm.$setUntouched();
                    self.otrsPopupForm.$setPristine();
                    $rootScope.$broadcast("ticket.otrs.reload");
                    manageAlert($translate.instant("otrs_popup_sent_success", {
                        ticketNumber: data.ticketNumber,
                        ticketUrl: [self.baseUrlTickets, data.ticketId].join("/")
                    }), "success");
                })
                .catch(function (err) {
                    manageAlert([($translate.instant("otrs_popup_sent_error"), err.data && err.data.message) || ""].join(" "), "danger");
                })
                .finally(function () {
                    self.loaders.send = false;
                });
        }

        return $q.when();
    };

    /**
     * Send disk replacement.
     * @return {Promise}
     */
    self.sendDiskReplacement = function () {
        if (!self.loaders.send) {
            self.loaders.send = true;

            return OtrsPopupInterventionService
                .sendDiskReplacement(self.intervention.serviceName, self.intervention.disk)
                .then(function (data) {
                    initFields();
                    $rootScope.$broadcast("ticket.otrs.reload");
                    manageAlert($translate.instant("otrs_popup_sent_success", {
                        ticketNumber: data.ticketNumber,
                        ticketUrl: [self.baseUrlTickets, data.ticketId].join("/")
                    }), "success");
                }).catch(function (err) {
                    if (_.includes(err.message, "This feature is currently not supported in your datacenter")) {
                        manageAlert($translate.instant("otrs_popup_sent_error_not_available"), "danger");
                    } else if (_.includes(err.message, "Action pending : ticketId ")) {
                        var ticketId = /\d+$/.exec(err.message);
                        manageAlert($translate.instant("otrs_popup_sent_error_already_exists", {
                            ticketUrl: [self.baseUrlTickets, ticketId].join("/")
                        }), "danger");
                    } else {
                        manageAlert([$translate.instant("otrs_popup_sent_error"), _.get(err, "message", "")].join(" "), "danger");
                    }
                }).finally(function () {
                    self.loaders.send = false;
                    self.refreshRequests();
                    self.setForm("start");
                });
        }

        return $q.when();
    };

    function getSelectedService () {
        return _.filter(self.services, function (service) {
            return _.find(service.services, { serviceName: self.ticket.serviceName });
        });
    }

    function isSelectedChoiceDedicatedServer () {
        return _.first(_.map(getSelectedService(), "name")) === "SERVER";
    }

    self.refreshRequests = function () {
        if (isSelectedChoiceDedicatedServer() && !_.includes(self.requests, self.intervention.request)) {
            self.requests.push(self.intervention.request);
        } else if (!isSelectedChoiceDedicatedServer()) {
            _.remove(self.requests, function (req) {
                return self.intervention.request === req;
            });
            self.ticket.category = undefined;
            self.ticket.subcategory = null;
        }
    };

    self.refreshFormDetails = function () {
        if (self.ticket.subcategory === OTRS_POPUP_INTERVENTION_ENUM.REPLACEMENTDISK && self.formDetails === "message") {
            self.refreshRequests();
            self.setForm("start");
        }
    };

    function getServerInfo () {
        self.loaders.intervention = true;
        self.intervention.canHotSwap = false;
        self.intervention.hasMegaRaid = false;
        self.intervention.slotInfo.canUseSlotId = null;
        self.intervention.slotInfo.slotsCount = 0;
        return OtrsPopupInterventionService
            .getServerInterventionInfo(self.intervention.serviceName)
            .then(function (serverInfo) {
                self.intervention.canHotSwap = serverInfo.canHotSwap;
                self.intervention.hasMegaRaid = serverInfo.hasMegaRaid;
                self.intervention.slotInfo = serverInfo.slotInfo;
                if (self.intervention.slotInfo.canUseSlotId) {
                    self.intervention.enums.slotID = Array.apply(null, { length: self.intervention.slotInfo.slotsCount }).map(Number.call, Number);
                }
            }).catch(function () {
                manageAlert($translate.instant("otrs_intervention_disk_error"), "danger");
            }).finally(function () {
                self.loaders.intervention = false;
            });
    }

    self.addDisk = function () {
        var newItemNo = self.intervention.disk.disks.length + 1;
        self.intervention.disk.disks.push({ id: newItemNo });
    };

    self.removeChoice = function (item) {
        self.intervention.disk.disks.splice(item, 1);
    };

    self.setForm = function (formDetails) {
        self.formDetails = formDetails;
    };

    self.isSalesCategory = function () {
        return self.ticket.category === OTRS_POPUP_CATEGORIES.SALES;
    };

    self.continueForm = function () {
        if (self.ticket && self.ticket.category === OTRS_POPUP_CATEGORIES.INTERVENTION && self.ticket.subcategory === OTRS_POPUP_INTERVENTION_ENUM.REPLACEMENTDISK) {
            self.intervention.serviceName = self.ticket.serviceName;
            self.setForm(OTRS_POPUP_INTERVENTION_ENUM.REPLACEMENTDISK);
        } else if (self.ticket && self.ticket.category === OTRS_POPUP_CATEGORIES.INTERVENTION && self.ticket.subcategory === OTRS_POPUP_INTERVENTION_ENUM.OTHER) {
            self.ticket.category = OTRS_POPUP_CATEGORIES.INCIDENT;
            self.ticket.subcategory = OTRS_POPUP_INCIDENT_ENUM.DOWN;
            self.setForm("message");
        } else {
            self.setForm("message");
        }
    };

    this.$onInit = function () {

        initFields();

        self.alert = {
            visible: false,
            type: null,
            message: null
        };

        self.servicesValues = OTRS_POPUP_SERVICES;
        self.formDetails = "start";
        self.interventionEnum = OTRS_POPUP_INTERVENTION_ENUM;

        self.baseUrlTickets = OtrsPopup.getBaseUrlTickets();

        if (_.isEmpty(self.baseUrlTickets)) {
            throw new Error("A baseUrlTickets must be specified.");
        }

        // hide alert
        manageAlert();

        return $q.all({
            services: self.getServices(),
            me: OvhApiMe.v6().get().$promise,
            meVipStatus: OvhApiMeVipStatus.v6().get().$promise,
            supportSchema: OvhApiSupport.v6().schema().$promise
        }).then(function (results) {
            self.currentUser = results.me;

            self.isVIP = _.values(results.meVipStatus.toJSON()).indexOf(true) !== -1;

            self.types = results.supportSchema.models["support.TicketTypeEnum"].enum;
            self.categories = results.supportSchema.models["support.TicketProductEnum"].enum;
            self.requests = results.supportSchema.models["support.TicketCategoryEnum"].enum;

            if (_.get(results.me, "ovhSubsidiary", "").toLowerCase() === "fr") {
                self.requests.push(OTRS_POPUP_CATEGORIES.SALES);
            }

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
                    OTRS_POPUP_INTERVENTION_ENUM.REPLACEMENTDISK
                ]
            };

            if (self.currentUser.ovhSubsidiary !== "FR") {
                self.subCategories.assistance.splice(2, 0, OTRS_POPUP_ASSISTANCE_ENUM.NEW);
                self.subCategories.assistance.splice(3, 0, OTRS_POPUP_ASSISTANCE_ENUM.OTHER);
                self.subCategories.billing.splice(1, 0, OTRS_POPUP_ASSISTANCE_ENUM.NEW);
                self.subCategories.billing.splice(3, 0, OTRS_POPUP_ASSISTANCE_ENUM.OTHER);
                self.subCategories.incident.splice(3, 0, OTRS_POPUP_ASSISTANCE_ENUM.OTHER);
            }

            if (self.categories.length === 1) {
                self.ticket.product = self.categories[0];
            }

            $scope.$watch("OtrsPopupCtrl.intervention.serviceName", function (server, oldServer) {
                if (server && server !== oldServer) {
                    getServerInfo();
                }
            });

            $scope.$watch("OtrsPopupCtrl.ticket.serviceName", function () {
                self.refreshFormDetails();
                self.refreshRequests();
            });

            $scope.$watch("OtrsPopupCtrl.ticket.subcategory", function () {
                self.refreshFormDetails();
            });
        })
            .catch(function (err) { manageAlert([($translate.instant("otrs_err_get_infos"), err.data && err.data.message) || ""].join(" "), "danger"); })
            .finally(function () { self.loaders.models = false; });
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
                    close: true
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

                $scope.open = function () {
                    $scope.restore();
                    $scope.status.close = false;
                };

                $scope.close = function () {
                    $scope.restore();
                    $scope.status.close = true;
                };

                $scope.$on("otrs.popup.maximize", $scope.maximize);
                $scope.$on("otrs.popup.minimize", $scope.minimize);
                $scope.$on("otrs.popup.restore", $scope.restore);
                $scope.$on("otrs.popup.toggle", $scope.toggle);
                $scope.$on("otrs.popup.open", $scope.open);
                $scope.$on("otrs.popup.close", $scope.close);
            }
        };
    });

angular.module("ovh-angular-otrs")
    .provider("OtrsPopup", function () {
        "use strict";

        var self = this;
        var baseUrlTickets = null;

        self.setBaseUrlTickets = function (url) {
            if (angular.isDefined(url) && angular.isString(url)) {
                baseUrlTickets = url;
            } else {
                throw new Error("An URL must be specified.");
            }
        };

        self.$get = function () {
            return {
                getBaseUrlTickets: function () {
                    return baseUrlTickets;
                }
            };
        };
    });

angular.module("ovh-angular-otrs")
    .service("OtrsPopupService", ["$rootScope", function ($rootScope) {
        "use strict";

        var self = this;
        var actions = ["minimize", "maximize", "restore", "close", "open"];
        var isLoaded = false;

        angular.forEach(actions, function (action) {
            self[action] = function (id) {
                $rootScope.$broadcast("otrs.popup." + action, id);
            };
        });

        this.toggle = function () {
            if ($("[data-otrs-popup] .draggable").hasClass("close")) {
                self.open();
            } else {
                self.close();
            }
        };

        this.init = function () {
            self.open();
            isLoaded = true;
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
    "    }\"><div data-ng-controller=\"OtrsPopupCtrl as OtrsPopupCtrl\"><div class=draggable-header id=headerPopup><span data-ng-if=\"OtrsPopupCtrl.formDetails === 'replacement-disk'\" data-translate=otrs_popup_intervention></span> <span data-ng-if=\"OtrsPopupCtrl.formDetails !== 'replacement-disk'\" data-translate=otrs_popup_title></span><div class=\"otrs_popup_tools float-right\"><button type=button aria-label=\"{{:: 'otrs_popup_icon_minimize' | translate }}\" data-ng-click=\"status.minimize ? restore() : minimize()\"><span class=\"fa fa-window-minimize\" aria-hidden=true></span></button> <button type=button aria-label=\"{{:: 'otrs_popup_icon_maximize' | translate }}\" data-ng-click=\"status.maximize ? restore() : maximize()\"><span class=\"fa fa-window-maximize\" aria-hidden=true></span></button> <button type=button aria-label=\"{{:: 'otrs_popup_icon_close' | translate }}\" data-ng-click=close()><span class=\"fa fa-close\" aria-hidden=true></span></button></div></div><div id=contentPopup><p class=\"text-center font-italic\" data-translate=otrs_popup_move></p><p class=\"text-center font-italic\" data-ng-if=OtrsPopupCtrl.isVIP data-translate=otrs_vip_phone></p><div class=\"alert alert-dismissible\" role=alert data-ng-class=\"'alert-' + OtrsPopupCtrl.alert.type\" data-ng-if=OtrsPopupCtrl.alert.visible><button type=button class=close data-dismiss=alert aria-label=Close><span aria-hidden=true>&times;</span></button><p data-ng-bind-html=OtrsPopupCtrl.alert.message></p></div><form id=otrsPopupForm name=OtrsPopupCtrl.otrsPopupForm novalidate data-ng-hide=\"OtrsPopupCtrl.formDetails === 'replacement-disk'\" data-ng-submit=OtrsPopupCtrl.sendTicket()><div class=form-group data-ng-if=\"OtrsPopupCtrl.universes.length > 1\"><label for=select-universe class=control-label data-translate=otrs_universe_choice></label><select class=form-control id=select-universe name=select-universe required data-ng-model=OtrsPopupCtrl.selectedUniverse data-ng-options=\"universe as ( 'otrs_universe_'+ universe | translate ) for universe in OtrsPopupCtrl.universes\" data-ng-change=OtrsPopupCtrl.getServices()></select></div><div class=form-group><label for=select-services class=control-label><span data-translate=otrs_popup_service></span><oui-spinner data-ng-show=OtrsPopupCtrl.loaders.services data-size=s></oui-spinner></label><select class=form-control id=select-services name=select-services required data-ng-model=OtrsPopupCtrl.ticket.serviceName data-ng-disabled=OtrsPopupCtrl.loaders.services><optgroup label=\"{{ category.translatedName }}\" data-ng-repeat=\"category in OtrsPopupCtrl.services track by $index\"><option value=\"{{ service.serviceName }}\" data-ng-repeat=\"service in category.services track by $index\" data-ng-bind=service.displayName></option></optgroup></select><small data-ng-show=OtrsPopupCtrl.productHasFaq() data-translate=otrs_popup_see_faq data-translate-values=\"{\n" +
    "                               url: OtrsPopupCtrl.faq.url\n" +
    "                           }\"></small></div><div class=form-group data-ng-if=OtrsPopupCtrl.isVIP><label for=select-types class=control-label><span data-translate=otrs_popup_type></span><oui-spinner data-ng-show=OtrsPopupCtrl.loaders.models data-size=s></oui-spinner></label><select class=form-control id=select-types name=select-types data-ng-model=OtrsPopupCtrl.ticket.type data-ng-options=\"type as ( 'otrs_types_'+type | translate ) for type in OtrsPopupCtrl.types\" data-ng-disabled=OtrsPopupCtrl.loaders.models></select></div><div class=form-group><label for=select-requests class=control-label><span data-translate=otrs_category_choice></span><oui-spinner data-ng-show=OtrsPopupCtrl.loaders.models data-size=s></oui-spinner></label><select class=form-control id=select-requests name=select-requests required data-ng-model=OtrsPopupCtrl.ticket.category data-ng-options=\"request as ( 'otrs_category_'+request | translate ) for request in OtrsPopupCtrl.requests\" data-ng-disabled=OtrsPopupCtrl.loaders.models></select></div><div class=form-group data-ng-if=\"OtrsPopupCtrl.ticket.category && !OtrsPopupCtrl.isSalesCategory()\"><label for=select-subCategories class=control-label><span data-translate=otrs_subCategory_choice></span><oui-spinner data-ng-show=OtrsPopupCtrl.loaders.models data-size=s></oui-spinner></label><select class=form-control id=select-subCategories name=select-requests required data-ng-model=OtrsPopupCtrl.ticket.subcategory data-ng-options=\"subCategory as ('otrs_subCategory_' + OtrsPopupCtrl.ticket.category + '_' + subCategory | translate) for subCategory in OtrsPopupCtrl.subCategories[OtrsPopupCtrl.ticket.category]\" data-ng-disabled=OtrsPopupCtrl.loaders.models></select></div><div data-ng-switch=OtrsPopupCtrl.formDetails data-ng-if=!OtrsPopupCtrl.isSalesCategory()><div data-ng-switch-when=start><button type=button class=\"btn btn-block btn-default\" data-ng-disabled=\"OtrsPopupCtrl.loaders.services || OtrsPopupCtrl.loaders.send\" data-ng-click=OtrsPopupCtrl.continueForm() data-translate=otrs_popup_continue></button></div><div data-ng-switch-when=message><div class=form-group><label for=txt-subject class=control-label data-translate=otrs_popup_subject></label><input id=txt-subject name=txt-subject class=form-control required placeholder=\"{{:: 'otrs_popup_subject' | translate }}\" data-ng-model=OtrsPopupCtrl.ticket.subject></div><div class=form-group><label for=txt-message class=control-label data-translate=otrs_popup_body></label><textarea id=txt-message name=txt-message class=form-control rows=4 required placeholder=\"{{:: 'otrs_popup_body' | translate }}\" data-ng-model=OtrsPopupCtrl.ticket.body>\n" +
    "                            </textarea></div><div class=\"oui-textarea oui-textarea_readonly\"><textarea class=oui-textarea__textarea rows=5 data-translate=otrs_support_agreements readonly></textarea></div><div class=form-group><button type=submit class=\"btn btn-block btn-primary\" data-ng-disabled=\"!OtrsPopupCtrl.otrsPopupForm.$valid || OtrsPopupCtrl.loaders.services || OtrsPopupCtrl.loaders.send\"><span data-translate=otrs_popup_add_ticket></span><oui-spinner data-ng-show=OtrsPopupCtrl.loaders.send data-size=s></oui-spinner></button></div></div><div data-ng-switch-when=replacement-disk></div></div><div class=\"alert alert-info\" role=alert data-ng-if=OtrsPopupCtrl.isSalesCategory() data-translate=otrs_subCategory_sales_contact></div></form><form id=diskReplacement name=diskReplacement data-ng-if=\"OtrsPopupCtrl.formDetails === OtrsPopupCtrl.interventionEnum.REPLACEMENTDISK\" data-ng-submit=OtrsPopupCtrl.sendDiskReplacement()><div class=form-group><label class=control-label for=diskReplacementService><span data-translate=otrs_popup_service></span><oui-spinner data-ng-show=OtrsPopupCtrl.loaders.services data-size=s></oui-spinner><button class=\"btn btn-link\" data-ng-hide=OtrsPopupCtrl.loaders.services data-ng-click=OtrsPopupCtrl.getServices(true) data-ng-disabled=OtrsPopupCtrl.loaders.send><span class=\"fa fa-refresh\" aria-hidden=true></span> <span data-translate=otrs_popup_services_refresh></span></button></label><select class=form-control id=diskReplacementService name=diskReplacementService required data-ng-model=OtrsPopupCtrl.intervention.serviceName data-ng-disabled=OtrsPopupCtrl.loaders.services><optgroup label=\"{{ category.translatedName }}\" data-ng-repeat=\"category in OtrsPopupCtrl.services track by $index\"><option value=\"{{ service.serviceName }}\" data-ng-repeat=\"service in category.services track by $index\" data-ng-bind=service.displayName></option></optgroup></select></div><div class=text-center data-ng-show=OtrsPopupCtrl.loaders.intervention><oui-spinner></oui-spinner></div><div class=form-group><label class=control-label for=diskSerial><span data-ng-if=OtrsPopupCtrl.intervention.disk.inverse data-translate=otrs_intervention_disk_id_label_not></span> <span data-ng-if=!OtrsPopupCtrl.intervention.disk.inverse data-translate=otrs_intervention_disk_id_label></span></label><div class=input-group data-ng-repeat=\"disk in OtrsPopupCtrl.intervention.disk.disks\"><input class=form-control name=diskSerial required data-ng-model=disk.disk_serial data-translate-attr=\"{\n" +
    "                                   'placeholder': 'otrs_intervention_disk_serial_placeholder'\n" +
    "                               }\"><select data-ng-if=OtrsPopupCtrl.intervention.slotInfo.canUseSlotId data-ng-model=disk.slot_id data-ng-options=\"n for n in OtrsPopupCtrl.intervention.enums.slotID\"><option value=\"\" selected disabled data-translate=otrs_intervention_disk_slotID></option></select><span class=input-group-btn><button type=button class=\"btn btn-default\" data-ng-show=$first data-ng-click=OtrsPopupCtrl.addDisk()><span class=\"fa fa-plus\" aria-hidden=true></span></button> <button type=button class=\"btn btn-default\" data-ng-show=!$first data-ng-click=OtrsPopupCtrl.removeChoice($index)><span class=\"fa fa-minus\" aria-hidden=true></span></button></span></div><div class=checkbox><label><input type=checkbox name=diskReplacementReverse id=diskReplacementReverse data-ng-model=OtrsPopupCtrl.intervention.disk.inverse> <span data-translate=otrs_intervention_disk_id_not_retrievable></span></label></div><div class=form-group><label for=diskReplacementComment class=control-label data-translate=otrs_intervention_disk_comment></label><textarea rows=4 name=diskReplacementComment id=diskReplacementComment class=form-control data-ng-model=OtrsPopupCtrl.intervention.disk.comment>\n" +
    "                    </textarea><span id=helpDiskReplacementComment class=\"help-block italic\" data-translate=otrs_intervention_disk_comment_english_please></span></div><div class=\"form-group confirmation\"><p data-ng-if=OtrsPopupCtrl.intervention.canHotSwap data-ng-bind-html=\"tr('otrs_intervention_disk_warning_hotswap')\"></p><p data-ng-if=!OtrsPopupCtrl.intervention.canHotSwap data-ng-bind-html=\"tr('otrs_intervention_disk_warning2')\"></p><div class=checkbox><label><input type=checkbox name=diskReplacementConfirm id=diskReplacementConfirm data-ng-model=OtrsPopupCtrl.intervention.confirm> <span data-translate=otrs_intervention_disk_confirm></span></label></div></div><button type=button class=\"btn btn-block btn-default\" data-ng-click=\"OtrsPopupCtrl.setForm('start')\" data-translate=otrs_popup_back></button> <button type=submit class=\"btn btn-block btn-primary\" data-ng-disabled=\"!diskReplacement.$valid ||\n" +
    "                                           OtrsPopupCtrl.loaders.services ||\n" +
    "                                           OtrsPopupCtrl.loaders.send ||\n" +
    "                                           !OtrsPopupCtrl.intervention.confirm ||\n" +
    "                                           OtrsPopupCtrl.loaders.intervention\"><span data-translate=otrs_popup_add_ticket></span><oui-spinner data-ng-if=OtrsPopupCtrl.loaders.send data-size=s></oui-spinner></button></div></form></div></div></div>"
  );

}]);
