import controller from './dedicatedCloud-datacenter-drp-ovh-secondPccStep.controller';
import template from './dedicatedCloud-datacenter-drp-ovh-secondPccStep.html';

export default {
  bindings: {
    availablePccs: '<',
    configurationStepName: '<',
    currentUser: '<',
    drpInformations: '=',
    getIpOrderLink: '<',
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
