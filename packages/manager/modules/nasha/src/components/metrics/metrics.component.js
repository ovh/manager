import template from './metrics.template.html';

export default {
  bindings: {
    monitoredDisabled: '<',
    nasha: '<',
    onMonitoredChanged: '&',
    onRenewClick: '&',
    serviceInfo: '<',
    urlRenew: '@',
  },
  template,
};
