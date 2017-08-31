angular.module("ovh-angular-otrs").controller("OtrsDetailsCtrl", function ($stateParams, $translate, OvhApiSupport, OvhApiCloudProject, Toast) {
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

});
