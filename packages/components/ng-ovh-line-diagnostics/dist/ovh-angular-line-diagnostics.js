"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

angular.module("ovh-angular-line-diagnostics", ["ovh-api-services"]);

angular.module("ovh-angular-line-diagnostics").component("lineDiagnostics", {
    bindings: {
        lineNumber: "@",
        serviceName: "@"
    },
    templateUrl: "/ovh-angular-line-diagnostics/src/ovh-angular-line-diagnostics/ovh-angular-line-diagnostics.html",
    controllerAs: "$ctrl",
    controller: function () {
        function controller($interval, $q, $translate, LineDiagnostics, LineDiagnosticFactory, Toast, DIAGNOSTICS_CONSTANTS) {
            _classCallCheck(this, controller);

            this.$q = $q;
            this.$interval = $interval;
            this.$translate = $translate;
            this.LineDiagnosticsService = LineDiagnostics;
            this.LineDiagnosticFactory = LineDiagnosticFactory;
            this.Toast = Toast;
            this.constants = DIAGNOSTICS_CONSTANTS;
        }

        _createClass(controller, [{
            key: "animateProgressBar",
            value: function animateProgressBar() {
                var _this = this;

                var intervalProgressBar = 1000;
                var progressStep = 20;
                var limitProgress = 90;
                this.incidentTestProgression = 0;
                this.progressBarCycle = this.$interval(function () {
                    if (_this.incidentTestProgression + progressStep < limitProgress) {
                        _this.incidentTestProgression = _.random(_this.incidentTestProgression, _this.incidentTestProgression + progressStep);
                    }
                }, intervalProgressBar);
            }
        }, {
            key: "runLineDiagnostic",
            value: function runLineDiagnostic(requestParam) {
                var _this2 = this;

                this.loadingAction = true;

                return this.LineDiagnosticsService.getRunDiagnostic({
                    number: this.lineNumber,
                    serviceName: this.serviceName
                }, requestParam).then(function (lineDiagnostic) {
                    _this2.buildLineDiagnostic(lineDiagnostic);
                    _this2.checkDiagnosticStatus();
                    _this2.setCurrentStep();
                    return lineDiagnostic;
                }, function (error) {
                    if (!_.isEmpty(error)) {
                        _this2.Toast.error([_this2.$translate.instant("tools_lineDiagnostics_diagnostic_run_error"), _.get(error, "data.message", "")].join(" "));
                        _this2.stopPoller();
                    }
                    return _this2.$q.reject(error);
                }).finally(function () {
                    _this2.loadingAction = false;
                    _this2.incidentTestProgression = 100;
                    if (_this2.progressBarCycle) {
                        _this2.$interval.cancel(_this2.progressBarCycle);
                        _this2.progressBarCycle = null;
                    }
                });
            }
        }, {
            key: "cancelLineDiagnostic",
            value: function cancelLineDiagnostic() {
                var _this3 = this;

                this.LineDiagnosticService.getCancelDiagnostic({ number: this.lineNumber, serviceName: this.serviceName }).$promise.catch(function (error) {
                    _this3.Toast.error([_this3.$translate.instant("tools_lineDiagnostics_diagnostic_cancel_error"), _.get(error, "data.message", "")].join(" "));
                    return _this3.$q.reject(error);
                });
            }
        }, {
            key: "goOnInvestigationStep",
            value: function goOnInvestigationStep() {
                this.currentStep = this.constants.STEPS.INVESTIGATION.LABEL;
            }
        }, {
            key: "setCurrentStep",
            value: function setCurrentStep() {
                var steps = this.constants.STEPS;
                var actions = this.currentLineDiagnostic.getActionsToDo();
                var questions = this.currentLineDiagnostic.getQuestionsToAnswer();

                switch (this.currentLineDiagnostic.faultType) {
                    case this.constants.FAULT_TYPES.UNKNOWN:
                        this.currentStep = steps.INCIDENT_DETECTION.LABEL;
                        break;
                    case this.constants.FAULT_TYPES.NO_SYNCHRONIZATION:
                        if (_.isEqual(this.constants.STEPS.INCIDENT_DETECTION.QUESTIONS, questions) || _.isEqual(this.constants.STEPS.INCIDENT_DETECTION.ACTIONS, actions)) {
                            this.currentStep = steps.INCIDENT_DETECTION.LABEL;
                        } else {
                            // TODO: remove
                            this.currentStep = steps.INVESTIGATION.LABEL;
                        }
                        break;
                    case this.constants.FAULT_TYPES.ALIGNMENT:
                    case this.constants.FAULT_TYPES.SYNC_LOSS_OR_LOW_BANDWIDTH:
                        this.currentStep = steps.INCIDENT_DETECTION.LABEL;
                        break;
                    default:
                        this.currentStep = steps.INCIDENT_DETECTION.LABEL;
                }
            }
        }, {
            key: "checkDiagnosticStatus",
            value: function checkDiagnosticStatus() {
                if (this.currentLineDiagnostic.status === this.constants.STATUS.WAITING_ROBOT) {
                    this.startPoller(this.currentLineDiagnostic);
                } else if (_.includes(_.union(this.constants.STATUS.END, this.constants.STATUS.PAUSE), this.currentLineDiagnostic.status)) {
                    this.stopPoller();
                } else if (this.currentLineDiagnostic.status === this.constants.STATUS.PROBLEM) {
                    this.stopPoller();
                    this.cancelLineDiagnostic();
                }
            }
        }, {
            key: "setModemStatus",
            value: function setModemStatus(status) {
                this.currentLineDiagnostic.data.answers.modemIsSynchronized = status;
                this.startPoller();
            }
        }, {
            key: "startPoller",
            value: function startPoller() {
                this.runLineDiagnostic(this.currentLineDiagnostic.convertToRequestParams());
            }
        }, {
            key: "stopPoller",
            value: function stopPoller() {
                this.LineDiagnosticsService.deletePollDiagnostic();
            }
        }, {
            key: "buildLineDiagnostic",
            value: function buildLineDiagnostic(lineDiagnostic) {
                this.currentLineDiagnostic = new this.LineDiagnosticFactory(lineDiagnostic);
            }
        }, {
            key: "setModemUnplug",
            value: function setModemUnplug(unplugAction) {
                this.currentLineDiagnostic.addActionDone(unplugAction);
                this.runLineDiagnostic(this.currentLineDiagnostic.convertToRequestParams());
            }
        }, {
            key: "$onInit",
            value: function $onInit() {
                var _this4 = this;

                this.currentLineDiagnostic = null;
                this.currentStep = this.constants.STEPS.INCIDENT_DETECTION.LABEL;
                this.loadingAction = false;
                this.loadingQuestion = false;
                this.progressBarCycle = null;
                this.waitingRobotAction = false;

                this.LineDiagnosticsService.loadTranslations().then(function () {
                    var requestParam = {};
                    _this4.translateReady = true;
                    _this4.animateProgressBar();

                    // DEBUG
                    if (_this4.serviceName === "xdsl-ls148374-2") {
                        requestParam = {
                            faultType: "alignment",
                            answers: {
                                modemType: "forceAlignment"
                            }
                        };
                    }

                    _this4.runLineDiagnostic(requestParam);
                }, function () {
                    _this4.translateReady = null;
                });
            }
        }, {
            key: "$onDestroy",
            value: function $onDestroy() {
                this.stopPoller();
            }
        }]);

        return controller;
    }()
});

angular.module("ovh-angular-line-diagnostics").constant("DIAGNOSTICS_CONSTANTS", {
    STEPS: {
        INCIDENT_DETECTION: {
            LABEL: "incidentDetectionStep",
            ACTIONS: ["unplugModem"],
            QUESTIONS: ["modemIsSynchronized"]
        },
        INVESTIGATION: {
            LABEL: "investigationStep",
            ACTIONS: []
        },
        SOLUTION_PROPOSAL: {
            LABEL: "solutionProposalStep",
            ACTIONS: []
        }
    },
    FAULT_TYPES: {
        UNKNOWN: "unknown",
        NO_SYNCHRONIZATION: "noSync",
        ALIGNMENT: "alignment",
        SYNC_LOSS_OR_LOW_BANDWIDTH: "syncLossOrLowBandwidth"
    },
    STATUS: {
        END: ["cancelled", "connectionProblem", "haveToConnectModemOnTheRightPlug", "interventionRequested", "resolvedAfterTests", "validationRefused"],
        PAUSE: ["init", "sleeping", "waitingHuman"],
        PROBLEM: "problem",
        SPECIAL: [],
        WAITING_ROBOT: "waitingRobot"
    }
});

angular.module("ovh-angular-line-diagnostics").factory("LineDiagnosticFactory", function () {
    var mandatoryOptions = ["data", "faultType", "id", "status"];

    var LineDiagnostic = function () {
        function LineDiagnostic(lineDiagnostic) {
            _classCallCheck(this, LineDiagnostic);

            _.forEach(mandatoryOptions, function (option) {
                if (!_.has(lineDiagnostic, option)) {
                    throw new Error(option + " option must be specified when creating a new LineDiagnostic");
                }
            });

            this.id = lineDiagnostic.id;
            this.faultType = lineDiagnostic.faultType;
            this.status = lineDiagnostic.status;
            this.data = lineDiagnostic.data;
        }

        _createClass(LineDiagnostic, [{
            key: "getActionsToDo",
            value: function getActionsToDo() {
                var actionsToDo = _.get(this, "data.actionsToDo", []);
                return _.chain(actionsToDo).map("name").flatten().value();
            }
        }, {
            key: "hasActionToDo",
            value: function hasActionToDo(actionName) {
                return _.includes(this.getActionsToDo(), actionName);
            }
        }, {
            key: "getActionsDone",
            value: function getActionsDone() {
                var actionsDone = _.get(this, "data.actionsDone", []);
                return _.chain(actionsDone).map("name").flatten().value();
            }
        }, {
            key: "addActionDone",
            value: function addActionDone(actionsToAdd) {
                if (_.isArray(actionsToAdd)) {
                    this.data.actionsDone = _.union(this.data.actionsDone, actionsToAdd);
                } else {
                    this.data.actionsDone.push(actionsToAdd);
                }
            }
        }, {
            key: "getQuestionsToAnswer",
            value: function getQuestionsToAnswer() {
                var questions = _.get(this, "data.toAnswer", []);
                return _.chain(questions).map("name").flatten().value();
            }
        }, {
            key: "hasQuestionToAnswer",
            value: function hasQuestionToAnswer(questionName) {
                return _.includes(this.getQuestionsToAnswer(), questionName);
            }
        }, {
            key: "convertToRequestParams",
            value: function convertToRequestParams() {
                var defaultFaultType = "unknown";
                return {
                    actionsDone: this.data.actionsDone,
                    answers: this.data.answers,
                    faultType: this.faultType || defaultFaultType
                };
            }
        }]);

        return LineDiagnostic;
    }();

    return LineDiagnostic;
});

angular.module("ovh-angular-line-diagnostics").provider("LineDiagnostics", function () {
    "use strict";

    // let translationPath = "./node_modules/@bower_components/ovh-angular-line-diagnostics/dist";

    var requestProxy = "$http";
    var translationPath = "../bower_components/ovh-angular-line-diagnostics/dist";
    var pollingApiOptions = null;
    var pathPrefix = "";

    this.setPathPrefix = function (prefix) {
        if (prefix) {
            pathPrefix = prefix;
        }
        return pathPrefix;
    };

    this.setProxy = function (proxy) {
        if (proxy !== undefined) {
            requestProxy = proxy;
        }
        return requestProxy;
    };

    this.setpollingApiOptions = function (apiOptions) {
        if (apiOptions !== undefined) {
            pollingApiOptions = apiOptions;
        }
        return pollingApiOptions;
    };

    this.setTranslationsPath = function (transPath) {
        if (transPath !== undefined) {
            translationPath = transPath;
        }
        return translationPath;
    };

    this.$get = ["$injector", "Poller", "$translatePartialLoader", "$translate", "OvhApiXdslDiagnosticLines", function ($injector, Poller, $translatePartialLoader, $translate, OvhApiXdslDiagnosticLines) {
        var lineDiagnosticsService = {};
        var api = $injector.get(requestProxy);

        lineDiagnosticsService.loadTranslations = function () {
            angular.forEach([translationPath], function (part) {
                $translatePartialLoader.addPart(part);
            });

            return $translate.refresh();
        };

        lineDiagnosticsService.getRunDiagnostic = function (uriParams, datas) {
            var syncParam = { faultType: "unknown" };
            var postParams = datas && datas.faultType ? datas : angular.extend(syncParam, datas || {});

            if (postParams && postParams.answers) {
                _.forIn(postParams.answers, function (attribut, key) {
                    if (attribut === "true" || attribut === "false") {
                        postParams.answers[key] = postParams.answers[key] === "true";
                    }
                });
            }

            return OvhApiXdslDiagnosticLines.v6().runDiagnostic(_.merge(uriParams, postParams));
        };

        lineDiagnosticsService.getCancelDiagnostic = function (uriParams) {
            return OvhApiXdslDiagnosticLines.v6().cancelDiagnostic(uriParams);
        };

        lineDiagnosticsService.deletePollDiagnostic = function () {
            return OvhApiXdslDiagnosticLines.v6().killPollerDiagnostic();
        };

        // lineDiagnosticsService.getDiagnosticPassRobot = function (serviceName, num) {
        //    return api.post([pathPrefix, 'line', serviceName, 'diagnostic/noSync/passRobot', num].join('/'));
        // };

        lineDiagnosticsService.getWaitingValidationDiagnostics = function () {
            var $q = $injector.get("$q");
            return api.get([pathPrefix, "diagnostic/getWaitingValidationDiagnostics"].join("/")).then(function (result) {
                return result.data;
            }, function (err) {
                return $q.reject(err);
            });
        };

        lineDiagnosticsService.pollWaitingValidationDiagnostics = function () {
            return Poller.poll([pathPrefix, "diagnostic/getWaitingValidationDiagnostics"].join("/"), pollingApiOptions, {
                namespace: "tools_validation_diagnostics",
                method: "get",
                interval: 30000
            });
        };

        lineDiagnosticsService.killPollWaitingValidationDiagnostics = function () {
            Poller.kill({ namespace: "tools_validation_diagnostics" });
        };

        lineDiagnosticsService.validateDiagnostics = function (id, datas) {
            var $q = $injector.get("$q");
            return api.post([pathPrefix, "diagnostic", id, "validate"].join("/"), datas).then(function (result) {
                return result.data;
            }, function (err) {
                return $q.reject(err);
            });
        };

        lineDiagnosticsService.runPollGetDiagnostic = function (uriParams, datas) {
            var syncParam = { faultType: "noSync" };
            var postParams = datas && datas.faultType ? datas : angular.extend(syncParam, datas || {});
            return Poller.poll(URI.expand([pathPrefix, "lines", "{number}", "diagnostic/run"].join("/"), uriParams).toString(), pollingApiOptions, {
                namespace: "tools_line_diagnostics",
                method: "post",
                postData: postParams,
                interval: 5000,
                successRule: function successRule(data) {
                    return data.status !== "waitingRobot";
                } // ,
                // errorRule : function (data) {
                //     console.log(data.status !== 'waitingHuman' && !!data.data.error);
                //     return data.status !== 'waitingHuman' && !!data.data.error; //TODO review that
                // }

            });
        };

        return lineDiagnosticsService;
    }];
});

angular.module('ovh-angular-line-diagnostics').run(['$templateCache', function ($templateCache) {
    'use strict';

    $templateCache.put('/ovh-angular-line-diagnostics/src/ovh-angular-line-diagnostics/ovh-angular-line-diagnostics.html', "<div class=row><div class=col-md-6><div class=oui-progress-tracker><ol class=oui-progress-tracker__steps><li class=oui-progress-tracker__step data-ng-class=\"{\n" + "                        'oui-progress-tracker__step_active': $ctrl.currentStep === 'incidentDetectionStep',\n" + "                        'oui-progress-tracker__step_complete': $ctrl.currentStep !== 'incidentDetectionStep'\n" + "                    }\"><span class=oui-progress-tracker__status><span class=oui-progress-tracker__label data-translate=tools_lineDiagnostics_step_incident_detection></span></span></li><li class=oui-progress-tracker__step data-ng-class=\"{\n" + "                        'oui-progress-tracker__step_active': $ctrl.currentStep === 'investigationStep',\n" + "                        'oui-progress-tracker__step_complete': $ctrl.currentStep === 'solutionProposalStep',\n" + "                        'oui-progress-tracker__step_disabled': $ctrl.currentStep === 'incidentDetectionStep'\n" + "                    }\"><span class=oui-progress-tracker__status><span class=oui-progress-tracker__label data-translate=tools_lineDiagnostics_step_line_diagnostic></span></span></li><li class=oui-progress-tracker__step data-ng-class=\"{\n" + "                        'oui-progress-tracker__step_active': $ctrl.currentStep === 'solutionProposalStep',\n" + "                        'oui-progress-tracker__step_disabled': $ctrl.currentStep !== 'solutionProposalStep'\n" + "                    }\"><span class=oui-progress-tracker__status><span class=oui-progress-tracker__label data-translate=tools_lineDiagnostics_step_solution_proposal></span></span></li></ol></div></div></div><div class=row><toast-message></toast-message></div><div class=row data-ng-if=\"$ctrl.currentLineDiagnostic.status !== 'problem'\"><div data-ng-if=\"$ctrl.currentStep === 'incidentDetectionStep'\" data-ng-include=\"'/ovh-angular-line-diagnostics/src/ovh-angular-line-diagnostics/steps/ovh-angular-line-diagnostics-incident-step.html'\"></div><div data-ng-if=\"$ctrl.currentStep === 'investigationStep'\"></div></div><div class=form-group data-ng-if=\"$ctrl.currentLineDiagnostic.status === 'problem'\"><oui-message data-type=warning><span data-translate=tools_lineDiagnostics_diagnostic_critical_problem></span></oui-message></div>");

    $templateCache.put('/ovh-angular-line-diagnostics/src/ovh-angular-line-diagnostics/steps/ovh-angular-line-diagnostics-incident-step.html', "<div class=col-md-8 data-ng-if=\"$ctrl.incidentTestProgression < 100\"><span data-translate=tools_lineDiagnostics_incident_detection_test></span><oui-progress><oui-progress-bar data-type=info data-value=$ctrl.incidentTestProgression></oui-progress-bar></oui-progress></div><div class=\"col-md-4 row\" data-ng-if=\"$ctrl.currentLineDiagnostic.status === 'waitingRobot'\"><div class=\"d-inline-block col-xs-1\"><oui-spinner size=s></oui-spinner></div><p class=d-inline-block data-translate=tools_lineDiagnostics_waitingRobot></p></div><div class=col-md-8 data-ng-if=\"$ctrl.incidentTestProgression === 100 &&\n" + "                 $ctrl.currentLineDiagnostic\"><div data-ng-if=\"$ctrl.currentLineDiagnostic.hasQuestionToAnswer('modemIsSynchronized')\"><oui-field data-label=\"{{:: 'tools_lineDiagnostics_incident_detection_modem_question' | translate }}\" data-label-popover=\"{{:: 'tools_lineDiagnostics_incident_detection_modem_question_help' | translate }}\"><div class=oui-button-group><oui-button data-text=\"{{:: 'tools_lineDiagnostics_detail_yes' | translate }}\" data-variant=secondary data-ng-click=$ctrl.setModemStatus(true)></oui-button><oui-button data-text=\"{{:: 'tools_lineDiagnostics_detail_no' | translate }}\" data-variant=secondary data-ng-click=$ctrl.setModemStatus(false)></oui-button></div><span data-ng-if=$ctrl.loadingAction><oui-spinner size=s></oui-spinner></span></oui-field></div><div data-ng-if=\"$ctrl.currentLineDiagnostic.hasActionToDo('unplugModem')\"><oui-message data-type=warning><span data-translate=tools_lineDiagnostics_incident_detection_warning></span></oui-message><oui-field data-ng-if=\"$ctrl.currentLineDiagnostic.faultType === 'noSync'\" data-label=\"{{:: 'tools_lineDiagnostics_incident_detection_modem_unplug_request' | translate }}\"><oui-button data-text=\"{{:: 'tools_lineDiagnostics_incident_detection_modem_unplug_confirm' | translate }}\" data-variant=secondary data-variant-nav=next data-ng-click=\"$ctrl.setModemUnplug('unplugModem')\"></oui-button><span data-ng-if=$ctrl.loadingAction><oui-spinner size=s></oui-spinner></span></oui-field><oui-field data-ng-if=\"$ctrl.currentLineDiagnostic.faultType === 'alignment' ||\n" + "                               $ctrl.currentLineDiagnostic.faultType === 'syncLossOrLowBandwidth'\"><oui-button data-text=\"{{:: 'tools_lineDiagnostics_incident_detection_continue' | translate }}\" data-variant=secondary data-variant-nav=next data-ng-click=$ctrl.goOnInvestigationStep()></oui-button></oui-field></div></div>");
}]);
//# sourceMappingURL=ovh-angular-line-diagnostics.js.map
