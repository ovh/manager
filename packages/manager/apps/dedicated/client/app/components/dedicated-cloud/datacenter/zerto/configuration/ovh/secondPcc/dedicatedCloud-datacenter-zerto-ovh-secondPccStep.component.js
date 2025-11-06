import controller from './dedicatedCloud-datacenter-zerto-ovh-secondPccStep.controller';
import template from './dedicatedCloud-datacenter-zerto-ovh-secondPccStep.html';

export default {
  bindings: {
    availablePccs: '<',
    currentUser: '<',
    zertoInformations: '=',
    getHostsOrderLink: '<',
    setDisableSuccessAlertPreference: '<',
    setupConfiguration: '<',

    displayErrorMessage: '<',
    goToPreviousStep: '<',
    pccType: '<',
  },
  controller,
  name: 'dedicatedCloudDatacenterZertoOvhSecondPccStep',
  template,
};
