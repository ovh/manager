angular.module("ovh-angular-line-diagnostics").component("lineDiagnostics", {
    bindings: {
        lineNumber: "@",
        serviceName: "@"
    },
    templateUrl: "/ovh-angular-line-diagnostics/src/ovh-angular-line-diagnostics/ovh-angular-line-diagnostics.html",
    controllerAs: "$ctrl",
    controller: class {
        constructor ($interval, $q, $timeout, $translate, LineDiagnostics, LineDiagnosticFactory, Toast, DIAGNOSTICS_CONSTANTS) {
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

        animateProgressBar () {
            const intervalProgressBar = 1000;
            const progressStep = 20;
            const limitProgress = 90;
            this.incidentTestProgression = 0;
            this.progressBarCycle = this.$interval(() => {
                if (this.incidentTestProgression + progressStep < limitProgress) {
                    this.incidentTestProgression = _.random(this.incidentTestProgression, this.incidentTestProgression + progressStep);
                }
            }, intervalProgressBar);
        }

        fakeSeltTest (wantedSeltResult) {
            this.loadingFakeTest = true;

            return this.LineDiagnosticsService.fakeSeltTest({
                serviceName: this.serviceName,
                number: this.lineNumber
            }, {
                seltResult: wantedSeltResult
            }).$promise
                .then((result) => {
                    console.log(`${wantedSeltResult} simulation complete :: ${result}`);
                }).catch((error) => {
                    console.warn(error);
                }).finally(() => { this.loadingFakeTest = false; });
        }

        runLineDiagnostic (requestParam, keepActionsDone = false) {
            this.loading = true;

            return this.LineDiagnosticsService.getRunDiagnostic({
                number: this.lineNumber,
                serviceName: this.serviceName
            }, requestParam).then((lineDiagnostic) => {
                this.buildLineDiagnostic(lineDiagnostic);
                this.checkDiagnosticStatus();
                this.setCurrentStep();

                if (keepActionsDone) {
                    this.currentLineDiagnostic.data.actionsDone = requestParam.actionsDone;
                }
                return lineDiagnostic;
            }, (error) => {
                if (!_.isEmpty(error)) {
                    this.Toast.error([this.$translate.instant("tools_lineDiagnostics_diagnostic_run_error"), _.get(error, "data.message", "")].join(" "));
                    this.stopPoller();
                }
                return this.$q.reject(error);
            }).finally(() => {
                this.loading = false;
                this.incidentTestProgression = 100;
                if (this.progressBarCycle) {
                    this.$interval.cancel(this.progressBarCycle);
                    this.progressBarCycle = null;
                }
            });
        }

        cancelLineDiagnostic () {
            this.LineDiagnosticService.getCancelDiagnostic({ number: this.lineNumber, serviceName: this.serviceName }).$promise
                .catch((error) => {
                    this.Toast.error([this.$translate.instant("tools_lineDiagnostics_diagnostic_cancel_error"), _.get(error, "data.message", "")].join(" "));
                    return this.$q.reject(error);
                });
        }

        getNextAction () {
            return _.chain(this.currentLineDiagnostic.getActionsToDo())
                .filter((action) => !_.includes(this.currentLineDiagnostic.getActionsDone(), action))
                .first()
                .value();
        }

        goToInvestigationStep () {
            this.beginDiagnostic = false;
            this.startPoller(false);
        }

        hasFinalStepQuestions () {
            return this.currentLineDiagnostic.getQuestionsToAnswerByName().length > 0 &&
                   this.getInvestigationStepQuestions().length === 0 &&
                   !this.currentLineDiagnostic.hasQuestionToAnswer("resolvedAfterTests");
        }

        isActionAQuestion (actionName) {
            return _.includes(this.constants.STEPS.INVESTIGATION.ACTIONS_AS_QUESTIONS, actionName);
        }

        getInvestigationStepQuestions () {
            return _.filter(this.currentLineDiagnostic.data.toAnswer, (question) => _.includes(this.constants.STEPS.INVESTIGATION.QUESTIONS, question.name));
        }

        setCurrentStep () {
            const steps = this.constants.STEPS;
            const endStatus = this.constants.STATUS.END;

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

        checkDiagnosticStatus () {
            if (this.currentLineDiagnostic.status === this.constants.STATUS.WAITING_ROBOT) {
                this.startPoller();
            } else if (_.includes(_.union(this.constants.STATUS.END, this.constants.STATUS.PAUSE), this.currentLineDiagnostic.status)) {
                this.stopPoller();
            } else if (this.currentLineDiagnostic.status === this.constants.STATUS.PROBLEM) {
                this.stopPoller();
                this.cancelLineDiagnostic();
            }
        }

        startPoller (keepActionsDone = false) {
            this.runLineDiagnostic(this.currentLineDiagnostic.convertToRequestParams(), keepActionsDone);
        }

        stopPoller () {
            this.LineDiagnosticsService.deletePollDiagnostic();
        }

        buildLineDiagnostic (lineDiagnostic) {
            this.currentLineDiagnostic = new this.LineDiagnosticFactory(lineDiagnostic);
        }

        setModemUnplug (unplugAction) {
            this.beginDiagnostic = false;
            this.currentLineDiagnostic.addActionDone(unplugAction);
            this.startPoller(false);
        }

        addActionDone (action) {
            this.actionRequired = false;
            this.currentLineDiagnostic.addActionDone(action);

            if (_.isEmpty(_.difference(this.currentLineDiagnostic.getActionsToDo(), this.currentLineDiagnostic.getActionsDone()))) {
                this.startPoller(true);
            }
        }

        showWarning () {
            this.actionRequired = true;
        }

        $onInit () {
            const delayRequestStart = 3000;
            let requestParam = {};
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

            this.LineDiagnosticsService.loadTranslations().then(() => {
                this.translateReady = true;
                this.animateProgressBar();

                this.$timeout(() => {
                    this.runLineDiagnostic(requestParam);
                }, delayRequestStart);
            }, () => {
                this.translateReady = null;
            });
        }

        $onDestroy () {
            this.stopPoller();
        }
    }
});
