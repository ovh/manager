angular.module("ovh-angular-line-diagnostics").controller("LineDiagnosticsCtrl", class LineDiagnosticsCtrl {
    constructor ($interval, $q, $state, $timeout, $translate, LineDiagnostics, LineDiagnosticFactory, Toast, DIAGNOSTICS_CONSTANTS) {
        this.$interval = $interval;
        this.$q = $q;
        this.$state = $state;
        this.$timeout = $timeout;
        this.$translate = $translate;
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

    $onInit () {
        const delayRequestStart = 3000;
        this.currentLineDiagnostic = null;
        this.currentStep = this.DIAGNOSTICS_CONSTANTS.STEPS.DETECTION.LABEL;
        this.currentAction = null;
        this.appointmentSlot = null;

        this.actionRequired = false;
        this.loading = false;
        this.progressBarCycle = null;

        this.LineDiagnosticsService.loadTranslations().then(() => {
            this.animateProgressBar();
            this.$timeout(() => {
                this.runLineDiagnostic();
            }, delayRequestStart);
        }).catch(() => {
            this.Toast.error(this.$translate.instant("tools_lineDiagnostics_error_loading_translations"));
        });
    }

    $onDestroy () {
        this.stopPoller();
    }

    animateProgressBar () {
        this.detectionStepProgression = 0;
        this.progressBarCycle = this.$interval(() => {
            if (this.detectionStepProgression + this.DIAGNOSTICS_CONSTANTS.PROGRESS_BAR.STEP < this.DIAGNOSTICS_CONSTANTS.PROGRESS_BAR.LIMIT) {
                this.detectionStepProgression = _.random(this.detectionStepProgression, this.detectionStepProgression + this.DIAGNOSTICS_CONSTANTS.PROGRESS_BAR.STEP);
            }
        }, this.DIAGNOSTICS_CONSTANTS.PROGRESS_BAR.INTERVAL);
    }

    runLineDiagnostic (requestParam) {
        this.loading = true;

        return this.LineDiagnosticsService.getRunDiagnostic({
            number: this.lineNumber,
            serviceName: this.serviceName
        }, requestParam).then((lineDiagnostic) => {
            this.buildLineDiagnostic(lineDiagnostic);
            this.checkDiagnosticStatus(lineDiagnostic);
            this.setCurrentStep();
            this.getNextAction();

            return lineDiagnostic;
        }).catch((error) => {
            if (!_.isEmpty(error)) {
                this.checkDiagnosticStatus(error);
                this.Toast.error([this.$translate.instant("tools_lineDiagnostics_diagnostic_run_error"), error.message].join(" "));
            }
        }).finally(() => {
            this.loading = false;
            this.detectionStepProgression = 100;
            if (this.progressBarCycle) {
                this.$interval.cancel(this.progressBarCycle);
                this.progressBarCycle = null;
            }
        });
    }

    cancelLineDiagnostic () {
        return this.LineDiagnosticsService.getCancelDiagnostic({ number: this.lineNumber, serviceName: this.serviceName }).$promise
            .catch((error) => {
                this.Toast.error([this.$translate.instant("tools_lineDiagnostics_diagnostic_cancel_error"), _.get(error, "data.message", "")].join(" "));
            });
    }

    getNextAction () {
        this.currentAction = _.chain(this.currentLineDiagnostic.getActionsToDo())
            .filter((action) => !_.includes(this.currentLineDiagnostic.getActionsDone(), action))
            .first()
            .value();
    }

    goToInvestigationStep () {
        this.diagnosticFromBeginning = false;
        this.setCurrentStep();
    }

    isActionAQuestion (actionName) {
        return this.DIAGNOSTICS_CONSTANTS.STEPS.INVESTIGATION.ACTIONS_AS_QUESTIONS.includes(actionName);
    }

    getInvestigationStepQuestions () {
        return this.currentLineDiagnostic.data.toAnswer.filter((question) =>
            this.DIAGNOSTICS_CONSTANTS.STEPS.INVESTIGATION.QUESTIONS.includes(question.name));
    }

    getInvestigationStepSpecificQuestions () {
        return this.currentLineDiagnostic.data.toAnswer.filter((question) =>
            this.DIAGNOSTICS_CONSTANTS.STEPS.INVESTIGATION.SPECIFIC_QUESTIONS.includes(question.name));
    }

    setCurrentStep () {
        const steps = this.DIAGNOSTICS_CONSTANTS.STEPS;

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
    }

    checkDiagnosticStatus (diagnosticResult) {
        if (_.isEqual(diagnosticResult.status, this.DIAGNOSTICS_CONSTANTS.STATUS.WAITING_ROBOT)) {
            this.startPoller();
        } else {
            this.stopPoller();
            if (_.isEqual(diagnosticResult.status, this.DIAGNOSTICS_CONSTANTS.STATUS.PROBLEM) &&
                !_.isEqual(_.get(diagnosticResult, "data.error", ""), this.DIAGNOSTICS_CONSTANTS.ERRORS.MONITORING_EXISTS)) {
                this.cancelLineDiagnostic();
            }
        }
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
        this.diagnosticFromBeginning = false;
        this.addActionDone(unplugAction);
    }

    isOnFinalStep () {
        return this.isDiagnosticComplete() || this.hasFinalStepQuestions() || this.isMonitoringAlreadyExists() ||
               _.isEqual(this.currentLineDiagnostic.data.robotAction, this.DIAGNOSTICS_CONSTANTS.ROBOT_ACTION.REQUEST_MONITORING);
    }

    isDiagnosticComplete () {
        const endStatus = this.DIAGNOSTICS_CONSTANTS.STATUS.END;
        return _.includes(endStatus, _.get(this.currentLineDiagnostic, "status")) || this.isMonitoringAlreadyExists();
    }

    hasFinalStepQuestions () {
        return !_.isEmpty(this.currentLineDiagnostic.getQuestionsToAnswer()) &&
               _.isEmpty(this.getInvestigationStepQuestions()) &&
               _.isEmpty(this.getInvestigationStepSpecificQuestions()) &&
               !this.currentLineDiagnostic.hasQuestionToAnswer("resolvedAfterTests");
    }

    isMonitoringAlreadyExists () {
        return _.isEqual(_.get(this.currentLineDiagnostic, "data.error", ""), this.DIAGNOSTICS_CONSTANTS.ERRORS.MONITORING_EXISTS);
    }

    addActionDone (action) {
        this.actionRequired = false;
        this.currentLineDiagnostic.addActionDone(action);
        this.startPoller();
    }

    showWarning () {
        this.actionRequired = true;
    }
});
