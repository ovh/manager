import template from './troubleshooting.html';
import controller from './troubleshooting.controller';

import autoConfigTemplate from './autoConfig/auto-config.html';
import autoConfigController from './autoConfig/auto-config.controller';

import manualConfigTemplate from './manualConfig/manual-config.html';
import manualConfigController from './manualConfig/manual-config.controller';

import procedureTemplate from './procedure/procedure.html';
import procedureController from './procedure/procedure.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.assist.troubleshooting',
    {
      url: '/troubleshooting',
      resolve: {
        // this is the object that will be used by each view to display the different steps
        troubleshootingProcess() {
          return {
            phoneType: null,
            problem: null,
            line: null,
            activeStep: null,
          };
        },
      },
      views: {
        'lineView@telecom.telephony.billingAccount.line': {
          template,
          controller,
          controllerAs: 'TroubleshootingCtrl',
        },
        'procedureStepView@telecom.telephony.billingAccount.line.assist.troubleshooting': {
          template: procedureTemplate,
          controller: procedureController,
          controllerAs: 'ProcedureCtrl',
        },
        'autoConfigStepView@telecom.telephony.billingAccount.line.assist.troubleshooting': {
          template: autoConfigTemplate,
          controller: autoConfigController,
          controllerAs: 'AutoConfigCtrl',
        },
        'manualConfigStepView@telecom.telephony.billingAccount.line.assist.troubleshooting': {
          template: manualConfigTemplate,
          controller: manualConfigController,
          controllerAs: 'ManualConfigCtrl',
        },
      },
    },
  );
};
