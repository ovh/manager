import filter from 'lodash/filter';
import get from 'lodash/get';
import head from 'lodash/head';
import includes from 'lodash/includes';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import random from 'lodash/random';

import {
  ASSETS,
  PROGRESS_BAR,
  STEPS,
  ROBOT_ACTION,
  FAULT_TYPES,
  ERRORS,
  STATUS,
  BANDWIDTH_TEST_SITE,
  QUESTIONS_ENUM,
} from './constants';

export default class LineDiagnosticsCtrl {
  /* @ngInject */
  constructor(
    $interval,
    $state,
    $timeout,
    $translate,
    $uibModal,
    atInternet,
    LineDiagnostics,
    LineDiagnosticFactory,
    TucToast,
  ) {
    this.$interval = $interval;
    this.$state = $state; // used in HTML
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.$uibModal = $uibModal;
    this.atInternet = atInternet;
    this.LineDiagnosticsService = LineDiagnostics;
    this.LineDiagnosticFactory = LineDiagnosticFactory;
    this.TucToast = TucToast;

    this.assets = ASSETS;

    this.bandwidthTestSite = BANDWIDTH_TEST_SITE;
    this.enumQuestions = {
      bandwidthTestUnit: QUESTIONS_ENUM.BANDWIDTH_TEST_UNIT,
      problemType: QUESTIONS_ENUM.PROBLEM_TYPE,
    };
    this.steps = STEPS;
  }

  $onInit() {
    const delayRequestStart = 3000;
    this.currentLineDiagnostic = null;
    this.currentStep = this.steps.DETECTION.LABEL;
    this.currentAction = null;
    this.appointmentSlot = null;

    this.actionRequired = false;
    this.loading = false;
    this.progressBarCycle = null;

    this.trackPage(this.currentStep);

    this.animateProgressBar();
    this.$timeout(() => {
      this.runLineDiagnostic();
    }, delayRequestStart);
  }

  $onDestroy() {
    this.stopPoller();
  }

  animateProgressBar() {
    this.detectionStepProgression = 0;
    this.progressBarCycle = this.$interval(() => {
      if (this.detectionStepProgression + PROGRESS_BAR.STEP
        < PROGRESS_BAR.LIMIT) {
        this.detectionStepProgression = random(
          this.detectionStepProgression,
          this.detectionStepProgression + PROGRESS_BAR.STEP,
        );
      }
    }, PROGRESS_BAR.INTERVAL);
  }

  runLineDiagnostic(requestParam) {
    this.loading = true;

    return this.LineDiagnosticsService.getRunDiagnostic({
      number: this.lineNumber,
      serviceName: this.serviceName,
    }, requestParam).then((lineDiagnostic) => {
      this.buildLineDiagnostic(lineDiagnostic);
      this.checkDiagnosticStatus(lineDiagnostic);
      this.setCurrentStep();
      this.getNextAction();

      return lineDiagnostic;
    }).catch((error) => {
      if (!isEmpty(error)) {
        this.checkDiagnosticStatus(error);
        this.TucToast.error([this.$translate.instant('tools_lineDiagnostics_diagnostic_run_error'), error.message].join(' '));
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

  cancelLineDiagnostic() {
    return this.LineDiagnosticsService.getCancelDiagnostic({
      number: this.lineNumber,
      serviceName: this.serviceName,
    })
      .$promise
      .catch((error) => {
        this.TucToast.error([this.$translate.instant('tools_lineDiagnostics_diagnostic_cancel_error'), get(error, 'data.message', '')].join(' '));
      });
  }

  getNextAction() {
    this.currentAction = head(
      filter(
        this.currentLineDiagnostic.getActionsToDo(),
        (action) => !includes(this.currentLineDiagnostic.getActionsDone(), action),
      ),
    );
  }

  goToInvestigationStep() {
    this.diagnosticFromBeginning = false;
    this.setCurrentStep();
  }

  isActionAQuestion(actionName) {
    return this.steps.INVESTIGATION.ACTIONS_AS_QUESTIONS.includes(actionName);
  }

  getInvestigationStepQuestions() {
    return this.currentLineDiagnostic.data.toAnswer.filter(
      (question) => this.steps.INVESTIGATION.QUESTIONS.includes(question.name),
    );
  }

  getInvestigationStepSpecificQuestions() {
    return this.currentLineDiagnostic.data.toAnswer.filter(
      (question) => this.steps.INVESTIGATION.SPECIFIC_QUESTIONS.includes(question.name),
    );
  }

  setCurrentStep() {
    const previousStep = this.currentStep;
    const steps = STEPS;

    switch (this.currentLineDiagnostic.faultType) {
      case FAULT_TYPES.UNKNOWN:
        this.diagnosticFromBeginning = true;
        this.currentStep = steps.DETECTION.LABEL;
        break;
      case FAULT_TYPES.NO_SYNCHRONIZATION:
      case FAULT_TYPES.ALIGNMENT:
      case FAULT_TYPES.SYNC_LOSS_OR_LOW_BANDWIDTH:
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

  checkDiagnosticStatus(diagnosticResult) {
    if (isEqual(diagnosticResult.status, STATUS.WAITING_ROBOT)) {
      this.startPoller();
    } else {
      this.stopPoller();
      if (isEqual(diagnosticResult.status, STATUS.PROBLEM)
      && !isEqual(get(diagnosticResult, 'data.error', ''), ERRORS.MONITORING_EXISTS)) {
        this.cancelLineDiagnostic();
      }
    }
  }

  startPoller() {
    this.runLineDiagnostic(this.currentLineDiagnostic.convertToRequestParams());
  }

  stopPoller() {
    this.LineDiagnosticsService.deletePollDiagnostic();
  }

  buildLineDiagnostic(lineDiagnostic) {
    this.currentLineDiagnostic = new this.LineDiagnosticFactory(lineDiagnostic);
  }

  setModemUnplug(unplugAction) {
    this.diagnosticFromBeginning = false;
    this.addActionDone(unplugAction);
  }

  isOnFinalStep() {
    return this.isDiagnosticComplete()
      || this.hasFinalStepQuestions()
      || this.isMonitoringAlreadyExists()
      || isEqual(
        this.currentLineDiagnostic.data.robotAction,
        ROBOT_ACTION.REQUEST_MONITORING,
      );
  }

  isDiagnosticComplete() {
    const endStatus = STATUS.END;
    return includes(endStatus, get(this.currentLineDiagnostic, 'status')) || this.isMonitoringAlreadyExists();
  }

  hasFinalStepQuestions() {
    return !isEmpty(this.currentLineDiagnostic.getQuestionsToAnswer())
      && isEmpty(this.getInvestigationStepQuestions())
      && isEmpty(this.getInvestigationStepSpecificQuestions())
      && !this.currentLineDiagnostic.hasQuestionToAnswer('resolvedAfterTests');
  }

  isMonitoringAlreadyExists() {
    return isEqual(get(this.currentLineDiagnostic, 'data.error', ''), ERRORS.MONITORING_EXISTS);
  }

  setDefaultValue(answer) {
    this.currentLineDiagnostic.setDefaultValue(answer);
  }

  addActionDone(action) {
    this.trackAction(action);
    this.actionRequired = false;
    this.currentLineDiagnostic.addActionDone(action);
    this.startPoller();
  }

  answerQuestion(question, answer) {
    this.trackAction(`${question}-${answer ? 'yes' : 'no'}`);
    this.startPoller();
  }

  answerSpecificQuestion() {
    const action = this.currentLineDiagnostic.data.answers.problemType
      ? 'sendProblemType'
      : 'sendBandwidthTest';
    this.trackAction(action);
    this.startPoller();
  }

  goToRequestForm() {
    this.trackAction('goToRequestForm');
    this.showRequestForm = true;
  }

  sendInterventionForm() {
    this.trackAction('sendInterventionForm');
    this.startPoller();
  }

  showWarning() {
    this.actionRequired = true;
  }

  trackAction(action) {
    this.atInternet.trackClick({
      name: `telecom::pack::xdsl::${action}`,
      type: 'action',
      chapter1: 'telecom',
      level2: 'Telecom',
    });
  }

  trackPage(page) {
    this.atInternet.trackPage({
      name: `telecom::pack::xdsl::${page}`,
      type: 'navigation',
      chapter1: 'telecom',
      level2: 'Telecom',
    });
  }
}
