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
        function controller($interval, $q, $timeout, $translate, LineDiagnostics, LineDiagnosticFactory, Toast, DIAGNOSTICS_CONSTANTS) {
            _classCallCheck(this, controller);

            this.$q = $q;
            this.$interval = $interval;
            this.$timeout = $timeout;
            this.$translate = $translate;
            this.LineDiagnosticsService = LineDiagnostics;
            this.LineDiagnosticFactory = LineDiagnosticFactory;
            this.Toast = Toast;
            this.constants = DIAGNOSTICS_CONSTANTS;
            this.enumQuestions = {
                bandwidthTestUnit: this.constants.QUESTIONS_ENUM.BANDWIDTH_TEST_UNIT,
                problemType: this.constants.QUESTIONS_ENUM.PROBLEM_TYPE
            };
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
            key: "fakeSeltTest",
            value: function fakeSeltTest(wantedSeltResult) {
                var _this2 = this;

                this.loadingFakeTest = true;

                return this.LineDiagnosticsService.fakeSeltTest({
                    serviceName: this.serviceName,
                    number: this.lineNumber
                }, {
                    seltResult: wantedSeltResult
                }).$promise.then(function (result) {
                    console.log(wantedSeltResult + " simulation complete :: " + result);
                }).catch(function (error) {
                    console.warn(error);
                }).finally(function () {
                    _this2.loadingFakeTest = false;
                });
            }
        }, {
            key: "runLineDiagnostic",
            value: function runLineDiagnostic(requestParam) {
                var _this3 = this;

                var keepActionsDone = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

                this.loading = true;

                return this.LineDiagnosticsService.getRunDiagnostic({
                    number: this.lineNumber,
                    serviceName: this.serviceName
                }, requestParam).then(function (lineDiagnostic) {
                    _this3.buildLineDiagnostic(lineDiagnostic);
                    _this3.checkDiagnosticStatus();
                    _this3.setCurrentStep();

                    if (keepActionsDone) {
                        _this3.currentLineDiagnostic.data.actionsDone = requestParam.actionsDone;
                    }
                    return lineDiagnostic;
                }, function (error) {
                    if (!_.isEmpty(error)) {
                        _this3.Toast.error([_this3.$translate.instant("tools_lineDiagnostics_diagnostic_run_error"), _.get(error, "data.message", "")].join(" "));
                        _this3.stopPoller();
                    }
                    return _this3.$q.reject(error);
                }).finally(function () {
                    _this3.loading = false;
                    _this3.incidentTestProgression = 100;
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

                this.LineDiagnosticService.getCancelDiagnostic({ number: this.lineNumber, serviceName: this.serviceName }).$promise.catch(function (error) {
                    _this4.Toast.error([_this4.$translate.instant("tools_lineDiagnostics_diagnostic_cancel_error"), _.get(error, "data.message", "")].join(" "));
                    return _this4.$q.reject(error);
                });
            }
        }, {
            key: "getNextAction",
            value: function getNextAction() {
                var _this5 = this;

                return _.chain(this.currentLineDiagnostic.getActionsToDo()).filter(function (action) {
                    return !_.includes(_this5.currentLineDiagnostic.getActionsDone(), action);
                }).first().value();
            }
        }, {
            key: "goToInvestigationStep",
            value: function goToInvestigationStep() {
                this.beginDiagnostic = false;
                this.startPoller(false);
            }
        }, {
            key: "hasFinalStepQuestions",
            value: function hasFinalStepQuestions() {
                return this.currentLineDiagnostic.getQuestionsToAnswerByName().length > 0 && this.getInvestigationStepQuestions().length === 0 && !this.currentLineDiagnostic.hasQuestionToAnswer("resolvedAfterTests");
            }
        }, {
            key: "isActionAQuestion",
            value: function isActionAQuestion(actionName) {
                return _.includes(this.constants.STEPS.INVESTIGATION.ACTIONS_AS_QUESTIONS, actionName);
            }
        }, {
            key: "getInvestigationStepQuestions",
            value: function getInvestigationStepQuestions() {
                var _this6 = this;

                return _.filter(this.currentLineDiagnostic.data.toAnswer, function (question) {
                    return _.includes(_this6.constants.STEPS.INVESTIGATION.QUESTIONS, question.name);
                });
            }
        }, {
            key: "setCurrentStep",
            value: function setCurrentStep() {
                var steps = this.constants.STEPS;
                var endStatus = this.constants.STATUS.END;

                switch (this.currentLineDiagnostic.faultType) {
                    case this.constants.FAULT_TYPES.UNKNOWN:
                        this.beginDiagnostic = true;
                        this.currentStep = steps.DETECTION.LABEL;
                        break;
                    case this.constants.FAULT_TYPES.NO_SYNCHRONIZATION:
                    case this.constants.FAULT_TYPES.ALIGNMENT:
                    case this.constants.FAULT_TYPES.SYNC_LOSS_OR_LOW_BANDWIDTH:
                        if (this.beginDiagnostic) {
                            this.currentStep = steps.DETECTION.LABEL;
                        } else if (_.includes(endStatus, this.currentLineDiagnostic.status) || this.hasFinalStepQuestions()) {
                            this.currentStep = steps.SOLUTION_PROPOSAL.LABEL;
                        } else {
                            this.currentStep = steps.INVESTIGATION.LABEL;
                        }
                        break;
                    default:
                        this.currentStep = steps.DETECTION.LABEL;
                }
            }
        }, {
            key: "checkDiagnosticStatus",
            value: function checkDiagnosticStatus() {
                if (this.currentLineDiagnostic.status === this.constants.STATUS.WAITING_ROBOT) {
                    this.startPoller();
                } else if (_.includes(_.union(this.constants.STATUS.END, this.constants.STATUS.PAUSE), this.currentLineDiagnostic.status)) {
                    this.stopPoller();
                } else if (this.currentLineDiagnostic.status === this.constants.STATUS.PROBLEM) {
                    this.stopPoller();
                    this.cancelLineDiagnostic();
                }
            }
        }, {
            key: "startPoller",
            value: function startPoller() {
                var keepActionsDone = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

                this.runLineDiagnostic(this.currentLineDiagnostic.convertToRequestParams(), keepActionsDone);
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
                this.beginDiagnostic = false;
                this.currentLineDiagnostic.addActionDone(unplugAction);
                this.startPoller(false);
            }
        }, {
            key: "addActionDone",
            value: function addActionDone(action) {
                this.actionRequired = false;
                this.currentLineDiagnostic.addActionDone(action);

                if (_.isEmpty(_.difference(this.currentLineDiagnostic.getActionsToDo(), this.currentLineDiagnostic.getActionsDone()))) {
                    this.startPoller(true);
                }
            }
        }, {
            key: "showWarning",
            value: function showWarning() {
                this.actionRequired = true;
            }
        }, {
            key: "$onInit",
            value: function $onInit() {
                var _this7 = this;

                var delayRequestStart = 3000;
                var requestParam = {};
                this.currentLineDiagnostic = null;
                this.currentStep = this.constants.STEPS.DETECTION.LABEL;

                this.actionRequired = false;
                this.loading = false;
                this.progressBarCycle = null;
                this.waitingRobotAction = false;
                this.loadingFakeTest = false;

                if (this.serviceName === "xdsl-ls148374-2") {
                    requestParam = {
                        answers: {
                            modemType: "forceAligment"
                        }
                    };
                }

                this.LineDiagnosticsService.loadTranslations().then(function () {
                    _this7.translateReady = true;
                    _this7.animateProgressBar();

                    _this7.$timeout(function () {
                        _this7.runLineDiagnostic(requestParam);
                    }, delayRequestStart);
                }, function () {
                    _this7.translateReady = null;
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
        DETECTION: {
            LABEL: "detectionStep",
            ACTIONS: ["unplugModem"],
            QUESTIONS: ["modemIsSynchronized"]
        },
        INVESTIGATION: {
            LABEL: "investigationStep",
            ACTIONS: ["modemIsSynchronized", "modemStillSynchronized"],
            ACTIONS_AS_QUESTIONS: ["checkFilter", "checkConnectionCable"],
            QUESTIONS: ["modemIsSynchronized", "modemStillSynchronized", "severalInternetConnections"]
        },
        SOLUTION_PROPOSAL: {
            LABEL: "solutionProposalStep"
        }
    },
    ROBOT_ACTION: {
        SELT_TEST: "seltTest"
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
    },
    QUESTIONS_ENUM: {
        BANDWIDTH_TEST_UNIT: ["Kbps", "Mbps"],
        PROBLEM_TYPE: ["lowBandwidth", "syncLoss"]
    }
});

angular.module("ovh-angular-line-diagnostics").factory("LineDiagnosticFactory", ["DIAGNOSTICS_CONSTANTS", function (DIAGNOSTICS_CONSTANTS) {
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

            this.clearPreviousActionsDone();
        }

        _createClass(LineDiagnostic, [{
            key: "hasFinishAllTests",
            value: function hasFinishAllTests() {
                return !_.isNull(_.get(this, "data.answers.resolvedAfterTests", null));
            }
        }, {
            key: "clearPreviousActionsDone",
            value: function clearPreviousActionsDone() {
                var _this8 = this;

                if (this.data) {
                    _.remove(this.data.actionsDone, function (action) {
                        return !_.includes(_this8.getActionsToDo(), action);
                    });
                }
            }
        }, {
            key: "isOnSeltTest",
            value: function isOnSeltTest() {
                return _.isEqual(DIAGNOSTICS_CONSTANTS.ROBOT_ACTION.SELT_TEST, _.get(this, "data.robotAction", ""));
            }
        }, {
            key: "hasSeltTestDone",
            value: function hasSeltTestDone() {
                return !_.isNull(_.get(this, "data.seltTest.status"));
            }
        }, {
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
                return _.get(this, "data.actionsDone", []);
            }
        }, {
            key: "addActionDone",
            value: function addActionDone(actionToAdd) {
                this.data.actionsDone.push(actionToAdd);
            }
        }, {
            key: "removeActionToDo",
            value: function removeActionToDo(actionToRemove) {
                _.remove(this.data.actionsToDo, "name", actionToRemove);
            }
        }, {
            key: "getQuestionsToAnswerByName",
            value: function getQuestionsToAnswerByName() {
                var questions = _.get(this, "data.toAnswer", []);
                return _.chain(questions).map("name").flatten().value();
            }
        }, {
            key: "hasQuestionToAnswer",
            value: function hasQuestionToAnswer(questionName) {
                return _.includes(this.getQuestionsToAnswerByName(), questionName);
            }
        }, {
            key: "convertToRequestParams",
            value: function convertToRequestParams() {
                var defaultFaultType = DIAGNOSTICS_CONSTANTS.FAULT_TYPES.UNKNOWN;
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
}]);

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

        lineDiagnosticsService.fakeSeltTest = function (uriParams, fakeResult) {
            return OvhApiXdslDiagnosticLines.v6().fakeSeltDev(uriParams, fakeResult);
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

    $templateCache.put('/ovh-angular-line-diagnostics/src/ovh-angular-line-diagnostics/ovh-angular-line-diagnostics.html', "<div class=row><div class=col-md-6><div class=oui-progress-tracker><ol class=oui-progress-tracker__steps><li class=oui-progress-tracker__step data-ng-class=\"{\n" + "                        'oui-progress-tracker__step_active': $ctrl.currentStep === 'detectionStep',\n" + "                        'oui-progress-tracker__step_complete': $ctrl.currentStep !== 'detectionStep'\n" + "                    }\"><span class=oui-progress-tracker__status><span class=oui-progress-tracker__label data-translate=tools_lineDiagnostics_detection_step></span></span></li><li class=oui-progress-tracker__step data-ng-class=\"{\n" + "                        'oui-progress-tracker__step_active': $ctrl.currentStep === 'investigationStep',\n" + "                        'oui-progress-tracker__step_complete': $ctrl.currentStep === 'solutionProposalStep',\n" + "                        'oui-progress-tracker__step_disabled': $ctrl.currentStep === 'detectionStep'\n" + "                    }\"><span class=oui-progress-tracker__status><span class=oui-progress-tracker__label data-translate=tools_lineDiagnostics_investigation_step></span></span></li><li class=oui-progress-tracker__step data-ng-class=\"{\n" + "                        'oui-progress-tracker__step_active': $ctrl.currentStep === 'solutionProposalStep',\n" + "                        'oui-progress-tracker__step_disabled': $ctrl.currentStep !== 'solutionProposalStep'\n" + "                    }\"><span class=oui-progress-tracker__status><span class=oui-progress-tracker__label data-translate=tools_lineDiagnostics_solution_proposal_step></span></span></li></ol></div></div><div class=col-md-6 data-ng-if=$ctrl.currentLineDiagnostic.isOnSeltTest()><div data-ng-if=!$ctrl.loadingFakeTest><span>Simulation du test SELT (Mode debug)</span><p><oui-button variant=secondary data-on-click=\"$ctrl.fakeSeltTest('linePreloc')\">linePreloc</oui-button><oui-button variant=secondary data-on-click=\"$ctrl.fakeSeltTest('custoPreloc')\">custPreloc</oui-button><oui-button variant=secondary data-on-click=\"$ctrl.fakeSeltTest('nraPreloc')\">nraPreloc</oui-button><oui-button variant=secondary data-on-click=\"$ctrl.fakeSeltTest('failed')\">failed</oui-button></p></div><div data-ng-if=$ctrl.loadingFakeTest><oui-spinner size=m></oui-spinner></div></div></div><div class=row><toast-message></toast-message></div><div class=row data-ng-if=\"$ctrl.currentLineDiagnostic.status !== 'problem'\"><div data-ng-if=\"$ctrl.currentStep === 'detectionStep'\" data-ng-include=\"'/ovh-angular-line-diagnostics/src/ovh-angular-line-diagnostics/steps/ovh-angular-line-diagnostics-detection-step.html'\"></div><div data-ng-if=\"$ctrl.currentStep === 'investigationStep'\" data-ng-include=\"'/ovh-angular-line-diagnostics/src/ovh-angular-line-diagnostics/steps/ovh-angular-line-diagnostics-investigation-step.html'\"></div><div data-ng-if=\"$ctrl.currentStep === 'solutionProposalStep'\" data-ng-include=\"'/ovh-angular-line-diagnostics/src/ovh-angular-line-diagnostics/steps/ovh-angular-line-diagnostics-solution-proposal-step.html'\"></div></div><div class=row data-ng-if=\"$ctrl.currentLineDiagnostic.status === 'problem'\"><oui-message data-type=error><span data-translate=tools_lineDiagnostics_diagnostic_critical_problem></span></oui-message></div>");

    $templateCache.put('/ovh-angular-line-diagnostics/src/ovh-angular-line-diagnostics/steps/ovh-angular-line-diagnostics-detection-step.html', "<div class=col-md-8 data-ng-if=\"$ctrl.incidentTestProgression < 100\"><span data-translate=tools_lineDiagnostics_detection_step_test></span><oui-progress><oui-progress-bar data-type=info data-value=$ctrl.incidentTestProgression></oui-progress-bar></oui-progress></div><div class=\"col-md-4 row\" data-ng-if=\"$ctrl.currentLineDiagnostic.status === 'waitingRobot'\"><div class=\"d-inline-block col-xs-1\"><oui-spinner size=s></oui-spinner></div><p class=d-inline-block data-translate=tools_lineDiagnostics_waitingRobot></p></div><div class=col-md-8 data-ng-if=\"$ctrl.incidentTestProgression === 100 &&\n" + "                 $ctrl.currentLineDiagnostic\"><div data-ng-if=\"$ctrl.currentLineDiagnostic.hasQuestionToAnswer('modemIsSynchronized')\"><form class=form-group novalidate name=firstStepQuestionForm><oui-field data-label=\"{{:: 'tools_lineDiagnostics_detection_step_modem_question' | translate }}\" data-label-popover=\"{{:: 'tools_lineDiagnostics_detection_step_modem_question_help' | translate }}\"><oui-radio-toggle-group class=d-inline-block data-model=$ctrl.currentLineDiagnostic.data.answers.modemIsSynchronized data-on-change=$ctrl.startPoller()><oui-radio data-value=true><span data-translate=tools_lineDiagnostics_detail_yes></span></oui-radio><oui-radio data-value=false><span data-translate=tools_lineDiagnostics_detail_no></span></oui-radio><oui-spinner class=ml-2 data-ng-if=$ctrl.loading data-size=s></oui-spinner></oui-radio-toggle-group></oui-field></form></div><div data-ng-if=\"$ctrl.currentLineDiagnostic.faultType !== 'unknown' &&\n" + "                     $ctrl.currentLineDiagnostic.status !== 'waitingRobot'\"><oui-message data-type=warning><span data-translate=tools_lineDiagnostics_detection_step_warning></span></oui-message><div data-ng-if=\"$ctrl.currentLineDiagnostic.faultType === 'noSync'\"><label for=unplugModem class=oui-label data-translate=tools_lineDiagnostics_detection_step_modem_unplug_request></label><oui-button id=unplugModem data-variant=secondary data-variant-nav=next data-on-click=\"$ctrl.setModemUnplug('unplugModem')\"><span data-translate=tools_lineDiagnostics_detection_step_modem_unplug_confirm></span></oui-button><oui-spinner class=ml-2 data-ng-if=$ctrl.loading data-size=s></oui-spinner></div><div data-ng-if=\"$ctrl.currentLineDiagnostic.faultType === 'alignment' ||\n" + "                         $ctrl.currentLineDiagnostic.faultType === 'syncLossOrLowBandwidth'\"><oui-button data-text=\"{{:: 'tools_lineDiagnostics_detection_step_continue' | translate }}\" data-variant=secondary data-variant-nav=next data-on-click=$ctrl.goToInvestigationStep()><span data-translate=tools_lineDiagnostics_detection_step_continue></span></oui-button><oui-spinner class=ml-2 data-ng-if=$ctrl.loading data-size=s></oui-spinner></div></div></div>");

    $templateCache.put('/ovh-angular-line-diagnostics/src/ovh-angular-line-diagnostics/steps/ovh-angular-line-diagnostics-investigation-step.html', "<div class=col-md-6 data-ng-if=!$ctrl.currentLineDiagnostic.isOnSeltTest()><div class=form-group><p><span data-translate=tools_lineDiagnostics_header_investigation_step_title></span><oui-spinner data-ng-if=$ctrl.loading data-size=s></oui-spinner></p><div class=mb-5 data-ng-if=\"$ctrl.currentLineDiagnostic.data.actionsDone && $ctrl.currentLineDiagnostic.data.actionsDone.length > 0\"><p data-ng-repeat=\"actionDone in $ctrl.currentLineDiagnostic.getActionsDone()\"><span class=\"oui-icon oui-icon-success\" aria-hidden=true></span> <span data-translate=\"{{:: 'tools_lineDiagnostics_investigation_step_action_' + actionDone + '_done_text' }}\"></span></p></div><div data-ng-if=\"$ctrl.currentLineDiagnostic.data.actionsToDo &&\n" + "                         $ctrl.currentLineDiagnostic.data.actionsToDo.length > 0 &&\n" + "                         $ctrl.getNextAction()\"><label for=\"{{ $ctrl.getNextAction() }}\" class=oui-label><span data-translate=\"{{ 'tools_lineDiagnostics_investigation_step_action_' + $ctrl.getNextAction() + '_title' }}\"></span><oui-popover data-ng-if=\"$ctrl.getNextAction() === 'checkFilter'\"><button type=button class=oui-popover-button oui-popover-trigger></button><oui-popover-content><p class=text-center data-translate=tools_lineDiagnostics_investigation_step_action_checkFilter_example></p><img src=\"assets/images/diagnostic/filtre-adsl.png\"></oui-popover-content></oui-popover></label><oui-button data-variant=secondary data-on-click=$ctrl.addActionDone($ctrl.getNextAction())><span data-translate=\"{{ 'tools_lineDiagnostics_investigation_step_action_' + $ctrl.getNextAction() + '_text' }}\"></span></oui-button><oui-button data-variant=secondary data-on-click=$ctrl.showWarning() data-ng-if=$ctrl.isActionAQuestion($ctrl.getNextAction())><span data-translate=tools_lineDiagnostics_detail_no></span></oui-button></div><div data-ng-if=\"$ctrl.currentLineDiagnostic.data.toAnswer &&\n" + "                         $ctrl.getInvestigationStepQuestions().length > 0\" data-ng-repeat=\"question in $ctrl.getInvestigationStepQuestions()\"><oui-field data-label=\"{{:: 'tools_lineDiagnostics_investigation_step_question_' + question.name + '_title' | translate }}\"><oui-radio-toggle-group class=d-inline-block data-model=$ctrl.currentLineDiagnostic.data.answers[question.name] data-ng-if=\"question.type === 'boolean'\" data-on-change=$ctrl.startPoller()><oui-radio data-value=true><span data-translate=tools_lineDiagnostics_detail_yes></span></oui-radio><oui-radio data-value=false><span data-translate=tools_lineDiagnostics_detail_no></span></oui-radio></oui-radio-toggle-group></oui-field></div></div></div><div class=col-md-8><oui-message data-type=warning data-ng-if=$ctrl.actionRequired><span data-translate=tools_lineDiagnostics_action_required_action></span></oui-message></div><div class=\"col-md-5 oui-message oui-message_info\" data-ng-if=\"$ctrl.currentLineDiagnostic.hasQuestionToAnswer('resolvedAfterTests')\"><p data-translate=tools_lineDiagnostics_investigation_step_action_is_problem_solved></p><oui-radio-toggle-group class=d-inline-block data-model=$ctrl.currentLineDiagnostic.data.answers.resolvedAfterTests data-on-change=$ctrl.startPoller()><oui-radio data-value=true><span data-translate=tools_lineDiagnostics_detail_yes></span></oui-radio><oui-radio data-value=false><span data-translate=tools_lineDiagnostics_detail_no></span></oui-radio></oui-radio-toggle-group></div><div class=col-md-6 data-ng-if=$ctrl.currentLineDiagnostic.isOnSeltTest()><oui-spinner size=m></oui-spinner><p data-translate=tools_lineDiagnostics_header_investigation_step_selt_test></p></div>");

    $templateCache.put('/ovh-angular-line-diagnostics/src/ovh-angular-line-diagnostics/steps/ovh-angular-line-diagnostics-solution-proposal-step.html', "<div class=col-md-12 data-ng-if=$ctrl.currentLineDiagnostic.data.answers.resolvedAfterTests><div class=row><img class=col-md-1 src=assets/images/diagnostic/human-good.svg width=120 height=\"120\"> <span class=col-md-8><p class=oui-header_2 data-translate=tools_lineDiagnostics_solution_proposal_step_problem_solved_title></p><p data-translate=tools_lineDiagnostics_solution_proposal_step_problem_solved_subtitle></p><oui-button data-variant=secondary data-text=\"{{:: 'tools_lineDiagnostics_solution_proposal_step_exit_diagnostic' | translate }}\"></oui-button></span></div></div><div data-ng-if=\"!$ctrl.showRequestForm && !$ctrl.currentLineDiagnostic.data.answers.resolvedAfterTests\"><div class=row><img class=col-md-1 src=assets/images/diagnostic/human-think.svg width=120 height=\"120\"> <span class=col-md-8><p class=oui-header_2 data-translate=tools_lineDiagnostics_solution_proposal_step_problem_to_resolve_title></p><p data-translate=tools_lineDiagnostics_solution_proposal_step_problem_to_resolve_subtitle></p><oui-button data-variant=secondary data-text=\"{{:: 'tools_lineDiagnostics_solution_proposal_step_fill_request_form' | translate }}\" data-on-click=\"$ctrl.showRequestForm = true\"></oui-button></span></div></div><div class=col-md-12 data-ng-if=$ctrl.showRequestForm><form name=requestInterventionForm novalidate data-ng-if=\"$ctrl.currentLineDiagnostic.data.toAnswer && $ctrl.currentLineDiagnostic.data.toAnswer.length > 0\"><div data-ng-repeat=\"question in $ctrl.currentLineDiagnostic.data.toAnswer\"><oui-field data-label=\"{{:: 'tools_lineDiagnostics_solution_proposal_step_request_form_question_' + question.name + '_title' | translate }}\"><input class=oui-input name=\"{{:: question.name }}\" value=\"{{ question.defaultValue }}\" data-ng-model=$ctrl.currentLineDiagnostic.answers[question.name] data-ng-required=\"{{:: question.required }}\" data-ng-if=\"question.type === 'string'\"> <input class=oui-input name=\"{{:: question.name }}\" value=\"{{ question.defaultValue }}\" data-ng-model=$ctrl.currentLineDiagnostic.answers[question.name] data-ng-required=\"{{:: question.required }}\" data-ng-if=\"question.type === 'long'\"><oui-radio-toggle-group class=d-inline-block data-model=$ctrl.currentLineDiagnostic.answers[question.name] data-ng-if=\"question.type === 'boolean'\"><oui-radio data-value=true><span data-translate=tools_lineDiagnostics_detail_yes></span></oui-radio><oui-radio data-value=false><span data-translate=tools_lineDiagnostics_detail_no></span></oui-radio></oui-radio-toggle-group><oui-calendar data-ng-if=\"question.type === 'datetime'\" data-name=\"{{:: question.name }}\" data-model=$ctrl.currentLineDiagnostic.data.answers[question.name]></oui-calendar><oui-select data-ng-if=\"question.type === 'enum'\" name=\"{{:: question.name }}\" data-model=$ctrl.currentLineDiagnostic.data.answers[question.name] data-items=$ctrl.enumQuestions[question.name] data-align=start data-ng-required=question.required><span ng-bind=$item></span></oui-select></oui-field></div></form></div>");
}]);
//# sourceMappingURL=ovh-angular-line-diagnostics.js.map
