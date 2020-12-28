import controller from './general-information.controller';
import template from './general-information.html';

export default {
  bindings: {
    currentService: '<',
    editDetails: '<',
    onUpgradeVersion: '<',
    onAssociateIpBlock: '<',
    onExecutionDateChange: '<',
    trackingPrefix: '<',
  },
  controller,
  name: 'ovhManagerPccDashboardGeneralInformation',
  template,
};
