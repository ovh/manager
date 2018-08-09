angular.module("ovh-angular-line-diagnostics").component("lineDiagnostics", {
    bindings: {
        lineNumber: "@",
        serviceName: "@"
    },
    templateUrl: "/ovh-angular-line-diagnostics/src/ovh-angular-line-diagnostics/ovh-angular-line-diagnostics.html",
    controllerAs: "$ctrl",
    controller: class {
        constructor ($interval, $q, $translate, LineDiagnostics, LineDiagnosticFactory, Toast, DIAGNOSTICS_CONSTANTS) {
            this.$q = $q;
            this.$interval = $interval;
            this.$translate = $translate;
            this.LineDiagnosticsService = LineDiagnostics;
            this.LineDiagnosticFactory = LineDiagnosticFactory;
            this.Toast = Toast;
            this.constants = DIAGNOSTICS_CONSTANTS;
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

        runLineDiagnostic (requestParam) {
            this.loadingAction = true;

            return this.LineDiagnosticsService.getRunDiagnostic({
                number: this.lineNumber,
                serviceName: this.serviceName
            }, requestParam).then((lineDiagnostic) => {
                this.buildLineDiagnostic(lineDiagnostic);
                this.checkDiagnosticStatus();
                this.setCurrentStep();
                return lineDiagnostic;
            }, (error) => {
                if (!_.isEmpty(error)) {
                    this.Toast.error([this.$translate.instant("tools_lineDiagnostics_diagnostic_run_error"), _.get(error, "data.message", "")].join(" "));
                    this.stopPoller();
                }
                return this.$q.reject(error);
            }).finally(() => {
                this.loadingAction = false;
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

        goOnInvestigationStep () {
            this.currentStep = this.constants.STEPS.INVESTIGATION.LABEL;
        }

        setCurrentStep () {
            const steps = this.constants.STEPS;
            const actions = this.currentLineDiagnostic.getActionsToDo();
            const questions = this.currentLineDiagnostic.getQuestionsToAnswer();

            switch (this.currentLineDiagnostic.faultType) {
            case this.constants.FAULT_TYPES.UNKNOWN:
                this.currentStep = steps.INCIDENT_DETECTION.LABEL;
                break;
            case this.constants.FAULT_TYPES.NO_SYNCHRONIZATION:
                if (_.isEqual(this.constants.STEPS.INCIDENT_DETECTION.QUESTIONS, questions) ||
                    _.isEqual(this.constants.STEPS.INCIDENT_DETECTION.ACTIONS, actions)) {
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

        checkDiagnosticStatus () {
            if (this.currentLineDiagnostic.status === this.constants.STATUS.WAITING_ROBOT) {
                this.startPoller(this.currentLineDiagnostic);
            } else if (_.includes(_.union(this.constants.STATUS.END, this.constants.STATUS.PAUSE), this.currentLineDiagnostic.status)) {
                this.stopPoller();
            } else if (this.currentLineDiagnostic.status === this.constants.STATUS.PROBLEM) {
                this.stopPoller();
                this.cancelLineDiagnostic();
            }
        }

        setModemStatus (status) {
            this.currentLineDiagnostic.data.answers.modemIsSynchronized = status;
            this.startPoller();
        }

        startPoller () {
            this.runLineDiagnostic(this.currentLineDiagnostic.convertToRequestParams());
        }

        stopPoller () {
            this.LineDiagnosticsService.deletePollDiagnostic();
        }

        buildLineDiagnostic (lineDiagnostic) {
            this.currentLineDiagnostic = new this.LineDiagnosticFactory(lineDiagnostic);
        }

        setModemUnplug (unplugAction) {
            this.currentLineDiagnostic.addActionDone(unplugAction);
            this.runLineDiagnostic(this.currentLineDiagnostic.convertToRequestParams());
        }

        $onInit () {
            this.currentLineDiagnostic = null;
            this.currentStep = this.constants.STEPS.INCIDENT_DETECTION.LABEL;
            this.loadingAction = false;
            this.loadingQuestion = false;
            this.progressBarCycle = null;
            this.waitingRobotAction = false;

            this.LineDiagnosticsService.loadTranslations().then(() => {
                let requestParam = {};
                this.translateReady = true;
                this.animateProgressBar();

                // DEBUG
                if (this.serviceName === "xdsl-ls148374-2") {
                    requestParam = {
                        faultType: "alignment",
                        answers: {
                            modemType: "forceAlignment"
                        }
                    };
                }

                this.runLineDiagnostic(requestParam);
            }, () => {
                this.translateReady = null;
            });
        }

        $onDestroy () {
            this.stopPoller();
        }
    }
});
