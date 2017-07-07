angular.module("ovh-angular-otrs").controller("OtrsCtrl", function ($scope, $timeout, $q, Support, ProductsAapi, $translate, Toast, OtrsPopupService, UNIVERSE) {
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
        ProductsAapi.get({
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

        Support.Lexi().schema().$promise.then(
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
            Support.Lexi().resetQueryCache();
        }

        Support.Lexi().query(filters).$promise.then(
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
        return Support.Lexi().get({ id: ticketId }).$promise.then(function (ticket) {
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
});
