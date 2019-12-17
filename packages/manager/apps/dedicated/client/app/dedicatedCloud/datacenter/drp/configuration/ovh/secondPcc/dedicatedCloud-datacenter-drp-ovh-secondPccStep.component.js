import controller from './dedicatedCloud-datacenter-drp-ovh-secondPccStep.controller';
import template from './dedicatedCloud-datacenter-drp-ovh-secondPccStep.html';

export default {
  bindings: {
    availablePccs: '<',
    currentUser: '<',
    drpInformations: '=',
    setDisableSuccessAlertPreference: '<',
    storeZertoOptionOrderInUserPref: '<',

    displayErrorMessage: '<',
    displayInfoMessage: '<',
    displaySuccessMessage: '<',
    goToPccDashboard: '<',
    goToPreviousStep: '<',
  },
  controller,
  name: 'dedicatedCloudDatacenterDrpOvhSecondPccStep',
  template,
};
