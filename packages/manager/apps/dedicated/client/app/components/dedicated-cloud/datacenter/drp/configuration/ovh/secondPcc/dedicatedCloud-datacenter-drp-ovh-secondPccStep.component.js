import controller from './dedicatedCloud-datacenter-drp-ovh-secondPccStep.controller';
import template from './dedicatedCloud-datacenter-drp-ovh-secondPccStep.html';

export default {
  bindings: {
    availablePccs: '<',
    currentUser: '<',
    drpInformations: '=',
    getHostsOrderLink: '<',
    setDisableSuccessAlertPreference: '<',
    setupConfiguration: '<',

    displayErrorMessage: '<',
    goToPreviousStep: '<',
    pccType: '<',
  },
  controller,
  name: 'dedicatedCloudDatacenterDrpOvhSecondPccStep',
  template,
};
