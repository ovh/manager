import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import head from 'lodash/head';
import isEqual from 'lodash/isEqual';
import last from 'lodash/last';
import now from 'lodash/now';
import random from 'lodash/random';

import { TELEPHONY_LINE_PHONE_ADDITIONAL_INFOS } from '../../phone/phone.constant';

export default /* @ngInject */ function TelecomTelephonyLineAssistTroubleshootingCtrl(
  $anchorScroll,
  $timeout,
  $stateParams,
  troubleshootingProcess,
  TelephonyMediator,
) {
  const self = this;

  const commonSteps = {
    procedureStep: {
      name: 'procedure',
      view: 'procedureStepView',
    },
    contactStep: {
      name: 'contact',
      templateUrl:
        'app/telecom/telephony/line/assist/troubleshooting/contact/contact.html',
    },
    autoConfigStep: {
      name: 'autoConfig',
      isFinalized: false,
      view: 'autoConfigStepView',
    },
  };

  self.loading = {
    init: false,
  };

  self.process = troubleshootingProcess;
  self.imgScr = null;
  self.steps = [];

  /*= ==============================
    =            HELPERS            =
    =============================== */

  function foundPhoneType() {
    if (/^phone\.thomson/.test(self.process.line.phone.brand)) {
      return 'thomson';
    }
    if (
      /^phone\.(siemens)/.test(self.process.line.phone.brand) ||
      self.process.line.phone.brand === 'phone.gigaset.c530ip'
    ) {
      return 'siemens';
    }
    if (/^phone\.(gigaset)/.test(self.process.line.phone.brand)) {
      return 'gigaset';
    }
    if (
      /^phone\.(linksys\.pap)/.test(self.process.line.phone.brand) ||
      self.process.line.phone.brand === 'phone.cisco.spa112'
    ) {
      return 'linksys';
    }
    if (/^phone\.(cisco\.spa)/.test(self.process.line.phone.brand)) {
      return 'cisco';
    }
    if (/^phone\.lg/.test(self.process.line.phone.brand)) {
      return 'lg';
    }
    if (/^phone\.polycom/.test(self.process.line.phone.brand)) {
      return 'polycom';
    }
    if (/^phone\.yealink/.test(self.process.line.phone.brand)) {
      return 'yealink';
    }
    if (/^phone\.(unidata|incom)/.test(self.process.line.phone.brand)) {
      return 'unidata';
    }
    if (/^phone\.joher/.test(self.process.line.phone.brand)) {
      return 'popc';
    }
    return 'unkown';
  }

  self.isCurrentStepLastStep = function isCurrentStepLastStep() {
    return isEqual(self.process.activeStep.id, last(self.steps).id);
  };

  self.addStep = function addStep(stepOptions) {
    const step = angular.extend(
      {
        active: false,
        display: false,
        isFinalized: true,
        id: random(now()),
      },
      stepOptions,
    );

    self.steps.push(step);

    return step;
  };

  /* -----  End of HELPERS  ------*/

  /*= ==============================
    =            ACTIONS            =
    =============================== */

  self.refreshSteps = function refreshSteps(steps) {
    // reset steps
    self.steps = [];

    const problem = find(self.problemsList, {
      name: self.process.problem,
    });

    // is there is no custom step to add, add common steps (procedure and contact support)
    const stepsToAdd = steps ||
      problem.customSteps || [
        commonSteps.procedureStep,
        commonSteps.contactStep,
      ];

    angular.forEach(stepsToAdd, (stepToAddOptionsParam, index) => {
      let stepToAddOptions = stepToAddOptionsParam;
      if (index === 0) {
        stepToAddOptions = angular.extend(
          {
            active: true,
            display: true,
          },
          stepToAddOptions,
        );
      }
      self.addStep(stepToAddOptions);
    });

    self.process.activeStep = head(self.steps);
  };

  self.manageItWorks = function manageItWorks() {
    const activeStepIndex = findIndex(self.steps, {
      active: true,
    });

    if (activeStepIndex === -1) {
      return;
    }

    // desactivate active step
    self.process.activeStep.active = false;

    // remove all steps from index...
    self.steps.splice(activeStepIndex + 1);

    // and insert success step
    self.process.activeStep = self.addStep({
      name: 'success',
      active: true,
      display: true,
      templateUrl:
        'app/telecom/telephony/line/assist/troubleshooting/success/success.html',
    });
  };

  self.manageItStillDoesnttWork = function manageItStillDoesnttWork() {
    const activeStepIndex = findIndex(self.steps, {
      active: true,
    });

    if (activeStepIndex === -1) {
      return;
    }

    // if it's not the final step, go to next step
    if (!self.isCurrentStepLastStep()) {
      // desactivate current step
      self.process.activeStep.active = false;

      // go to next step
      self.process.activeStep = self.steps[activeStepIndex + 1];
      self.process.activeStep.active = true;
      self.process.activeStep.display = true;
    }
  };

  /* -----  End of ACTIONS  ------*/

  /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

  /* ----------  PROBLEM INIT  ----------*/

  function getCiscoProblems() {
    return [
      {
        name: 'mute',
      },
      {
        name: 'network',
      },
      {
        name: 'led_orange',
        customSteps: [
          commonSteps.procedureStep,
          commonSteps.autoConfigStep,
          {
            name: 'manualConfig',
            isFinalized: false,
            view: 'manualConfigStepView',
          },
          commonSteps.contactStep,
        ],
      },
      {
        name: 'callin',
      },
      {
        name: 'softReinit',
        customSteps: [
          commonSteps.autoConfigStep,
          {
            name: 'manualConfig',
            isFinalized: false,
            view: 'manualConfigStepView',
          },
          commonSteps.contactStep,
        ],
      },
    ];
  }

  function getSiemensProblems() {
    if (self.process.line.phone.brand !== 'phone.gigaset.c530ip') {
      return [
        {
          name: 'callout',
        },
        {
          name: 'callin',
        },
        {
          name: 'blueButton',
        },
        {
          name: 'nobase',
        },
        {
          name: 'register',
          customSteps: [
            commonSteps.procedureStep,
            commonSteps.autoConfigStep,
            commonSteps.contactStep,
          ],
        },
        {
          name: 'phoneBookGigaset',
        },
        {
          name: 'softReinit',
          customSteps: [commonSteps.autoConfigStep, commonSteps.contactStep],
        },
      ];
    }
    return [
      {
        name: 'callout',
      },
      {
        name: 'callin',
      },
      {
        name: 'blueButton',
      },
      {
        name: 'nobase',
      },
      {
        name: 'register',
        customSteps: [
          commonSteps.procedureStep,
          commonSteps.autoConfigStep,
          {
            name: 'manualConfig',

            // isFinalized: false,
            view: 'manualConfigStepView',
          },
          commonSteps.contactStep,
        ],
      },
      {
        name: 'phoneBookGigaset',
      },
      {
        name: 'softReinit',
        customSteps: [
          commonSteps.autoConfigStep,
          {
            name: 'manualConfig',

            // isFinalized: false,
            view: 'manualConfigStepView',
          },
          commonSteps.contactStep,
        ],
      },
    ];
  }

  function getLinksysProblems() {
    return [
      {
        name: 'nopower',
      },
      {
        name: 'line1off',
      },
      {
        name: 'line1onbutnocall',
      },
      {
        name: 'redlight',
      },
      {
        name: 'christmastree',
      },
      {
        name: 'softReinit',
        customSteps: [
          commonSteps.autoConfigStep,
          {
            name: 'manualConfig',
            isFinalized: false,
            view: 'manualConfigStepView',
          },
          commonSteps.contactStep,
        ],
      },
    ];
  }

  function getPolycomProblems() {
    return [
      {
        name: 'power',
      },
      {
        name: 'softReinit',
        customSteps: [commonSteps.autoConfigStep, commonSteps.contactStep],
      },
    ];
  }

  function getGigasetProblems() {
    return [
      {
        name: 'upgrade',
      },
      {
        name: 'callin',
      },
      {
        name: 'softReinit',
        customSteps: [
          commonSteps.autoConfigStep,
          {
            name: 'manualConfig',
            view: 'manualConfigStepView',
          },
          commonSteps.contactStep,
        ],
      },
    ];
  }

  function getLGProblems() {
    return [
      {
        name: 'nonetwork',
      },
      {
        name: 'connection',
      },
      {
        name: 'forbidden',
      },
      {
        name: 'softReinit',
        customSteps: [
          commonSteps.autoConfigStep,
          {
            name: 'manualConfig',
            isFinalized: false,
            view: 'manualConfigStepView',
          },
          commonSteps.contactStep,
        ],
      },
    ];
  }

  function getThomsonProblems() {
    return [
      {
        name: 'noip',
      },
      {
        name: 'local',
      },
      {
        name: 'softReinit',
        customSteps: [
          commonSteps.autoConfigStep,
          {
            name: 'manualConfig',
            isFinalized: false,
            view: 'manualConfigStepView',
          },
          commonSteps.contactStep,
        ],
      },
    ];
  }

  function getPhoneTypeProblems() {
    const steps = [commonSteps.autoConfigStep, commonSteps.contactStep];

    switch (self.process.phoneType) {
      case 'cisco':
        return getCiscoProblems();
      case 'siemens':
        return getSiemensProblems();
      case 'linksys':
        return getLinksysProblems();
      case 'polycom':
        return getPolycomProblems();
      case 'gigaset':
        return getGigasetProblems();
      case 'lg':
        return getLGProblems();
      case 'thomson':
        return getThomsonProblems();
      default:
        self.process.problem = 'softReinit';
        self.refreshSteps(steps);
        return [
          {
            name: 'softReinit',
            customSteps: steps,
          },
        ];
    }
  }

  /* ----------  INIT  ----------*/

  function init() {
    self.loading.init = true;

    return TelephonyMediator.getGroup($stateParams.billingAccount)
      .then((group) => {
        self.process.line = group.getLine($stateParams.serviceName);
        return self.process.line.getPhone();
      })
      .then(() => {
        // set phone type
        self.process.phoneType = foundPhoneType();

        // set phone image src
        self.imgScr = TELEPHONY_LINE_PHONE_ADDITIONAL_INFOS[
          self.process.line.phone.brand
        ]
          ? TELEPHONY_LINE_PHONE_ADDITIONAL_INFOS[self.process.line.phone.brand]
              .img
          : null;

        // set problem list
        self.problemsList = getPhoneTypeProblems();
      })
      .finally(() => {
        self.loading.init = false;
      });
  }

  /* -----  End of INITIALIZATION  ------*/

  init();
}
