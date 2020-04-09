import controller from './dedicatedCloud-datacenter-drp-ovh-secondPccStep.controller';
import template from './dedicatedCloud-datacenter-drp-ovh-secondPccStep.html';

export default {
  bindings: {
    availablePccs: '<',
    configurationStepName: '<',
    currentUser: '<',
    drpInformations: '=',
    getHostsOrderLink: '<',
    getUrlToOrderIp: '<',
    setDisableSuccessAlertPreference: '<',
    setupConfiguration: '<',

    displayErrorMessage: '<',
    goToPreviousStep: '<',
  },
  controller,
  name: 'dedicatedCloudDatacenterDrpOvhSecondPccStep',
  template,
};
