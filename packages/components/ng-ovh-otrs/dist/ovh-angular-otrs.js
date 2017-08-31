angular.module("ovh-angular-otrs", ["ovh-api-services", "ovh-angular-toaster", "ovh-jquery-ui-draggable-ng"]);

angular.module("ovh-angular-otrs").controller("OtrsDetailsCtrl", ["$stateParams", "$translate", "OvhApiSupport", "OvhApiCloudProject", "Toast", function ($stateParams, $translate, OvhApiSupport, OvhApiCloudProject, Toast) {
    "use strict";

    var self = this;

    function parseBodyIfThereIsSomethingToParse (body) {
        var parsedBody;

        if (!angular.isString(body)) {
            return null;
        }

        /* The order of the following regex is important ;) */

        /* each "formatted by OTRS" links inside the text */
        parsedBody = body.replace(/\[\d{1,2}\](https?:\/\/(\S+))(\s|$)/gi, '<a href="$1" target="_blank">$2</a>$3');

        /* the summary "formatted by OTRS" of links at the bottom of the text,  /!\ keep this at the end /!\ */
        parsedBody = parsedBody.replace(/\[\d{1,2}\]\s+(https?:\/\/(\S+))(\S+\s*)+$/gi, "");

        /* each other links inside the text */
        parsedBody = parsedBody.replace(/([^"']|^)(https?:\/\/([^\/\s]+\/)*([^\/\s]+)\/?)(?!"|')(\s|$)/gi, '$1<a href="$2" target="_blank">$4</a>$5');

        /* each email inside the text */
        parsedBody = parsedBody.replace(
            /(\[\d{1,2}\])?(\s)?([a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9]{2}(?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)(\s|$)/gi,
            '$2<a href="mailto:$3">$3</a>$4'
        );

        if (body === parsedBody) {
            return null;
        }

        return parsedBody;
    }

    function getTicket () {
        OvhApiSupport.Lexi().resetCache();
        OvhApiSupport.Lexi().get({ id: self.ticket.ticketId }).$promise.then(
            function (ticket) {
                if (!!ticket.serviceName && ticket.product === "publiccloud") {
                    OvhApiCloudProject.Lexi().get({ serviceName: ticket.serviceName }).$promise.then(function (project) {
                        if (!!project && !!project.description) {
                            ticket.serviceDescription = project.description;
                        }
                    }).finally(function () {
                        angular.extend(self.ticket, ticket);
                    });
                } else {
                    angular.extend(self.ticket, ticket);
                }
            },
            function (err) {
                Toast.error([($translate.instant("otrs_err_get_infos"), err.data && err.data.message) || ""].join(" "));
            }
        ).finally(function () {
            self.loaders.ticket = false;
        });
    }

    function loadMessage () {
        self.loaders.messages = true;
        OvhApiSupport.Lexi().getMessages({ id: self.ticket.ticketId }).$promise.then(
            function (messages) {
                self.messages = messages;
                for (var i = 0, imax = messages.length; i < imax; i++) {
                    messages[i].bodyCook = parseBodyIfThereIsSomethingToParse(messages[i].body);

                    /* A toggle used to display raw or cook body */
                    messages[i].displayBodyCook = !!messages[i].bodyCook;
                }
            },
            function (err) {
                Toast.error([($translate.instant("otrs_err_get_infos"), err.data && err.data.message) || ""].join(" "));
            }
        ).finally(function () {
            self.loaders.messages = false;
        });
    }

    self.reply = function () {
        if (!self.loaders.reply && self.answer.body) {
            self.loaders.reply = true;

            OvhApiSupport.Lexi().reply({ id: self.ticket.ticketId }, { body: self.answer.body }).$promise.then(
                function () {
                    self.answer.body = null;
                    getTicket();
                    loadMessage();
                },
                function (err) {
                    Toast.error([($translate.instant("otrs_detail_reply_error"), err.data && err.data.message) || ""].join(" "));
                }
            ).finally(function () {
                self.loaders.reply = false;
            });
        }
    };

    self.closeTicket = function () {
        if (!self.loaders.close) {
            self.loaders.close = true;

            OvhApiSupport.Lexi().close({ id: self.ticket.ticketId }, {}).$promise.then(
                function () {
                    self.$onInit();
                },
                function (err) {
                    Toast.error([($translate.instant("otrs_detail_close_error"), err.data && err.data.message) || ""].join(" "));
                }
            ).finally(function () {
                self.loaders.close = false;
            });
        }
    };

    self.reopenTicket = function () {
        if (!self.loaders.close) {
            self.loaders.close = true;
            self.loaders.reply = true;

            OvhApiSupport.Lexi().reopen({ id: self.ticket.ticketId }, { body: self.answer.body }).$promise.then(
                function () {
                    self.answer.body = null;
                    self.$onInit();
                },
                function (err) {
                    Toast.error([($translate.instant("otrs_detail_reopen_error"), err.data && err.data.message) || ""].join(" "));
                }
            ).finally(function () {
                self.loaders.close = false;
                self.loaders.reply = false;
            });
        }
    };

    this.$onInit = function () {

        this.ticket = {
            ticketId: $stateParams.id
        };

        this.messages = [];

        this.loaders = {
            ticket: true,
            messages: true,
            close: false,
            reply: false
        };

        this.answer = {
            body: null
        };

        getTicket();

        loadMessage();
    };

}]);

angular.module("ovh-angular-otrs")
    .config(["$stateProvider", function ($stateProvider) {
        "use strict";
        $stateProvider.state("otrs-details", {
            url: "/support/{id:int}/details",
            templateUrl: "app/module-otrs/details/otrs-details.html",
            controller: "OtrsDetailsCtrl",
            controllerAs: "OtrsDetailsCtrl",
            translations: ["common", "module-otrs", "module-otrs/details"]
        });
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
    });

angular.module("ovh-angular-otrs").controller("OtrsPopupCtrl", ["$rootScope", "$stateParams", "$translate", "$q", "OvhApiMeVipStatus", "OvhApiMe", "OvhApiSupport", "OvhApiProductsAapi", "Toast", "OtrsPopupService", "UNIVERSE", "TICKET_CATEGORIES", "OTRS_POPUP_ASSISTANCE_ENUM", "OTRS_POPUP_BILLING_ENUM", "OTRS_POPUP_INCIDENT_ENUM", "OTRS_POPUP_INTERVENTION_ENUM", function ($rootScope, $stateParams, $translate, $q, OvhApiMeVipStatus, OvhApiMe, OvhApiSupport, OvhApiProductsAapi, Toast, OtrsPopupService, UNIVERSE,
                                                                         TICKET_CATEGORIES, OTRS_POPUP_ASSISTANCE_ENUM, OTRS_POPUP_BILLING_ENUM, OTRS_POPUP_INCIDENT_ENUM, OTRS_POPUP_INTERVENTION_ENUM) {
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

    this.$onInit = function () {

        initFields();

        self.loaders = {
            send: false,
            services: true,
            models: true
        };

        self.services = [];

        self.isVIP = false;

        OvhApiProductsAapi.get({
            includeInactives: true,
            universe: UNIVERSE.toLowerCase()
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

angular.module("ovh-angular-otrs").controller("OtrsCtrl", ["$scope", "$timeout", "$q", "OvhApiSupport", "OvhApiProductsAapi", "$translate", "Toast", "OtrsPopupService", "UNIVERSE", function ($scope, $timeout, $q, OvhApiSupport, OvhApiProductsAapi, $translate, Toast, OtrsPopupService, UNIVERSE) {
    "use strict";

    var self = this;

    self.loaders = {
        table: false
    };

    self.tickets = {
        ids: [],
        detail: []
    };

    self.cloudProjects = [];

    self.status = ["open", "closed"];

    self.filters = {
        minCreationDate: "",
        maxCreationDate: "",
        serviceName: null,
        status: "",
        subject: null,
        product: null
    };

    self.search = {
        open: false
    };

    self.itemsPerPage = 10;

    self.init = function () {
        OvhApiProductsAapi.get({
            includeInactives: true,
            universe: UNIVERSE.toLowerCase()
        }).$promise.then(function (services) {
            var translationPromises = services.results.map(function (s) {
                return $translate("otrs_service_category_" + s.name, null, null, s.name).then(function (value) {
                    s.translatedName = value;
                    return s;
                });
            });

            return $q.all(translationPromises).then(function (services) { // eslint-disable-line no-shadow
                self.services = services;
                self.cloudProjects = services.find(function (s) { return s.name === "PROJECT"; });
                if (self.services.length === 1) {
                    self.ticket.serviceName = self.services[0];
                }
            });
        }).catch(function (err) { Toast.error([($translate.instant("otrs_err_get_infos"), err.data && err.data.message) || ""].join(" ")); });

        OvhApiSupport.Lexi().schema().$promise.then(
            function (schema) {
                self.types = schema.models["support.TicketTypeEnum"].enum;

                // self.categories = schema.models['support.TicketProductEnum']['enum'];
                self.categories = schema.models["support.TicketCategoryEnum"].enum;
            },
            function (err) {
                Toast.error([($translate.instant("otrs_err_get_infos"), err.data && err.data.message) || ""].join(" "));
            }
        );
        self.getTickets();
    };

    $scope.$watch("OtrsCtrl.filters", function () {
        $timeout(function () {
            self.getTickets();
        }, 0);
    }, true);

    self.getTickets = function (clearCache) {
        self.loaders.table = true;
        var filters = angular.copy(self.filters);
        filters.minCreationDate = filters.minCreationDate === "" ? null : filters.minCreationDate;
        filters.maxCreationDate = filters.maxCreationDate === "" ? null : filters.maxCreationDate;
        filters.status = filters.status === "" ? null : filters.status;

        if (filters.subject) {
            filters.subject = window.encodeURIComponent(filters.subject);
        }

        if (clearCache) {
            OvhApiSupport.Lexi().resetQueryCache();
        }

        OvhApiSupport.Lexi().query(filters).$promise.then(
            function (ticketIds) {

                if (_.isEqual(self.tickets.ids, ticketIds)) {
                    self.loaders.table = false;
                } else {
                    if (ticketIds.length === 0) {
                        self.loaders.table = false;
                    }
                    self.tickets.ids = ticketIds;
                }
            },
            function (err) {
                Toast.error([($translate.instant("otrs_err_get_infos"), err.data && err.data.message) || ""].join(" "));
            }
        ).finally(function () {
            self.loaders.table = false;
        });
    };

    self.transformItem = function (ticketId) {
        self.loaders.table = true;
        return OvhApiSupport.Lexi().get({ id: ticketId }).$promise.then(function (ticket) {
            ticket.serviceDescription = self.getServiceDescription(ticket);
            return ticket;
        });
    };

    self.getServiceDescription = function (ticket) {
        var description;

        if (!_.isEmpty(self.cloudProjects)) {
            var service = self.cloudProjects.services.find(function (s) { return s.serviceName === ticket.serviceName; });

            if (!_.isEmpty(service)) {
                description = service.displayName;
            }
        }

        return description;
    };

    self.onTransformItemDone = function () {
        self.loaders.table = false;
    };

    $scope.$on("ticket.otrs.reload", function () {
        self.getTickets(true);
    });

    self.openDialog = function () {
        if (!OtrsPopupService.isLoaded()) {
            OtrsPopupService.init();
        } else {
            OtrsPopupService.toggle();
        }
    };

    self.init();
}]);

angular.module("ovh-angular-otrs")
    .config(["$stateProvider", function ($stateProvider) {
        "use strict";
        $stateProvider.state("otrs-list", {
            url: "/support",
            templateUrl: "app/module-otrs/otrs.html",
            controller: "OtrsCtrl",
            controllerAs: "OtrsCtrl",
            translations: ["common", "module-otrs"]
        });
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

  $templateCache.put('app/module-otrs/details/otrs-details.html',
    "<section class=otrs-details><header><a class=section-back-link data-ui-sref=otrs-list title=\"{{ ::'otrs_back_to_list' | translate}}\"><i class=\"ovh-font ovh-font-arrow-left\"></i> <span data-translate=otrs_detail_title></span></a><h1 data-translate=otrs_detail_tiket_title data-translate-values=\"{id: OtrsDetailsCtrl.ticket.ticketNumber}\"></h1></header><div class=otrs-details><div class=\"row top-space-m20 text-center\" data-ng-show=\"OtrsDetailsCtrl.loaders.ticket || OtrsDetailsCtrl.loaders.messages\"><spinner></spinner></div><div class=\"row top-space-m20\" data-ng-hide=OtrsDetailsCtrl.loaders.ticket><div class=col-md-9><div data-ng-hide=\"OtrsDetailsCtrl.loaders.ticket === true\" class=row><div class=col-md-6><p class=wordbreak><strong data-translate=otrs_detail_subject></strong> <span data-ng-bind=OtrsDetailsCtrl.ticket.subject></span></p><p class=wordbreak><strong data-translate=otrs_detail_serviceName></strong> <span data-ng-bind=\"OtrsDetailsCtrl.ticket.serviceDescription || OtrsDetailsCtrl.ticket.serviceName || i18n.otrs_service_other_services | translate\"></span></p><p data-ng-if=ticket.product><strong data-translate=otrs_popup_category></strong> <span data-ng-bind=\"( 'otrs_category_' + OtrsDetailsCtrl.ticket.product | translate)  || OtrsDetailsCtrl.ticket.product\"></span></p><p><strong data-translate=otrs_popup_type></strong> <span data-ng-bind=\"( 'otrs_types_' + OtrsDetailsCtrl.ticket.type | translate) || OtrsDetailsCtrl.ticket.type\"></span></p></div><div class=col-md-6><p><strong class=bold data-translate=otrs_detail_creationDate></strong> <span data-ng-bind=\"OtrsDetailsCtrl.ticket.creationDate | date : 'short'\"></span></p><p><strong data-translate=otrs_detail_updateDate></strong> <span data-ng-bind=\"OtrsDetailsCtrl.ticket.updateDate | date : 'short'\"></span></p></div></div></div><div class=\"col-md-3 col-xs-12\" data-ng-hide=\"OtrsDetailsCtrl.loaders.messages === true\"><button type=button class=\"btn btn-primary col-xs-12\" data-ng-click=OtrsDetailsCtrl.closeTicket() data-ng-disabled=\"OtrsDetailsCtrl.loaders.close || OtrsDetailsCtrl.loaders.reply\" data-ng-if=\"OtrsDetailsCtrl.ticket.state !== 'closed'\"><i class=\"glyphicon glyphicon-lock\" aria-hidden=true></i> <span data-translate=otrs_detail_close></span></button></div></div><div class=row data-ng-hide=OtrsDetailsCtrl.loaders.messages><div class=\"col-md-9 col-xs-12\"><div data-ng-repeat=\"message in OtrsDetailsCtrl.messages | orderBy:'creationDate' track by $index\"><div class=\"col-md-10 col-xs-12\" data-ng-class=\"{'ovh-message': message.from !== 'customer', 'customer-message col-md-offset-2': message.from === 'customer'}\"><div class=bold><span data-ng-bind=\"('otrs_detail_from_' + message.from | translate)\"></span> <button type=button class=\"btn pull-right\" data-ng-if=message.bodyCook data-ng-click=\"message.displayBodyCook = !message.displayBodyCook\"><span data-ng-show=message.displayBodyCook><small data-translate=otrs_detail_raw_version class=hidden-xs></small> <i class=\"glyphicon glyphicon-eye-close\" aria-hidden=true></i> </span><span data-ng-hide=message.displayBodyCook><small data-translate=otrs_detail_cook_version class=hidden-xs></small> <i class=\"glyphicon glyphicon-eye-open\" aria-hidden=true></i></span></button></div><pre data-ng-show=message.displayBodyCook data-ng-bind-html=message.bodyCook></pre><pre data-ng-hide=message.displayBodyCook data-ng-bind=message.body></pre><div class=pull-right data-ng-bind=\"message.creationDate | date:'short'\"></div></div></div></div></div><div class=row data-ng-hide=OtrsDetailsCtrl.loaders.messages><div class=\"col-md-9 col-xs-12\"><textarea data-ng-model=OtrsDetailsCtrl.answer.body style=\"width: 100%\" rows=4 data-ng-disabled=OtrsDetailsCtrl.loaders.reply></textarea><p class=italic data-ng-if=\"OtrsDetailsCtrl.ticket.state !== 'closed'\" data-translate=otrs_detail_info></p><p class=italic data-ng-if=\"OtrsDetailsCtrl.ticket.state === 'closed'\" data-translate=otrs_detail_info2></p></div><div class=\"col-md-3 col-xs-12\"><button class=\"btn btn-primary col-xs-12\" data-ng-click=OtrsDetailsCtrl.reply() type=button data-ng-disabled=\"OtrsDetailsCtrl.loaders.reply || !OtrsDetailsCtrl.answer.body || OtrsDetailsCtrl.loaders.close\" data-ng-if=\"OtrsDetailsCtrl.ticket.state !== 'closed'\"><spinner data-ng-show=OtrsDetailsCtrl.loaders.reply class=pull-left></spinner><i class=\"glyphicon glyphicon-share-alt\" aria-hidden=true></i> <span data-translate=otrs_detail_reply></span></button> <button type=button class=\"btn btn-primary col-xs-12\" data-ng-click=OtrsDetailsCtrl.reopenTicket() data-ng-disabled=\"OtrsDetailsCtrl.loaders.reply || !OtrsDetailsCtrl.answer.body || OtrsDetailsCtrl.loaders.close\" data-ng-if=\"OtrsDetailsCtrl.ticket.state === 'closed'\"><spinner data-ng-show=OtrsDetailsCtrl.loaders.reply class=pull-left></spinner><i class=\"glyphicon glyphicon-repeat\" aria-hidden=true></i> <span data-translate=otrs_detail_reopen></span></button></div></div></div></section>"
  );


  $templateCache.put('app/module-otrs/otrs-popup/otrs-popup.html',
    "<div data-draggable class=\"draggable otrs-popup\" options=\"{containment: 'body', handle: '#headerPopup, #contentPopup form' }\" data-ng-class=\"{\n" +
    "        'minimize' : status.minimize,\n" +
    "        'maximize' : status.maximize,\n" +
    "        'close'    : status.close\n" +
    "    }\"><div class=draggable-header id=headerPopup><span data-translate=otrs_popup_title></span><div class=\"otrs_popup_tools pull-right\"><button type=button aria-label=\"{{'otrs_popup_icon_minimize' | translate}}\" data-ng-click=minimize()><i class=\"fa fa-window-minimize\" aria-hidden=true></i></button> <button type=button aria-label=\"{{'otrs_popup_icon_maximize' | translate}}\" data-ng-click=toggle()><i class=\"fa fa-window-maximize\" aria-hidden=true></i></button> <button type=button aria-label=\"{{'otrs_popup_icon_close' | translate}}\" data-ng-click=close()><i class=\"fa fa-close\" aria-hidden=true></i></button></div></div><div id=contentPopup data-ng-controller=\"OtrsPopupCtrl as OtrsPopupCtrl\"><p class=\"italic fs10 center bottom-space\" data-translate=otrs_popup_move></p><p class=\"text-center bottom-space\" data-ng-if=OtrsPopupCtrl.isVIP><em data-translate=otrs_vip_phone></em></p><form name=OtrsPopupCtrl.otrsPopupForm id=otrsPopupForm novalidate data-ng-submit=OtrsPopupCtrl.sendTicket() class=\"ovh-form-flat animate-opacity2-leave\"><div class=col-xs-12><div class=row><div class=col-xs-12><label class=control-label for=select-services data-translate=otrs_popup_service></label><spinner data-ng-show=OtrsPopupCtrl.loaders.services class=pull-right></spinner></div></div><div class=\"flat-input-container row\"><div class=col-xs-12><select flat-select id=select-services name=select-services class=form-control required data-ng-model=OtrsPopupCtrl.ticket.serviceName data-ng-disabled=OtrsPopupCtrl.loaders.services><optgroup data-ng-repeat=\"category in OtrsPopupCtrl.services track by $index\" label=\"{{ category.translatedName }}\"><option data-ng-repeat=\"service in category.services track by $index\" value=\"{{ service.serviceName }}\" data-ng-bind=service.displayName></option></optgroup></select></div></div></div><div class=col-xs-12 data-ng-if=OtrsPopupCtrl.isVIP><div class=row><div class=col-xs-12><label class=control-label for=select-types translate=otrs_popup_type></label><spinner data-ng-show=OtrsPopupCtrl.loaders.models class=pull-right></spinner></div></div><div class=\"flat-input-container row\"><div class=col-xs-12><select flat-select id=select-types name=select-types class=form-control data-ng-model=OtrsPopupCtrl.ticket.type data-ng-options=\"type as ( 'otrs_types_'+type | translate ) for type in OtrsPopupCtrl.types\" data-ng-disabled=OtrsPopupCtrl.loaders.models></select></div></div></div><div class=col-xs-12><div class=row><div class=col-xs-12><label class=control-label for=select-requests translate=otrs_category_choice></label><spinner data-ng-show=OtrsPopupCtrl.loaders.models class=pull-right></spinner></div></div><div class=\"flat-input-container row\"><div class=col-xs-12><select flat-select id=select-requests name=select-requests class=form-control required data-ng-model=OtrsPopupCtrl.ticket.category data-ng-options=\"request as ( 'otrs_category_'+request | translate ) for request in OtrsPopupCtrl.requests\" data-ng-disabled=OtrsPopupCtrl.loaders.models></select></div></div></div><div class=col-xs-12 data-ng-show=OtrsPopupCtrl.ticket.category><div class=row><div class=col-xs-12><label class=control-label for=select-subCategories translate=otrs_subCategory_choice></label><spinner data-ng-show=OtrsPopupCtrl.loaders.models class=pull-right></spinner></div></div><div class=\"flat-input-container row\"><div class=col-xs-12><select flat-select id=select-subCategories name=select-requests class=form-control required data-ng-model=OtrsPopupCtrl.ticket.subcategory data-ng-options=\"subCategory as ('otrs_subCategory_' + OtrsPopupCtrl.ticket.category + '_' + subCategory | translate) for subCategory in OtrsPopupCtrl.subCategories[OtrsPopupCtrl.ticket.category]\" data-ng-disabled=OtrsPopupCtrl.loaders.models></select></div></div></div><div class=col-xs-12><div flat-input-container><div class=row><div class=col-xs-12><label class=control-label for=txt-subject>{{'otrs_popup_subject' | translate}}</label></div></div><div class=row><div class=col-xs-12><input id=txt-subject name=txt-subject class=form-control data-ng-model=OtrsPopupCtrl.ticket.subject required placeholder=\"{{'otrs_popup_subject' | translate}}\"></div></div></div></div><div class=col-xs-12><div flat-input-container><div class=row><div class=col-xs-12><label class=control-label for=txt-message>{{'otrs_popup_body' | translate}}</label></div></div><div class=row><div class=col-xs-12><textarea id=txt-message name=txt-message class=form-control rows=8 required data-ng-model=OtrsPopupCtrl.ticket.body placeholder=\"{{'otrs_popup_body' | translate}}\">\n" +
    "                            </textarea></div></div></div></div><div class=\"col-xs-12 top-space-m12\"><button type=submit class=\"btn btn-primary col-xs-12\" data-ng-disabled=\"!OtrsPopupCtrl.otrsPopupForm.$valid || OtrsPopupCtrl.loaders.services || OtrsPopupCtrl.loaders.send\"><i class=\"glyphicon glyphicon-envelope\" aria-hidden=true></i> <span translate=otrs_popup_add_ticket></span><spinner data-ng-show=OtrsPopupCtrl.loaders.send class=left-space-m20></spinner></button></div></form></div></div>"
  );


  $templateCache.put('app/module-otrs/otrs.html',
    "<div class=module-otrs><header class=module-otrs-title><h1 data-translate=otrs_menu_ticket_list_title></h1></header><div class=module-otrs-content><div class=row><div class=col-xs-12><div class=clearfix><button type=button class=\"btn btn-search pull-right\" data-ng-class=\"{ 'visibility-hide' : OtrsCtrl.loaders.table }\" data-ng-click=\"OtrsCtrl.search.open = !OtrsCtrl.search.open\"><i data-ng-hide=OtrsCtrl.search.open class=\"fa fa-search right-space-m8\" aria-hidden=true></i> <i data-ng-show=OtrsCtrl.search.open class=\"fa fa-times right-space-m8\" aria-hidden=true></i> {{'otrs_filters_button' | translate}}</button> <button type=button class=\"btn btn-primary pull-right right-space-m8\" data-ng-class=\"{ 'visibility-hide' : OtrsCtrl.loaders.table}\" data-ng-click=OtrsCtrl.openDialog()><i class=\"glyphicon glyphicon-plus right-space-m8\" aria-hidden=true></i> {{'otrs_menu_ticket_create' | translate}}</button></div><form name=searchTicketsForm novalidate data-ng-slide-down=OtrsCtrl.search.open duration=0.3 data-ng-show=OtrsCtrl.search.open class=\"ovh-form-flat animate-opacity2-leave\"><div class=\"top-space-p4 clearfix row\"><div class=\"col-md-3 col-xs-12 col-md-offset-3 col-xs-offset-0\"><div class=row><div class=col-xs-12><label class=control-label for=select-services data-translate=otrs_ticket_service></label></div></div><div class=\"flat-input-container row\"><div class=col-xs-12><select flat-select id=select-services name=select-services class=form-control data-ng-model=OtrsCtrl.filters.serviceName><option value=\"\" data-translate=otrs_no_filter></option><optgroup data-ng-repeat=\"category in OtrsCtrl.services | orderBy: 'translatedName' track by $index\" label=\"{{ category.translatedName }}\"><option data-ng-repeat=\"service in category.services track by $index\" value=\"{{ service.serviceName }}\" data-ng-bind=service.displayName></option></optgroup></select></div></div></div><div class=\"col-md-3 col-xs-12\"><div class=row><div class=col-xs-12><label class=control-label for=select-state data-translate=otrs_ticket_state></label></div></div><div class=\"flat-input-container row\"><div class=col-xs-12><select flat-select id=select-state name=select-state class=form-control data-ng-model=OtrsCtrl.filters.status data-ng-options=\"status as ('otrs_ticket_state_' + status | translate) for status in OtrsCtrl.status\"><option value=\"\" data-translate=otrs_no_filter></option></select></div></div></div><div class=\"col-md-3 col-xs-12\"><div class=row><div class=col-xs-12><label class=control-label for=select-categories data-translate=otrs_ticket_category></label></div></div><div class=row flat-input-container><div class=col-xs-12><select flat-select id=select-categories name=select-categories class=form-control data-ng-model=OtrsCtrl.filters.category data-ng-options=\"category as ('otrs_category_'+category | translate) for category in OtrsCtrl.categories\"><option value=\"\" data-translate=otrs_no_filter></option></select></div></div></div></div><div class=\"top-space-p4 clearfix row\"><div class=\"col-md-3 col-xs-12 col-md-offset-6 col-xs-offset-0\"><div class=row><div class=col-xs-12><label class=control-label for=date-creation-start data-translate=otrs_ticket_date_creation_include></label></div></div><div class=row flat-input-container><div class=col-xs-12><div class=input-group><div class=input-group-addon><i class=\"fa fa-calendar\" aria-hidden=true></i></div><input class=\"form-control datepicker-ui-pretty\" id=date-creation-start name=date-creation-start data-uib-datepicker-popup=shortDate data-is-open=openedCreationStart data-ng-click=\"openedCreationStart = true\" data-ui-validate-watch=\"'OtrsCtrl.search.creationEnd'\" data-ui-validate=\"{ 'startBeforeEndDate' : '!$value\n" +
    "                                                                 || !OtrsCtrl.filters.maxCreationDate\n" +
    "                                                                 || OtrsCtrl.filters.maxCreationDate > $value' }\" data-ng-model=OtrsCtrl.filters.minCreationDate data-ng-disabled=OtrsCtrl.loaders.table><div class=input-group-btn data-ng-show=OtrsCtrl.filters.minCreationDate><button type=button class=\"no-style btn\" data-ng-click=\"OtrsCtrl.filters.minCreationDate = null\" data-ng-disabled=OtrsCtrl.loaders.table><i class=\"fa fa-times\" aria-hidden=true></i></button></div></div></div></div></div><div class=\"col-md-3 col-xs-12\"><div class=row><div class=col-xs-12><label class=control-label for=date-creation-end data-translate=otrs_ticket_date_creation_exclude></label></div></div><div class=row flat-input-container><div class=col-xs-12><div class=input-group><div class=input-group-addon><i class=\"fa fa-calendar\" aria-hidden=true></i></div><input class=\"form-control datepicker-ui-pretty\" id=date-creation-end name=searchCreationEnd data-uib-datepicker-popup=shortDate data-is-open=openedCreationEnd data-ng-click=\"openedCreationEnd = true\" data-ng-model=OtrsCtrl.filters.maxCreationDate data-ui-validate-watch=\"'OtrsCtrl.filters.minCreationDate'\" data-ui-validate=\"{'startBeforeEndDate' : '!$value\n" +
    "                                                                 || !OtrsCtrl.filters.minCreationDate\n" +
    "                                                                 || OtrsCtrl.filters.minCreationDate < $value' }\" data-ng-disabled=OtrsCtrl.loaders.table><div class=input-group-btn data-ng-show=OtrsCtrl.filters.maxCreationDate><button type=button class=\"no-style btn\" data-ng-click=\"OtrsCtrl.filters.maxCreationDate = null\" data-ng-disabled=OtrsCtrl.loaders.table><i class=\"fa fa-times\" aria-hidden=true></i></button></div></div></div></div></div></div></form><div class=\"table-responsive-vertical shadow-z-1 top-space-m12\"><table class=\"table table-pretty table-hover table-striped\"><thead><tr><th data-translate=otrs_ticket_number></th><th data-translate=otrs_ticket_service></th><th data-translate=otrs_ticket_category></th><th data-translate=otrs_ticket_type></th><th data-translate=otrs_ticket_suject></th><th data-translate=otrs_ticket_last_message_from></th><th data-translate=otrs_ticket_date_creation></th><th data-translate=otrs_ticket_date_update></th><th data-translate=otrs_ticket_state></th><th class=text-center><button type=button class=no-style data-ng-click=OtrsCtrl.getTickets(true)><i class=\"glyphicon glyphicon-refresh\" aria-hidden=true></i></button></th></tr></thead><tbody data-ng-show=OtrsCtrl.loaders.table><tr><td colspan=10 class=text-center><spinner></spinner></td></tr></tbody><tbody data-ng-if=\"!OtrsCtrl.loaders.table && OtrsCtrl.tickets.ids.length === 0\"><tr><td colspan=10 class=text-center><span data-translate=otrs_ticket_empty></span></td></tr></tbody><tbody data-ng-hide=OtrsCtrl.loaders.table><tr data-ng-repeat=\"ticket in OtrsCtrl.tickets.detail track by $index\" class=row-clickable><td data-title=\"{{::'otrs_ticket_number' | translate}}\" class=word-break><a ui-sref=\"otrs-details({id: ticket.ticketId})\" data-ng-bind=ticket.ticketNumber></a></td><td data-title=\"{{::'otrs_ticket_service' | translate}}\" class=word-break><a ui-sref=\"otrs-details({id: ticket.ticketId})\" data-ng-bind=\"ticket.serviceDescription || ticket.serviceName || 'otrs_service_category_other' | translate\"></a></td><td data-title=\"{{::'otrs_ticket_category' | translate}}\" class=word-break><a ui-sref=\"otrs-details({id: ticket.ticketId})\" data-ng-bind=\"'otrs_category_' + ticket.category | translate\"></a></td><td data-title=\"{{::'otrs_ticket_type' | translate}}\" class=word-break><a ui-sref=\"otrs-details({id: ticket.ticketId})\" data-ng-bind=\"'otrs_types_' + ticket.type | translate\"></a></td><td data-title=\"{{::'otrs_ticket_suject' | translate}}\" class=word-break><a ui-sref=\"otrs-details({id: ticket.ticketId})\" data-ng-bind=ticket.subject></a></td><td data-title=\"{{::'otrs_ticket_last_message_from' | translate}}\" class=word-break><a ui-sref=\"otrs-details({id: ticket.ticketId})\" data-ng-bind=\"'otrs_ticket_lastMessageFrom_' + ticket.lastMessageFrom | translate\"></a></td><td data-title=\"{{::'otrs_ticket_date_creation' | translate}}\" class=word-break><a ui-sref=\"otrs-details({id: ticket.ticketId})\" data-ng-bind=\"ticket.creationDate | date:'short'\"></a></td><td data-title=\"{{::'otrs_ticket_date_update' | translate}}\" class=word-break><a ui-sref=\"otrs-details({id: ticket.ticketId})\" data-ng-bind=\"ticket.updateDate | date:'short'\"></a></td><td data-title=\"{{::'otrs_ticket_state' | translate}}\" class=word-break><a ui-sref=\"otrs-details({id: ticket.ticketId})\" data-ng-bind=\"'otrs_ticket_state_' + ticket.state | translate\"></a></td><td class=text-center><a ui-sref=\"otrs-details({id: ticket.ticketId})\"><i class=\"glyphicon glyphicon-search\" aria-hidden=true></i></a></td></tr></tbody></table></div><div class=table-pretty-pagination data-pagination-front data-items=OtrsCtrl.tickets.ids data-paginated-items=OtrsCtrl.tickets.detail data-current-page=currentPage data-items-per-page=OtrsCtrl.itemsPerPage data-nb-pages=nbPages data-transform-item=OtrsCtrl.transformItem(item) data-on-transform-item-done=OtrsCtrl.onTransformItemDone(items) data-page-placeholder=\"{{ 'common_pagination_page' | translate:{currentPage: currentPage, nbPages : nbPages} }}\" data-item-per-page-placeholder=\"{{ 'common_pagination_display' | translate }}\"></div></div></div></div></div>"
  );

}]);
