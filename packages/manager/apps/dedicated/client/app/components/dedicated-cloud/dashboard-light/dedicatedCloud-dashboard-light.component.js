import template from './dedicatedCloud-dashboard-light.html';

export default {
  bindings: {
    currentService: '<',
    editDetails: '<',
    onUpgradeVersion: '<',
    associateIpBlockLink: '<',
    onExecutionDateChange: '<',
    trackingPrefix: '<',
  },
  template,
};
