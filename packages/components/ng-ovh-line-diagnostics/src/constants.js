import BROADBAND_LIGHT from './assets/broadband-light.png';
import ADSL_FILTER from './assets/filtre-adsl.png';
import HUMAN_GOOD from './assets/human-good.svg';
import HUMAN_SPEED_AND_GRAPHIC from './assets/human-speedAndGraphic.svg';
import HUMAN_THINK from './assets/human-think.svg';

export const ASSETS = {
  BROADBAND_LIGHT,
  ADSL_FILTER,
  HUMAN_GOOD,
  HUMAN_SPEED_AND_GRAPHIC,
  HUMAN_THINK,
};

export const PROGRESS_BAR = {
  INTERVAL: 1000,
  STEP: 20,
  LIMIT: 90,
};

export const STEPS = {
  DETECTION: {
    LABEL: 'detectionStep',
    ACTIONS: [
      'unplugModem',
    ],
    QUESTIONS: [
      'modemIsSynchronized',
    ],
  },
  INVESTIGATION: {
    LABEL: 'investigationStep',
    ACTIONS: [
      'modemIsSynchronized',
      'modemStillSynchronized',
    ],
    ACTIONS_AS_QUESTIONS: [
      'checkFilter',
      'checkConnectionCable',
    ],
    QUESTIONS: [
      'modemIsSynchronized',
      'modemStillSynchronized',
      'severalInternetConnections',
      'hasModemKeptSynchronization',
    ],
    SPECIFIC_QUESTIONS: [
      'problemType',
      'downloadBandwidthTest',
      'uploadBandwidthTest',
      'bandwidthTestUnit',
    ],
  },
  SOLUTION_PROPOSAL: {
    LABEL: 'solutionProposalStep',
    APPOINTMENT_QUESTIONS_FORM: [
      'idAppointment',
      'individualSite',
      'secureSite',
      'siteClosedDays',
      'siteOpening',
    ],
    TIME_PERIOD_QUESTIONS: [
      'startMorningHours',
      'endMorningHours',
      'startAfternoonHours',
      'endAfternoonHours',
    ],
  },
};

export const ROBOT_ACTION = {
  LONG_TIME_ACTIONS: [
    'seltTest',
    'installationCheck',
  ],
  REQUEST_MONITORING: 'requestMonitoring',
};

export const FAULT_TYPES = {
  UNKNOWN: 'unknown',
  NO_SYNCHRONIZATION: 'noSync',
  ALIGNMENT: 'alignment',
  SYNC_LOSS_OR_LOW_BANDWIDTH: 'syncLossOrLowBandwidth',
};

export const ERRORS = {
  MONITORING_EXISTS: 'monitoringTodoAlreadyExists',
};

export const STATUS = {
  END: [
    'cancelled',
    'connectionProblem',
    'haveToConnectModemOnTheRightPlug',
    'interventionRequested',
    'resolvedAfterTests',
    'validationRefused',
    'waitingValidation',
    'noBandwidthFault',
  ],
  PAUSE: [
    'init',
    'sleeping',
    'waitingHuman',
  ],
  PROBLEM: 'problem',
  SPECIAL: [],
  WAITING_ROBOT: 'waitingRobot',
};

export const BANDWIDTH_TEST_SITE = 'http://proof.ovh.net';

export const QUESTIONS_ENUM = {
  BANDWIDTH_TEST_UNIT: [
    'Kbps',
    'Mbps',
  ],
  PROBLEM_TYPE: {
    LOW_BANDWIDTH: 'lowBandwidth',
    SYNC_LOSS: 'syncLoss',
  },
};

export default {
  ASSETS,
  PROGRESS_BAR,
  STEPS,
  ROBOT_ACTION,
  FAULT_TYPES,
  ERRORS,
  STATUS,
  BANDWIDTH_TEST_SITE,
  QUESTIONS_ENUM,
};
