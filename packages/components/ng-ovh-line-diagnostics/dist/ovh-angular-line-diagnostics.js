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
    controller: "LineDiagnosticsCtrl"
});

angular.module("ovh-angular-line-diagnostics").constant("DIAGNOSTICS_CONSTANTS", {
    PROGRESS_BAR: {
        INTERVAL: 1000,
        STEP: 20,
        LIMIT: 90
    },
    STEPS: {
        DETECTION: {
            LABEL: "detectionStep",
            ACTIONS: ["unplugModem"],
            QUESTIONS: ["modemIsSynchronized"]
        },
        INVESTIGATION: {
            LABEL: "investigationStep",
            ACTIONS: ["modemIsSynchronized", "modemStillSynchronized"],
            ACTIONS_AS_QUESTIONS: ["checkFilter", "checkConnectionCable"],
            QUESTIONS: ["modemIsSynchronized", "modemStillSynchronized", "severalInternetConnections", "hasModemKeptSynchronization"],
            SPECIFIC_QUESTIONS: ["problemType", "downloadBandwidthTest", "uploadBandwidthTest", "bandwidthTestUnit"]
        },
        SOLUTION_PROPOSAL: {
            LABEL: "solutionProposalStep",
            APPOINTMENT_QUESTIONS_FORM: ["idAppointment", "individualSite", "secureSite", "siteClosedDays", "siteOpening"],
            TIME_PERIOD_QUESTIONS: ["startMorningHours", "endMorningHours", "startAfternoonHours", "endAfternoonHours"]
        }
    },
    ROBOT_ACTION: {
        LONG_TIME_ACTIONS: ["seltTest", "installationCheck"],
        REQUEST_MONITORING: "requestMonitoring"
    },
    FAULT_TYPES: {
        UNKNOWN: "unknown",
        NO_SYNCHRONIZATION: "noSync",
        ALIGNMENT: "alignment",
        SYNC_LOSS_OR_LOW_BANDWIDTH: "syncLossOrLowBandwidth"
    },
    ERRORS: {
        MONITORING_EXISTS: "monitoringTodoAlreadyExists"
    },
    STATUS: {
        END: ["cancelled", "connectionProblem", "haveToConnectModemOnTheRightPlug", "interventionRequested", "resolvedAfterTests", "validationRefused", "waitingValidation", "noBandwidthFault"],
        PAUSE: ["init", "sleeping", "waitingHuman"],
        PROBLEM: "problem",
        SPECIAL: [],
        WAITING_ROBOT: "waitingRobot"
    },
    BANDWIDTH_TEST_SITE: "http://proof.ovh.net",
    QUESTIONS_ENUM: {
        BANDWIDTH_TEST_UNIT: ["Kbps", "Mbps"],
        PROBLEM_TYPE: {
            LOW_BANDWIDTH: "lowBandwidth",
            SYNC_LOSS: "syncLoss"
        }
    }
});

angular.module("ovh-angular-line-diagnostics").controller("LineDiagnosticsCtrl", function () {
    LineDiagnosticsCtrl.$inject = ["$interval", "$state", "$timeout", "$translate", "$uibModal", "atInternet", "LineDiagnostics", "LineDiagnosticFactory", "Toast", "DIAGNOSTICS_CONSTANTS"];
    function LineDiagnosticsCtrl($interval, $state, $timeout, $translate, $uibModal, atInternet, LineDiagnostics, LineDiagnosticFactory, Toast, DIAGNOSTICS_CONSTANTS) {
        _classCallCheck(this, LineDiagnosticsCtrl);

        this.$interval = $interval;
        this.$state = $state; // used in HTML
        this.$timeout = $timeout;
        this.$translate = $translate;
        this.$uibModal = $uibModal;
        this.atInternet = atInternet;
        this.LineDiagnosticsService = LineDiagnostics;
        this.LineDiagnosticFactory = LineDiagnosticFactory;
        this.Toast = Toast;

        this.DIAGNOSTICS_CONSTANTS = DIAGNOSTICS_CONSTANTS;
        this.bandwidthTestSite = this.DIAGNOSTICS_CONSTANTS.BANDWIDTH_TEST_SITE;
        this.enumQuestions = {
            bandwidthTestUnit: this.DIAGNOSTICS_CONSTANTS.QUESTIONS_ENUM.BANDWIDTH_TEST_UNIT,
            problemType: this.DIAGNOSTICS_CONSTANTS.QUESTIONS_ENUM.PROBLEM_TYPE
        };
    }

    _createClass(LineDiagnosticsCtrl, [{
        key: "$onInit",
        value: function $onInit() {
            var _this = this;

            var delayRequestStart = 3000;
            this.currentLineDiagnostic = null;
            this.currentStep = this.DIAGNOSTICS_CONSTANTS.STEPS.DETECTION.LABEL;
            this.currentAction = null;
            this.appointmentSlot = null;

            this.actionRequired = false;
            this.loading = false;
            this.progressBarCycle = null;

            this.trackPage(this.currentStep);

            this.LineDiagnosticsService.loadTranslations().then(function () {
                _this.animateProgressBar();
                _this.$timeout(function () {
                    _this.runLineDiagnostic();
                }, delayRequestStart);
            }).catch(function () {
                _this.Toast.error(_this.$translate.instant("tools_lineDiagnostics_error_loading_translations"));
            });
        }
    }, {
        key: "$onDestroy",
        value: function $onDestroy() {
            this.stopPoller();
        }
    }, {
        key: "animateProgressBar",
        value: function animateProgressBar() {
            var _this2 = this;

            this.detectionStepProgression = 0;
            this.progressBarCycle = this.$interval(function () {
                if (_this2.detectionStepProgression + _this2.DIAGNOSTICS_CONSTANTS.PROGRESS_BAR.STEP < _this2.DIAGNOSTICS_CONSTANTS.PROGRESS_BAR.LIMIT) {
                    _this2.detectionStepProgression = _.random(_this2.detectionStepProgression, _this2.detectionStepProgression + _this2.DIAGNOSTICS_CONSTANTS.PROGRESS_BAR.STEP);
                }
            }, this.DIAGNOSTICS_CONSTANTS.PROGRESS_BAR.INTERVAL);
        }
    }, {
        key: "runLineDiagnostic",
        value: function runLineDiagnostic(requestParam) {
            var _this3 = this;

            this.loading = true;

            return this.LineDiagnosticsService.getRunDiagnostic({
                number: this.lineNumber,
                serviceName: this.serviceName
            }, requestParam).then(function (lineDiagnostic) {
                _this3.buildLineDiagnostic(lineDiagnostic);
                _this3.checkDiagnosticStatus(lineDiagnostic);
                _this3.setCurrentStep();
                _this3.getNextAction();

                return lineDiagnostic;
            }).catch(function (error) {
                if (!_.isEmpty(error)) {
                    _this3.checkDiagnosticStatus(error);
                    _this3.Toast.error([_this3.$translate.instant("tools_lineDiagnostics_diagnostic_run_error"), error.message].join(" "));
                }
            }).finally(function () {
                _this3.loading = false;
                _this3.detectionStepProgression = 100;
                if (_this3.progressBarCycle) {
                    _this3.$interval.cancel(_this3.progressBarCycle);
                    _this3.progressBarCycle = null;
                }
            });
        }
    }, {
        key: "cancelLineDiagnostic",
        value: function cancelLineDiagnostic() {
            var _this4 = this;

            return this.LineDiagnosticsService.getCancelDiagnostic({ number: this.lineNumber, serviceName: this.serviceName }).$promise.catch(function (error) {
                _this4.Toast.error([_this4.$translate.instant("tools_lineDiagnostics_diagnostic_cancel_error"), _.get(error, "data.message", "")].join(" "));
            });
        }
    }, {
        key: "getNextAction",
        value: function getNextAction() {
            var _this5 = this;

            this.currentAction = _.chain(this.currentLineDiagnostic.getActionsToDo()).filter(function (action) {
                return !_.includes(_this5.currentLineDiagnostic.getActionsDone(), action);
            }).first().value();
        }
    }, {
        key: "goToInvestigationStep",
        value: function goToInvestigationStep() {
            this.diagnosticFromBeginning = false;
            this.setCurrentStep();
        }
    }, {
        key: "isActionAQuestion",
        value: function isActionAQuestion(actionName) {
            return this.DIAGNOSTICS_CONSTANTS.STEPS.INVESTIGATION.ACTIONS_AS_QUESTIONS.includes(actionName);
        }
    }, {
        key: "getInvestigationStepQuestions",
        value: function getInvestigationStepQuestions() {
            var _this6 = this;

            return this.currentLineDiagnostic.data.toAnswer.filter(function (question) {
                return _this6.DIAGNOSTICS_CONSTANTS.STEPS.INVESTIGATION.QUESTIONS.includes(question.name);
            });
        }
    }, {
        key: "getInvestigationStepSpecificQuestions",
        value: function getInvestigationStepSpecificQuestions() {
            var _this7 = this;

            return this.currentLineDiagnostic.data.toAnswer.filter(function (question) {
                return _this7.DIAGNOSTICS_CONSTANTS.STEPS.INVESTIGATION.SPECIFIC_QUESTIONS.includes(question.name);
            });
        }
    }, {
        key: "setCurrentStep",
        value: function setCurrentStep() {
            var previousStep = this.currentStep;
            var steps = this.DIAGNOSTICS_CONSTANTS.STEPS;

            switch (this.currentLineDiagnostic.faultType) {
                case this.DIAGNOSTICS_CONSTANTS.FAULT_TYPES.UNKNOWN:
                    this.diagnosticFromBeginning = true;
                    this.currentStep = steps.DETECTION.LABEL;
                    break;
                case this.DIAGNOSTICS_CONSTANTS.FAULT_TYPES.NO_SYNCHRONIZATION:
                case this.DIAGNOSTICS_CONSTANTS.FAULT_TYPES.ALIGNMENT:
                case this.DIAGNOSTICS_CONSTANTS.FAULT_TYPES.SYNC_LOSS_OR_LOW_BANDWIDTH:
                    if (this.diagnosticFromBeginning) {
                        this.currentStep = steps.DETECTION.LABEL;
                    } else if (this.isOnFinalStep()) {
                        this.currentStep = steps.SOLUTION_PROPOSAL.LABEL;
                        this.bandwidthDetails = this.currentLineDiagnostic.extractBandwidthDetails();
                    } else {
                        this.currentStep = steps.INVESTIGATION.LABEL;
                    }
                    break;
                default:
                    this.currentStep = steps.DETECTION.LABEL;
            }

            if (this.currentStep !== previousStep) {
                this.trackPage(this.currentStep);
            }
        }
    }, {
        key: "checkDiagnosticStatus",
        value: function checkDiagnosticStatus(diagnosticResult) {
            if (_.isEqual(diagnosticResult.status, this.DIAGNOSTICS_CONSTANTS.STATUS.WAITING_ROBOT)) {
                this.startPoller();
            } else {
                this.stopPoller();
                if (_.isEqual(diagnosticResult.status, this.DIAGNOSTICS_CONSTANTS.STATUS.PROBLEM) && !_.isEqual(_.get(diagnosticResult, "data.error", ""), this.DIAGNOSTICS_CONSTANTS.ERRORS.MONITORING_EXISTS)) {
                    this.cancelLineDiagnostic();
                }
            }
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
            this.diagnosticFromBeginning = false;
            this.addActionDone(unplugAction);
        }
    }, {
        key: "isOnFinalStep",
        value: function isOnFinalStep() {
            return this.isDiagnosticComplete() || this.hasFinalStepQuestions() || this.isMonitoringAlreadyExists() || _.isEqual(this.currentLineDiagnostic.data.robotAction, this.DIAGNOSTICS_CONSTANTS.ROBOT_ACTION.REQUEST_MONITORING);
        }
    }, {
        key: "isDiagnosticComplete",
        value: function isDiagnosticComplete() {
            var endStatus = this.DIAGNOSTICS_CONSTANTS.STATUS.END;
            return _.includes(endStatus, _.get(this.currentLineDiagnostic, "status")) || this.isMonitoringAlreadyExists();
        }
    }, {
        key: "hasFinalStepQuestions",
        value: function hasFinalStepQuestions() {
            return !_.isEmpty(this.currentLineDiagnostic.getQuestionsToAnswer()) && _.isEmpty(this.getInvestigationStepQuestions()) && _.isEmpty(this.getInvestigationStepSpecificQuestions()) && !this.currentLineDiagnostic.hasQuestionToAnswer("resolvedAfterTests");
        }
    }, {
        key: "isMonitoringAlreadyExists",
        value: function isMonitoringAlreadyExists() {
            return _.isEqual(_.get(this.currentLineDiagnostic, "data.error", ""), this.DIAGNOSTICS_CONSTANTS.ERRORS.MONITORING_EXISTS);
        }
    }, {
        key: "setDefaultValue",
        value: function setDefaultValue(answer) {
            this.currentLineDiagnostic.setDefaultValue(answer);
        }
    }, {
        key: "addActionDone",
        value: function addActionDone(action) {
            this.trackAction(action);
            this.actionRequired = false;
            this.currentLineDiagnostic.addActionDone(action);
            this.startPoller();
        }
    }, {
        key: "answerQuestion",
        value: function answerQuestion(question, answer) {
            this.trackAction(question + "-" + (answer ? "yes" : "no"));
            this.startPoller();
        }
    }, {
        key: "answerSpecificQuestion",
        value: function answerSpecificQuestion() {
            var action = this.currentLineDiagnostic.data.answers.problemType ? "sendProblemType" : "sendBandwidthTest";
            this.trackAction(action);
            this.startPoller();
        }
    }, {
        key: "goToRequestForm",
        value: function goToRequestForm() {
            this.trackAction("goToRequestForm");
            this.showRequestForm = true;
        }
    }, {
        key: "sendInterventionForm",
        value: function sendInterventionForm() {
            this.trackAction("sendInterventionForm");
            this.startPoller();
        }
    }, {
        key: "showWarning",
        value: function showWarning() {
            this.actionRequired = true;
        }
    }, {
        key: "trackAction",
        value: function trackAction(action) {
            this.atInternet.trackClick({
                name: "telecom::pack::xdsl::" + action,
                type: "action",
                chapter1: "telecom",
                level2: "Telecom"
            });
        }
    }, {
        key: "trackPage",
        value: function trackPage(page) {
            this.atInternet.trackPage({
                name: "telecom::pack::xdsl::" + page,
                type: "navigation",
                chapter1: "telecom",
                level2: "Telecom"
            });
        }
    }]);

    return LineDiagnosticsCtrl;
}());

/**
 *  @ngdoc object
 *  @name ovh-angular-line-diagnostics.LineDiagnostic
 *
 *  @description
 *  <p>Factory that describes a line diagnostic</p>
 *
 *  @constructor
 *  @param {Object} lineDiagnostic               Object taht represents data of current line diagnostic returned by API
 *                                               to create a new `LineDiagnostic` instance
 *  @param {Number} lineDiagnostic.id            Id of the line diagnostic
 *  @param {String} lineDiagnostic.faultType     Fault type of problem to diagnose (can be : 'noSync', 'alignment' or 'syncLossOrLowBandwidth')
 *  @param {String} lineDiagnostic.status        Current status of the line diagnostic
 */
angular.module("ovh-angular-line-diagnostics").factory("LineDiagnosticFactory", ["DIAGNOSTICS_CONSTANTS", function (DIAGNOSTICS_CONSTANTS) {
    var mandatoryParameters = ["data", "faultType", "id", "status"];

    var LineDiagnostic = function () {
        function LineDiagnostic(lineDiagnostic) {
            _classCallCheck(this, LineDiagnostic);

            _.forEach(mandatoryParameters, function (parameter) {
                if (!_.has(lineDiagnostic, parameter)) {
                    throw new Error(parameter + " parameter must be specified when creating a new LineDiagnostic");
                }
            });

            this.id = lineDiagnostic.id;
            this.faultType = lineDiagnostic.faultType;
            this.status = lineDiagnostic.status;
            this.data = lineDiagnostic.data;
        }

        _createClass(LineDiagnostic, [{
            key: "isLongActionInProgress",
            value: function isLongActionInProgress() {
                return _.includes(DIAGNOSTICS_CONSTANTS.ROBOT_ACTION.LONG_TIME_ACTIONS, _.get(this, "data.robotAction", ""));
            }
        }, {
            key: "extractBandwidthDetails",
            value: function extractBandwidthDetails() {
                return {
                    theoricalBandwidth: {
                        up: _.get(this.data, "lineDetails.lineCapabilities.up", "-"),
                        down: _.get(this.data, "lineDetails.lineCapabilities.down", "-")
                    },
                    currentBandwidth: {
                        up: _.get(this.data, "lineDetails.connectionInfo.upstreamSync", "-"),
                        down: _.get(this.data, "lineDetails.connectionInfo.downstreamSync", "-")
                    }
                };
            }
        }, {
            key: "getActionsToDo",
            value: function getActionsToDo() {
                var actionsToDo = _.get(this, "data.actionsToDo", []);
                return _.chain(actionsToDo).map("name").flatten().value();
            }
        }, {
            key: "getActionsDone",
            value: function getActionsDone() {
                return _.get(this, "data.actionsDone", []);
            }
        }, {
            key: "addActionDone",
            value: function addActionDone(actionToAdd) {
                this.data.actionsDone.push(actionToAdd);
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
            key: "getQuestionOptions",
            value: function getQuestionOptions(questionName) {
                var question = _.find(this.data.toAnswer, "name", questionName);
                return question.possibleValues;
            }
        }, {
            key: "needAppointmentDetails",
            value: function needAppointmentDetails() {
                var appointmentQuestions = DIAGNOSTICS_CONSTANTS.STEPS.SOLUTION_PROPOSAL.APPOINTMENT_QUESTIONS_FORM;
                return _.some(_.filter(this.getQuestionsToAnswer(), function (toAnswer) {
                    return _.includes(appointmentQuestions, toAnswer);
                }));
            }
        }, {
            key: "hasTimePeriodQuestions",
            value: function hasTimePeriodQuestions() {
                var timePeriodQuestions = DIAGNOSTICS_CONSTANTS.STEPS.SOLUTION_PROPOSAL.TIME_PERIOD_QUESTIONS;
                return !_.difference(timePeriodQuestions, this.getQuestionsToAnswer()).length;
            }
        }, {
            key: "getQuestionDefaultValue",
            value: function getQuestionDefaultValue(questionName) {
                var question = _.find(this.data.toAnswer, "name", questionName);
                return !_.isUndefined(question) ? question.defaultValue : null;
            }
        }, {
            key: "setDefaultValue",
            value: function setDefaultValue(answer) {
                this.data.answers[answer] = this.data.answers[answer] || this.getQuestionDefaultValue(answer);
            }
        }, {
            key: "convertToRequestParams",
            value: function convertToRequestParams() {
                var defaultFaultType = DIAGNOSTICS_CONSTANTS.FAULT_TYPES.UNKNOWN;
                return {
                    actionsDone: _.get(this.data, "actionsDone"),
                    answers: _.get(this.data, "answers"),
                    faultType: this.faultType || defaultFaultType
                };
            }
        }]);

        return LineDiagnostic;
    }();

    return LineDiagnostic;
}]);

angular.module("ovh-angular-line-diagnostics").provider("LineDiagnostics", function () {
    "use strict";

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

    this.$get = ["$translatePartialLoader", "$translate", "OvhApiXdslDiagnosticLines", function ($translatePartialLoader, $translate, OvhApiXdslDiagnosticLines) {
        var lineDiagnosticsService = {};

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
            return OvhApiXdslDiagnosticLines.v6().cancelDiagnostic(uriParams, {});
        };

        lineDiagnosticsService.deletePollDiagnostic = function () {
            return OvhApiXdslDiagnosticLines.v6().killPollerDiagnostic();
        };

        return lineDiagnosticsService;
    }];
});

angular.module('ovh-angular-line-diagnostics').run(['$templateCache', function ($templateCache) {
    'use strict';

    $templateCache.put('/ovh-angular-line-diagnostics/src/ovh-angular-line-diagnostics/ovh-angular-line-diagnostics.html', "<div class=row><div class=col-md-6><div class=oui-progress-tracker><ol class=oui-progress-tracker__steps><li class=oui-progress-tracker__step data-ng-class=\"{\n" + "                        'oui-progress-tracker__step_active': $ctrl.currentStep === 'detectionStep',\n" + "                        'oui-progress-tracker__step_complete': $ctrl.currentStep !== 'detectionStep'\n" + "                    }\"><span class=oui-progress-tracker__status><span class=oui-progress-tracker__label data-translate=tools_lineDiagnostics_detection_step></span></span></li><li class=oui-progress-tracker__step data-ng-class=\"{\n" + "                        'oui-progress-tracker__step_active': $ctrl.currentStep === 'investigationStep',\n" + "                        'oui-progress-tracker__step_complete': $ctrl.currentStep === 'solutionProposalStep',\n" + "                        'oui-progress-tracker__step_disabled': $ctrl.currentStep === 'detectionStep'\n" + "                    }\"><span class=oui-progress-tracker__status><span class=oui-progress-tracker__label data-translate=tools_lineDiagnostics_investigation_step></span></span></li><li class=oui-progress-tracker__step data-ng-class=\"{\n" + "                        'oui-progress-tracker__step_active': $ctrl.currentStep === 'solutionProposalStep' && !$ctrl.isDiagnosticComplete(),\n" + "                        'oui-progress-tracker__step_complete': $ctrl.isDiagnosticComplete(),\n" + "                        'oui-progress-tracker__step_disabled': $ctrl.currentStep !== 'solutionProposalStep'\n" + "                    }\"><span class=oui-progress-tracker__status><span class=oui-progress-tracker__label data-translate=tools_lineDiagnostics_solution_proposal_step></span></span></li></ol></div></div></div><div class=row><toast-message></toast-message></div><div class=row data-ng-if=\"$ctrl.currentLineDiagnostic.status !== 'problem' || $ctrl.isMonitoringAlreadyExists()\"><div data-ng-if=\"$ctrl.currentStep === 'detectionStep'\" data-ng-include=\"'/ovh-angular-line-diagnostics/src/ovh-angular-line-diagnostics/steps/ovh-angular-line-diagnostics-detection-step.html'\"></div><div data-ng-if=\"$ctrl.currentStep === 'investigationStep'\" data-ng-include=\"'/ovh-angular-line-diagnostics/src/ovh-angular-line-diagnostics/steps/ovh-angular-line-diagnostics-investigation-step.html'\"></div><div data-ng-if=\"$ctrl.currentStep === 'solutionProposalStep'\" data-ng-include=\"'/ovh-angular-line-diagnostics/src/ovh-angular-line-diagnostics/steps/ovh-angular-line-diagnostics-solution-proposal-step.html'\"></div></div><div data-ng-if=\"$ctrl.currentLineDiagnostic.status === 'problem' && !$ctrl.isMonitoringAlreadyExists()\"><oui-message data-type=error><p data-translate=tools_lineDiagnostics_diagnostic_critical_problem_title></p><p data-translate=tools_lineDiagnostics_diagnostic_critical_problem></p></oui-message></div>");

    $templateCache.put('/ovh-angular-line-diagnostics/src/ovh-angular-line-diagnostics/steps/ovh-angular-line-diagnostics-detection-step.html', "<div class=col-md-8 data-ng-if=\"$ctrl.detectionStepProgression < 100\"><span data-translate=tools_lineDiagnostics_detection_step_test></span><oui-progress><oui-progress-bar data-type=info data-value=$ctrl.detectionStepProgression></oui-progress-bar></oui-progress></div><div class=col-md-4 data-ng-if=\"$ctrl.currentLineDiagnostic.status === 'waitingRobot'\"><oui-spinner data-size=s></oui-spinner><span data-translate=tools_lineDiagnostics_waitingRobot></span> <span data-translate=tools_lineDiagnostics_please_wait></span></div><div class=col-md-8 data-ng-if=\"$ctrl.detectionStepProgression === 100 &&\n" + "                 $ctrl.currentLineDiagnostic\"><div data-ng-if=\"$ctrl.currentLineDiagnostic.hasQuestionToAnswer('modemIsSynchronized')\"><form class=form-group novalidate><label class=oui-label id=modemIsSynchronizedLabel><span data-translate=tools_lineDiagnostics_detection_step_modem_question></span><oui-popover><button type=button class=oui-popover-button oui-popover-trigger></button><oui-popover-content><p class=text-center data-translate=tools_lineDiagnostics_detection_step_modem_question_help></p><img src=assets/images/diagnostic/broadband-light.png data-ng-attr-alt=\"{{:: $ctrl.currentAction }}\" aria-hidden=\"true\"></oui-popover-content></oui-popover></label><oui-radio-toggle-group class=d-inline-block aria-labelledby=modemIsSynchronizedLabel data-model=$ctrl.currentLineDiagnostic.data.answers.modemIsSynchronized data-on-change=\"$ctrl.answerQuestion('modemIsSynchronized', modelValue)\" data-ng-if=!$ctrl.loading><oui-radio data-value=true><span data-translate=tools_lineDiagnostics_detection_step_modem_light_on></span></oui-radio><oui-radio data-value=false><span data-translate=tools_lineDiagnostics_detection_step_modem_light_blink></span></oui-radio><oui-radio data-value=false><span data-translate=tools_lineDiagnostics_detection_step_modem_light_off></span></oui-radio></oui-radio-toggle-group><div data-ng-if=$ctrl.loading><oui-spinner data-size=s></oui-spinner><span class=ml-2 data-translate=tools_lineDiagnostics_please_wait></span></div></form></div><div data-ng-if=\"$ctrl.currentLineDiagnostic.faultType !== 'unknown' &&\n" + "                     $ctrl.currentLineDiagnostic.status !== 'waitingRobot'\"><oui-message data-ng-if=\"$ctrl.currentLineDiagnostic.faultType !== 'syncLossOrLowBandwidth'\" data-type=warning><p class=oui-header_5 data-translate=tools_lineDiagnostics_detection_step_warning_title></p><p data-translate=tools_lineDiagnostics_detection_step_warning></p></oui-message><oui-message data-ng-if=\"$ctrl.currentLineDiagnostic.faultType === 'syncLossOrLowBandwidth'\" data-dismissable=false data-type=info><p class=oui-header_5 data-translate=tools_lineDiagnostics_detection_step_info_title></p><p data-translate=tools_lineDiagnostics_detection_step_info data-translate-values=\"{ 'continueButtonLabel': $ctrl.$translate.instant('tools_lineDiagnostics_detection_step_continue') }\"></p></oui-message><div data-ng-if=\"$ctrl.currentLineDiagnostic.faultType === 'noSync'\"><label for=unplugModem class=oui-label><span data-translate=tools_lineDiagnostics_detection_step_modem_unplug_request></span></label><oui-button id=unplugModem data-variant=secondary data-variant-nav=next data-on-click=\"$ctrl.setModemUnplug('unplugModem')\" data-ng-if=!$ctrl.loading><span data-translate=tools_lineDiagnostics_detection_step_modem_unplug_confirm></span></oui-button><div data-ng-if=$ctrl.loading><oui-spinner data-size=s></oui-spinner><span class=ml-2 data-translate=tools_lineDiagnostics_please_wait></span></div></div><div data-ng-if=\"$ctrl.currentLineDiagnostic.faultType === 'alignment' ||\n" + "                         $ctrl.currentLineDiagnostic.faultType === 'syncLossOrLowBandwidth'\"><oui-button data-variant=secondary data-variant-nav=next data-on-click=$ctrl.goToInvestigationStep() data-ng-if=!$ctrl.loading><span data-translate=tools_lineDiagnostics_detection_step_continue></span></oui-button><div data-ng-if=$ctrl.loading><oui-spinner data-ng-if=$ctrl.loading data-size=s></oui-spinner><span class=ml-2 data-translate=tools_lineDiagnostics_please_wait></span></div></div></div></div>");

    $templateCache.put('/ovh-angular-line-diagnostics/src/ovh-angular-line-diagnostics/steps/ovh-angular-line-diagnostics-investigation-step.html', "<div class=col-md-6 data-ng-if=\"!$ctrl.currentLineDiagnostic.isLongActionInProgress() && $ctrl.currentLineDiagnostic.status !== 'waitingRobot'\"><div class=form-group><p class=oui-header_5 data-translate=tools_lineDiagnostics_header_investigation_step_title></p><p data-translate=tools_lineDiagnostics_header_investigation_step_subtitle></p><div class=mb-5 data-ng-if=\"$ctrl.currentLineDiagnostic.data.actionsDone && $ctrl.currentLineDiagnostic.data.actionsDone.length > 0\"><p data-ng-repeat=\"actionDone in $ctrl.currentLineDiagnostic.getActionsDone() track by actionDone\"><span class=\"oui-icon oui-icon-success\" aria-hidden=true></span> <span data-translate=\"{{:: 'tools_lineDiagnostics_investigation_step_action_' + actionDone + '_done_text' }}\"></span></p><p data-ng-if=\"$ctrl.loading &&\n" + "                           $ctrl.getInvestigationStepQuestions().length === 0 &&\n" + "                           $ctrl.getInvestigationStepSpecificQuestions().length === 0\"><oui-spinner data-size=s></oui-spinner><span class=ml-2 data-translate=tools_lineDiagnostics_please_wait></span></p></div><div data-ng-if=\"$ctrl.currentLineDiagnostic.data.actionsToDo &&\n" + "                         $ctrl.currentLineDiagnostic.data.actionsToDo.length > 0 &&\n" + "                         $ctrl.currentAction && !$ctrl.loading\"><label for=\"{{:: $ctrl.currentAction }}\" class=oui-label><span data-translate=\"{{:: 'tools_lineDiagnostics_investigation_step_action_' + $ctrl.currentAction + '_title' }}\"></span><oui-popover data-ng-if=\"$ctrl.currentAction === 'bePreparedToCheckModemSynchronization'\"><button type=button class=oui-popover-button oui-popover-trigger></button><oui-popover-content data-translate=tools_lineDiagnostics_detection_step_modem_question_help></oui-popover-content></oui-popover><a class=\"oui-link oui-link_icon\" data-ng-if=\"$ctrl.currentAction === 'changeProfile'\" data-ui-sref=telecom.pack.xdsl><span data-translate=tools_lineDiagnostics_investigation_step_action_changeProfile_link></span></a><oui-popover data-ng-if=\"$ctrl.currentAction === 'checkFilter'\"><button type=button class=oui-popover-button oui-popover-trigger></button><oui-popover-content><p class=text-center data-translate=tools_lineDiagnostics_investigation_step_action_checkFilter_example></p><img src=assets/images/diagnostic/filtre-adsl.png data-ng-attr-alt=\"{{:: $ctrl.currentAction }}\"></oui-popover-content></oui-popover></label><oui-button data-variant=secondary data-on-click=$ctrl.addActionDone($ctrl.currentAction) data-disabled=$ctrl.loading><span data-translate=\"{{:: 'tools_lineDiagnostics_investigation_step_action_' + $ctrl.currentAction + '_text' }}\"></span></oui-button><oui-button data-variant=secondary data-on-click=$ctrl.showWarning() data-ng-if=$ctrl.isActionAQuestion($ctrl.currentAction) data-disabled=$ctrl.loading><span data-translate=tools_lineDiagnostics_detail_no></span></oui-button></div><div data-ng-if=\"$ctrl.getInvestigationStepQuestions().length > 0\" data-ng-repeat=\"question in $ctrl.getInvestigationStepQuestions() track by question\"><oui-field data-label=\"{{:: 'tools_lineDiagnostics_investigation_step_question_' + question.name + '_title' | translate }}\"><oui-radio-toggle-group class=d-inline-block data-model=$ctrl.currentLineDiagnostic.data.answers[question.name] data-ng-if=\"question.type === 'boolean' && !$ctrl.loading\" data-on-change=\"$ctrl.answerQuestion(question.name, modelValue)\"><oui-radio data-value=true><span data-translate=tools_lineDiagnostics_detail_yes></span></oui-radio><oui-radio data-value=false><span data-translate=tools_lineDiagnostics_detail_no></span></oui-radio></oui-radio-toggle-group><p data-ng-if=$ctrl.loading><oui-spinner data-size=s></oui-spinner><span class=ml-2 data-translate=tools_lineDiagnostics_please_wait></span></p></oui-field></div><div data-ng-if=\"$ctrl.getInvestigationStepSpecificQuestions().length > 0\"><form name=syncLossOrLowBandwidth novalidate data-ng-if=!$ctrl.loading><div data-ng-if=\"$ctrl.currentLineDiagnostic.hasQuestionToAnswer('problemType')\"><oui-field data-label=\"{{:: 'tools_lineDiagnostics_investigation_step_question_problemType_title' | translate }}\"><oui-radio-group data-model=$ctrl.currentLineDiagnostic.data.answers.problemType><oui-radio data-value=$ctrl.enumQuestions.problemType.SYNC_LOSS data-required><span data-translate=tools_lineDiagnostics_investigation_step_question_problemType_enum_syncLoss></span></oui-radio><oui-radio data-value=$ctrl.enumQuestions.problemType.LOW_BANDWIDTH data-required><span data-translate=tools_lineDiagnostics_investigation_step_question_problemType_enum_lowBandwidth></span></oui-radio></oui-radio-group></oui-field></div><div data-ng-if=\"($ctrl.currentLineDiagnostic.hasQuestionToAnswer('downloadBandwidthTest') &&\n" + "                                 $ctrl.currentLineDiagnostic.hasQuestionToAnswer('uploadBandwidthTest'))\"><label class=oui-label><span data-translate=tools_lineDiagnostics_investigation_step_question_bandwidthTest_title></span> <a data-ng-href=\"{{:: $ctrl.bandwidthTestSite }}\" target=_blank rel=noopener><span data-ng-bind=$ctrl.bandwidthTestSite></span></a></label><div class=row><oui-field class=\"col-md-4 col-xs-8\" data-label=\"{{:: 'tools_lineDiagnostics_investigation_step_question_downloadBandwidthTest_title' | translate }}\" data-ng-if=\"$ctrl.currentLineDiagnostic.hasQuestionToAnswer('downloadBandwidthTest')\" data-ng-init=\"$ctrl.setDefaultValue('downloadBandwidthTest')\"><input class=oui-input name=downloadBandwidthTest data-ng-model=$ctrl.currentLineDiagnostic.data.answers.downloadBandwidthTest data-required></oui-field><oui-field class=\"col-md-4 col-xs-8\" data-label=\"{{:: 'tools_lineDiagnostics_investigation_step_question_uploadBandwidthTest_title' | translate }}\" data-ng-if=\"$ctrl.currentLineDiagnostic.hasQuestionToAnswer('uploadBandwidthTest')\" data-ng-init=\"$ctrl.setDefaultValue('uploadBandwidthTest')\"><input class=oui-input name=uploadBandwidthTest data-ng-model=$ctrl.currentLineDiagnostic.data.answers.uploadBandwidthTest data-required></oui-field><oui-field class=\"col-md-3 col-xs-8\" data-label=\"{{:: 'tools_lineDiagnostics_investigation_step_question_bandwidthTestUnit_title' | translate }}\" data-ng-if=\"$ctrl.currentLineDiagnostic.hasQuestionToAnswer('bandwidthTestUnit')\"><oui-select name=bandwidthTestUnit placeholder=\"{{:: 'tools_lineDiagnostics_investigation_step_question_bandwidthTestUnit_placeholder' | translate }}\" data-model=$ctrl.currentLineDiagnostic.data.answers.bandwidthTestUnit data-items=$ctrl.enumQuestions.bandwidthTestUnit data-align=start data-required><span data-ng-bind=$item></span></oui-select></oui-field></div></div><oui-button data-variant=primary data-disabled=!syncLossOrLowBandwidth.$valid data-on-click=$ctrl.answerSpecificQuestion() data-ng-if=!$ctrl.loading><span data-translate=tools_lineDiagnostics_validate></span></oui-button></form><p data-ng-if=$ctrl.loading><oui-spinner data-size=s></oui-spinner><span class=ml-2 data-translate=tools_lineDiagnostics_please_wait></span></p></div></div></div><div class=col-md-4 data-ng-if=\"$ctrl.currentLineDiagnostic.status === 'waitingRobot' && !$ctrl.currentLineDiagnostic.isLongActionInProgress()\"><p><oui-spinner data-size=s></oui-spinner><span data-translate=tools_lineDiagnostics_waitingRobot></span> <span data-translate=tools_lineDiagnostics_please_wait></span></p></div><div class=col-md-8><oui-message data-type=warning data-ng-if=$ctrl.actionRequired><span data-translate=tools_lineDiagnostics_action_required_action></span></oui-message></div><div class=\"col-md-5 oui-message oui-message_info\" data-ng-if=\"$ctrl.currentLineDiagnostic.hasQuestionToAnswer('resolvedAfterTests') && !$ctrl.loading\"><p class=oui-header_6 data-translate=tools_lineDiagnostics_investigation_step_action_is_problem_solved></p><oui-radio-toggle-group class=d-inline-block data-model=$ctrl.currentLineDiagnostic.data.answers.resolvedAfterTests data-on-change=\"$ctrl.answerQuestion('resolvedAfterTests', modelValue)\"><oui-radio data-value=true><span data-translate=tools_lineDiagnostics_detail_yes></span></oui-radio><oui-radio data-value=false><span data-translate=tools_lineDiagnostics_detail_no></span></oui-radio></oui-radio-toggle-group></div><div class=col-md-6 data-ng-if=$ctrl.currentLineDiagnostic.isLongActionInProgress()><oui-spinner></oui-spinner><p class=oui-header_6 data-translate=tools_lineDiagnostics_header_investigation_step_selt_test_title></p><p data-translate=tools_lineDiagnostics_header_investigation_step_selt_test_subtitle></p></div>");

    $templateCache.put('/ovh-angular-line-diagnostics/src/ovh-angular-line-diagnostics/steps/ovh-angular-line-diagnostics-solution-proposal-step.html', "<div data-ng-if=$ctrl.currentLineDiagnostic.data.answers.resolvedAfterTests><img class=col-md-2 src=assets/images/diagnostic/human-good.svg width=180 height=180 data-ng-attr-alt=\"{{:: $ctrl.currentLineDiagnostic.status }}\"> <span class=col-md-8><p class=oui-header_4 data-translate=tools_lineDiagnostics_solution_proposal_step_problem_solved_title></p><p data-translate=tools_lineDiagnostics_solution_proposal_step_problem_solved_subtitle></p><oui-button data-variant=primary data-on-click=\"$ctrl.$state.go('^')\"><span data-translate=tools_lineDiagnostics_solution_proposal_step_exit_diagnostic></span></oui-button></span></div><div data-ng-if=!$ctrl.currentLineDiagnostic.data.answers.resolvedAfterTests><div class=col-md-4 data-ng-if=\"$ctrl.currentLineDiagnostic.status === 'waitingRobot'\"><oui-spinner data-size=s></oui-spinner><span data-translate=tools_lineDiagnostics_please_wait></span></div><div data-ng-if=\"$ctrl.currentLineDiagnostic.status === 'waitingValidation'\"><img class=col-md-2 src=assets/images/diagnostic/human-speedAndGraphic.svg width=180 height=180 data-ng-attr-alt=\"{{:: $ctrl.currentLineDiagnostic.status }}\"> <span class=col-md-8><p class=oui-header_4 data-translate=tools_lineDiagnostics_solution_proposal_step_waitingValidation_title></p><p data-translate=tools_lineDiagnostics_solution_proposal_step_waitingValidation_subtitle></p><oui-button data-variant=primary data-on-click=\"$ctrl.$state.go('^')\"><span data-translate=tools_lineDiagnostics_solution_proposal_step_exit_diagnostic></span></oui-button></span></div><div data-ng-if=$ctrl.isMonitoringAlreadyExists()><img class=col-md-2 src=assets/images/diagnostic/human-think.svg width=180 height=180 data-ng-attr-alt=\"{{:: $ctrl.currentLineDiagnostic.status }}\"> <span class=col-md-8><p class=oui-header_4 data-translate=\"{{:: 'tools_lineDiagnostics_error_context_monitoringTodoAlreadyExists_title' }}\"></p><p data-translate=\"{{:: 'tools_lineDiagnostics_error_context_monitoringTodoAlreadyExists_subtitle' }}\"></p><oui-button data-variant=primary data-on-click=\"$ctrl.$state.go('^')\"><span data-translate=tools_lineDiagnostics_solution_proposal_step_exit_diagnostic></span></oui-button></span></div><div data-ng-if=!$ctrl.showRequestForm><div data-ng-if=\"$ctrl.currentLineDiagnostic.status === 'waitingHuman'\"><div class=\"col-md-12 form-group\" data-ng-if=\"$ctrl.currentLineDiagnostic.data.answers.problemType === 'lowBandwidth'\"><p data-translate=tools_lineDiagnostics_solution_proposal_step_bandwidthCapabilities data-translate-values=\"{\n" + "                        'up': $ctrl.bandwidthDetails.theoricalBandwidth.up,\n" + "                        'down': $ctrl.bandwidthDetails.theoricalBandwidth.down\n" + "                   }\"></p><p data-translate=tools_lineDiagnostics_solution_proposal_step_bandwidthCurrent data-translate-values=\"{\n" + "                        'up': $ctrl.bandwidthDetails.currentBandwidth.up,\n" + "                        'down': $ctrl.bandwidthDetails.currentBandwidth.down\n" + "                   }\"></p></div><img class=col-md-2 src=assets/images/diagnostic/human-think.svg width=180 height=180 data-ng-attr-alt=\"{{:: $ctrl.currentLineDiagnostic.status }}\"> <span class=col-md-8><p class=oui-header_4 data-translate=tools_lineDiagnostics_solution_proposal_step_problem_to_resolve_title></p><p data-translate=tools_lineDiagnostics_solution_proposal_step_problem_to_resolve_subtitle></p><oui-button data-variant=primary data-on-click=$ctrl.goToRequestForm()><span data-translate=tools_lineDiagnostics_solution_proposal_step_fill_request_form></span></oui-button></span></div><div data-ng-if=\"$ctrl.currentLineDiagnostic.status === 'syncLossOrLowBandwidth'\"><img class=col-md-2 src=assets/images/diagnostic/human-think.svg width=180 height=180 data-ng-attr-alt=\"{{:: $ctrl.currentLineDiagnostic.status }}\"> <span class=col-md-8><p class=oui-header_4 data-translate=tools_lineDiagnostics_solution_proposal_step_problem_to_monitor_title_title></p><p data-translate=tools_lineDiagnostics_solution_proposal_step_problem_to_monitor_title_subtitle></p><oui-button data-variant=primary data-on-click=$ctrl.goToRequestForm()><span data-translate=tools_lineDiagnostics_solution_proposal_step_fill_request_form></span></oui-button></span></div><div data-ng-if=\"$ctrl.currentLineDiagnostic.status === 'haveToConnectModemOnTheRightPlug'\"><img class=col-md-2 src=assets/images/diagnostic/human-think.svg width=180 height=180 data-ng-attr-alt=\"{{:: $ctrl.currentLineDiagnostic.status }}\"> <span class=col-md-8><p class=oui-header_4 data-translate=tools_lineDiagnostics_solution_proposal_step_haveToConnectModemOnTheRightPlug_title></p><p data-translate=tools_lineDiagnostics_solution_proposal_step_haveToConnectModemOnTheRightPlug_subtitle></p><oui-button data-variant=primary data-on-click=\"$ctrl.$state.go('^')\"><span data-translate=tools_lineDiagnostics_solution_proposal_step_exit_diagnostic></span></oui-button></span></div><div data-ng-if=\"$ctrl.currentLineDiagnostic.status === 'connectionProblem'\"><img class=col-md-2 src=assets/images/diagnostic/human-think.svg width=180 height=180 data-ng-attr-alt=\"{{:: $ctrl.currentLineDiagnostic.status }}\"> <span class=col-md-8><p class=oui-header_4 data-translate=tools_lineDiagnostics_solution_proposal_step_connectionProblem_title></p><p data-translate=tools_lineDiagnostics_solution_proposal_step_connectionProblem_subtitle></p><oui-button data-variant=primary data-on-click=\"$ctrl.$state.go('^')\"><span data-translate=tools_lineDiagnostics_solution_proposal_step_exit_diagnostic></span></oui-button></span></div><div data-ng-if=\"$ctrl.currentLineDiagnostic.status === 'cancelled'\"><img class=col-md-2 src=assets/images/diagnostic/human-think.svg width=180 height=180 data-ng-attr-alt=\"{{:: $ctrl.currentLineDiagnostic.status }}\"> <span class=col-md-8><p class=oui-header_4 data-translate=tools_lineDiagnostics_solution_proposal_step_cancelled_title></p><p data-translate=tools_lineDiagnostics_solution_proposal_step_cancelled_subtitle></p><oui-button data-variant=primary data-on-click=\"$ctrl.$state.go('^')\"><span data-translate=tools_lineDiagnostics_solution_proposal_step_exit_diagnostic></span></oui-button></span></div><div data-ng-if=\"$ctrl.currentLineDiagnostic.status === 'validationRefused'\"><img class=col-md-2 src=assets/images/diagnostic/human-think.svg width=180 height=180 data-ng-attr-alt=\"{{:: $ctrl.currentLineDiagnostic.status }}\"> <span class=col-md-8><p class=oui-header_4 data-translate=tools_lineDiagnostics_solution_proposal_step_validationRefused_title></p><oui-button data-variant=primary data-on-click=\"$ctrl.$state.go('^')\"><span data-translate=tools_lineDiagnostics_solution_proposal_step_exit_diagnostic></span></oui-button></span></div><div data-ng-if=\"$ctrl.currentLineDiagnostic.status === 'interventionRequested'\"><img class=col-md-2 src=assets/images/diagnostic/human-think.svg width=180 height=180 data-ng-attr-alt=\"{{:: $ctrl.currentLineDiagnostic.status }}\"> <span class=col-md-8><p class=oui-header_4 data-translate=tools_lineDiagnostics_solution_proposal_step_interventionRequested_title></p><p data-translate=tools_lineDiagnostics_solution_proposal_step_interventionRequested_subtitle></p><oui-button data-variant=primary data-on-click=\"$ctrl.$state.go('^')\"><span data-translate=tools_lineDiagnostics_solution_proposal_step_exit_diagnostic></span></oui-button></span></div><div data-ng-if=\"$ctrl.currentLineDiagnostic.status === 'noBandwidthFault'\"><img class=col-md-2 src=assets/images/diagnostic/human-think.svg width=180 height=180 data-ng-attr-alt=\"{{:: $ctrl.currentLineDiagnostic.status }}\"> <span class=col-md-8><p class=oui-header_4 data-translate=tools_lineDiagnostics_solution_proposal_step_noBandwidthFault_title></p><p data-translate=tools_lineDiagnostics_solution_proposal_step_noDefaultAnymore_subtitle></p><oui-button data-variant=primary data-on-click=\"$ctrl.$state.go('^')\"><span data-translate=tools_lineDiagnostics_solution_proposal_step_exit_diagnostic></span></oui-button></span></div><div data-ng-if=\"$ctrl.currentLineDiagnostic.status === 'noProblemAnymore'\"><img class=col-md-2 src=assets/images/diagnostic/human-think.svg width=180 height=180 data-ng-attr-alt=\"{{:: $ctrl.currentLineDiagnostic.status }}\"> <span class=col-md-8><p class=oui-header_4 data-translate=tools_lineDiagnostics_solution_proposal_step_noProblemAnymore_title></p><p data-translate=tools_lineDiagnostics_solution_proposal_step_noDefaultAnymore_subtitle></p><oui-button data-variant=primary data-on-click=\"$ctrl.$state.go('^')\"><span data-translate=tools_lineDiagnostics_solution_proposal_step_exit_diagnostic></span></oui-button></span></div></div><div class=col-md-8 data-ng-if=$ctrl.showRequestForm><form class=form-group name=requestInterventionForm novalidate data-ng-if=\"$ctrl.currentLineDiagnostic.data.toAnswer && $ctrl.currentLineDiagnostic.data.toAnswer.length > 0 && !$ctrl.loading\"><div data-ng-if=$ctrl.currentLineDiagnostic.needAppointmentDetails()><oui-field data-label=\"{{:: 'tools_lineDiagnostics_solution_proposal_step_request_form_question_idAppointment_title' | translate }}\" data-ng-if=\"$ctrl.currentLineDiagnostic.hasQuestionToAnswer('idAppointment')\"><oui-select name=idAppointment placeholder=\"{{:: 'tools_lineDiagnostics_solution_proposal_step_request_form_question_idAppointment_text' | translate }}\" data-match=label data-model=$ctrl.appointmentSlot data-items=\"$ctrl.currentLineDiagnostic.getQuestionOptions('idAppointment')\" data-align=start data-on-change=\"$ctrl.currentLineDiagnostic.data.answers.idAppointment = $ctrl.appointmentSlot.id\" required><span ng-bind=$item.label></span></oui-select></oui-field><oui-field data-label=\"{{:: 'tools_lineDiagnostics_solution_proposal_step_request_form_question_individualSite_title' | translate }}\" data-ng-if=\"$ctrl.currentLineDiagnostic.hasQuestionToAnswer('individualSite')\"><oui-radio-toggle-group class=d-inline-block data-model=$ctrl.currentLineDiagnostic.data.answers.individualSite><oui-radio data-value=true required><span data-translate=tools_lineDiagnostics_detail_yes></span></oui-radio><oui-radio data-value=false required><span data-translate=tools_lineDiagnostics_detail_no></span></oui-radio></oui-radio-toggle-group></oui-field><oui-field data-label=\"{{:: 'tools_lineDiagnostics_solution_proposal_step_request_form_question_siteClosedDays_title' | translate }}\" data-ng-if=\"$ctrl.currentLineDiagnostic.hasQuestionToAnswer('siteClosedDays')\"><input class=oui-input name=siteClosedDays data-ng-model=$ctrl.currentLineDiagnostic.data.answers.siteClosedDays required></oui-field><oui-field data-label=\"{{:: 'tools_lineDiagnostics_solution_proposal_step_request_form_question_siteOpening_title' | translate }}\" data-ng-if=\"$ctrl.currentLineDiagnostic.hasQuestionToAnswer('siteOpening')\"><input class=oui-input name=siteOpening data-ng-model=$ctrl.currentLineDiagnostic.data.answers.siteOpening data-maxlength=20 required></oui-field><div data-ng-if=$ctrl.currentLineDiagnostic.hasTimePeriodQuestions()><label class=oui-label data-translate=tools_lineDiagnostics_solution_proposal_step_request_form_question_hours_title></label><div class=row><oui-field class=\"col-md-3 col-xs-8\" data-label=\"{{:: 'tools_lineDiagnostics_solution_proposal_step_request_form_question_startMorningHours_title' | translate }}\"><input class=oui-input name=startMorningHours data-ng-pattern=\"/^[0-9:hH]{0,5}$/\" data-ng-model=$ctrl.currentLineDiagnostic.data.answers.startMorningHours required></oui-field><oui-field class=\"col-md-3 col-xs-8\" data-label=\"{{:: 'tools_lineDiagnostics_solution_proposal_step_request_form_question_endMorningHours_title' | translate }}\"><input class=oui-input name=endMorningHours data-ng-pattern=\"/^[0-9:hH]{0,5}$/\" data-ng-model=$ctrl.currentLineDiagnostic.data.answers.endMorningHours required></oui-field></div><div class=row><oui-field class=\"col-md-3 col-xs-8\" data-label=\"{{:: 'tools_lineDiagnostics_solution_proposal_step_request_form_question_startAfternoonHours_title' | translate }}\"><input class=oui-input name=startAfternoonHours data-ng-pattern=\"/^[0-9:hH]{0,5}$/\" data-ng-model=$ctrl.currentLineDiagnostic.data.answers.startAfternoonHours required></oui-field><oui-field class=\"col-md-3 col-xs-8\" data-label=\"{{:: 'tools_lineDiagnostics_solution_proposal_step_request_form_question_endAfternoonHours_title' | translate }}\"><input class=oui-input name=endAfternoonHours data-ng-pattern=\"/^[0-9:hH]{0,5}$/\" data-ng-model=$ctrl.currentLineDiagnostic.data.answers.endAfternoonHours required></oui-field></div></div><oui-field data-label=\"{{:: 'tools_lineDiagnostics_solution_proposal_step_request_form_question_secureSite_title' | translate }}\" data-ng-if=\"$ctrl.currentLineDiagnostic.hasQuestionToAnswer('secureSite')\"><oui-radio-toggle-group class=d-inline-block data-model=$ctrl.currentLineDiagnostic.data.answers.secureSite><oui-radio data-value=true required><span data-translate=tools_lineDiagnostics_detail_yes></span></oui-radio><oui-radio data-value=false required><span data-translate=tools_lineDiagnostics_detail_no></span></oui-radio></oui-radio-toggle-group></oui-field><oui-field data-label=\"{{:: 'tools_lineDiagnostics_solution_proposal_step_request_form_question_siteDigicode_title' | translate }}\" data-ng-if=\"$ctrl.currentLineDiagnostic.hasQuestionToAnswer('siteDigicode')\"><input class=oui-input name=siteDigicode data-ng-model=$ctrl.currentLineDiagnostic.data.answers.siteDigicode></oui-field><oui-button data-disabled=!requestInterventionForm.$valid data-on-click=$ctrl.sendInterventionForm() data-variant=primary><span data-translate=tools_lineDiagnostics_continue></span></oui-button></div><div class=form-group data-ng-if=!$ctrl.currentLineDiagnostic.needAppointmentDetails()><oui-field data-label=\"{{:: 'tools_lineDiagnostics_solution_proposal_step_request_form_question_ovhTicket_title' | translate }}\" data-ng-if=\"$ctrl.currentLineDiagnostic.hasQuestionToAnswer('ovhTicket')\"><input class=oui-input name=ovhTicket data-ng-model=$ctrl.currentLineDiagnostic.data.answers.ovhTicket></oui-field><div class=row><oui-field class=\"col-md-6 col-xs-12\" data-label=\"{{:: 'tools_lineDiagnostics_solution_proposal_step_request_form_question_modemType_title' | translate }}\" data-ng-if=\"$ctrl.currentLineDiagnostic.hasQuestionToAnswer('modemType')\" data-ng-init=\"$ctrl.setDefaultValue('modemType')\"><input class=oui-input name=modemType data-ng-model=$ctrl.currentLineDiagnostic.data.answers.modemType required></oui-field><oui-field class=\"col-md-6 col-xs-12\" data-label=\"{{:: 'tools_lineDiagnostics_solution_proposal_step_request_form_question_contactPhone_title' | translate }}\" data-ng-init=\"$ctrl.setDefaultValue('contactPhone')\"><input class=oui-input name=contactPhone data-ng-model=$ctrl.currentLineDiagnostic.data.answers.contactPhone data-ng-pattern=\"/^(0033|0)\\d{9}$/\" required></oui-field></div><oui-field data-label=\"{{:: 'tools_lineDiagnostics_solution_proposal_step_request_form_question_comment_title' | translate }}\"><oui-textarea data-name=comment data-model=$ctrl.currentLineDiagnostic.data.answers.comment data-rows=7 data-minlength=5 data-maxlength=200 required></oui-textarea></oui-field><oui-field data-label=\"{{:: 'tools_lineDiagnostics_solution_proposal_step_request_form_question_followBySms_title' | translate }}\"><oui-radio-toggle-group class=d-inline-block data-name=followBySms data-model=$ctrl.currentLineDiagnostic.data.answers.followBySms><oui-radio data-value=true required><span data-translate=tools_lineDiagnostics_detail_yes></span></oui-radio><oui-radio data-value=false required><span data-translate=tools_lineDiagnostics_detail_no></span></oui-radio></oui-radio-toggle-group></oui-field><oui-checkbox data-ng-init=\"$ctrl.currentLineDiagnostic.data.answers.conditionsAccepted = false\" data-model=$ctrl.currentLineDiagnostic.data.answers.conditionsAccepted><span data-translate=tools_lineDiagnostics_solution_proposal_step_request_form_question_conditionsAccepted_title></span></oui-checkbox><oui-button data-disabled=\"!requestInterventionForm.$valid || !$ctrl.currentLineDiagnostic.data.answers.conditionsAccepted\" data-on-click=\"$ctrl.answerQuestion('conditionsAccepted', true)\" data-variant=primary><span data-translate=tools_lineDiagnostics_solution_proposal_step_intervention_request_validation></span></oui-button></div></form><p data-ng-if=$ctrl.loading><oui-spinner data-size=s></oui-spinner><span class=ml-2 data-translate=tools_lineDiagnostics_please_wait></span></p></div></div>");
}]);
//# sourceMappingURL=ovh-angular-line-diagnostics.js.map
