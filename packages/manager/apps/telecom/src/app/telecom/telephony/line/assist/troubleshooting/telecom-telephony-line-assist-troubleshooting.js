import telecomTelephonyLineAssistTroubleshootingProcedureCisco from './procedure/cisco/telecom-telephony-line-assist-troubleshooting-procedure-cisco.html';
import telecomTelephonyLineAssistTroubleshootingProcedureGigaset from './procedure/gigaset/telecom-telephony-line-assist-troubleshooting-procedure-gigaset.html';
import telecomTelephonyLineAssistTroubleshootingProcedureLg from './procedure/lg/telecom-telephony-line-assist-troubleshooting-procedure-lg.html';
import telecomTelephonyLineAssistTroubleshootingProcedureLinksys from './procedure/linksys/telecom-telephony-line-assist-troubleshooting-procedure-linksys.html';
import telecomTelephonyLineAssistTroubleshootingProcedurePolycom from './procedure/polycom/telecom-telephony-line-assist-troubleshooting-procedure-polycom.html';
import telecomTelephonyLineAssistTroubleshootingProcedureSiemens from './procedure/siemens/telecom-telephony-line-assist-troubleshooting-procedure-siemens.html';
import telecomTelephonyLineAssistTroubleshootingProcedureThomson from './procedure/thomson/telecom-telephony-line-assist-troubleshooting-procedure-thomson.html';

angular.module('managerApp').run(($templateCache) => {
  // import templates required by ng-include
  $templateCache.put(
    'app/telecom/telephony/line/assist/troubleshooting/procedure/cisco/telecom-telephony-line-assist-troubleshooting-procedure-cisco.html',
    telecomTelephonyLineAssistTroubleshootingProcedureCisco,
  );
  $templateCache.put(
    'app/telecom/telephony/line/assist/troubleshooting/procedure/gigaset/telecom-telephony-line-assist-troubleshooting-procedure-gigaset.html',
    telecomTelephonyLineAssistTroubleshootingProcedureGigaset,
  );
  $templateCache.put(
    'app/telecom/telephony/line/assist/troubleshooting/procedure/lg/telecom-telephony-line-assist-troubleshooting-procedure-lg.html',
    telecomTelephonyLineAssistTroubleshootingProcedureLg,
  );
  $templateCache.put(
    'app/telecom/telephony/line/assist/troubleshooting/procedure/linksys/telecom-telephony-line-assist-troubleshooting-procedure-linksys.html',
    telecomTelephonyLineAssistTroubleshootingProcedureLinksys,
  );
  $templateCache.put(
    'app/telecom/telephony/line/assist/troubleshooting/procedure/polycom/telecom-telephony-line-assist-troubleshooting-procedure-polycom.html',
    telecomTelephonyLineAssistTroubleshootingProcedurePolycom,
  );
  $templateCache.put(
    'app/telecom/telephony/line/assist/troubleshooting/procedure/siemens/telecom-telephony-line-assist-troubleshooting-procedure-siemens.html',
    telecomTelephonyLineAssistTroubleshootingProcedureSiemens,
  );
  $templateCache.put(
    'app/telecom/telephony/line/assist/troubleshooting/procedure/thomson/telecom-telephony-line-assist-troubleshooting-procedure-thomson.html',
    telecomTelephonyLineAssistTroubleshootingProcedureThomson,
  );
});
angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.dashboard.assist.troubleshooting',
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
        'lineView@telecom.telephony.billingAccount.line.dashboard': {
          templateUrl:
            'app/telecom/telephony/line/assist/troubleshooting/telecom-telephony-line-assist-troubleshooting.html',
          controller: 'TelecomTelephonyLineAssistTroubleshootingCtrl',
          controllerAs: 'TroubleshootingCtrl',
        },
        'procedureStepView@telecom.telephony.billingAccount.line.dashboard.assist.troubleshooting': {
          templateUrl:
            'app/telecom/telephony/line/assist/troubleshooting/procedure/telecom-telephony-line-assist-troubleshooting-procedure.html',
          controller: 'TelecomTelephonyLineAssistTroubleshootingProcedureCtrl',
          controllerAs: 'ProcedureCtrl',
        },
        'autoConfigStepView@telecom.telephony.billingAccount.line.dashboard.assist.troubleshooting': {
          templateUrl:
            'app/telecom/telephony/line/assist/troubleshooting/autoConfig/telecom-telephony-line-assist-troubleshooting-auto-config.html',
          controller: 'TelecomTelephonyLineAssistTroubleshootingAutoConfigCtrl',
          controllerAs: 'AutoConfigCtrl',
        },
        'manualConfigStepView@telecom.telephony.billingAccount.line.dashboard.assist.troubleshooting': {
          templateUrl:
            'app/telecom/telephony/line/assist/troubleshooting/manualConfig/telecom-telephony-line-assist-troubleshooting-manual-config.html',
          controller:
            'TelecomTelephonyLineAssistTroubleshootingManualConfigCtrl',
          controllerAs: 'ManualConfigCtrl',
        },
      },
      translations: {
        value: ['.', './autoConfig', './manualConfig'],
        format: 'json',
      },
    },
  );
});
