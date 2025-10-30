import controller from './dedicatedCloud-datacenter-zerto-onPremise-onPremisePccStep.controller';
import template from './dedicatedCloud-datacenter-zerto-onPremise-onPremisePccStep.html';

export default {
  bindings: {
    zertoInformations: '=',
    setDisableSuccessAlertPreference: '<',
    setupConfiguration: '<',
    storeZertoOptionOrderInUserPref: '<',

    displayErrorMessage: '<',
    displayInfoMessage: '<',
    displaySuccessMessage: '<',
    goToPccDashboard: '<',
    goToPreviousStep: '<',
  },
  controller,
  name: 'dedicatedCloudDatacenterZertoOnPremiseOnPremisePccStep',
  template,
};
