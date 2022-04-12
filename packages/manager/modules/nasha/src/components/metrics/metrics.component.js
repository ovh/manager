import template from './metrics.template.html';

export default {
  bindings: {
    monitoredDisabled: '<',
    nasha: '<',
    onMonitoredChanged: '&',
    serviceInfo: '<',
    urlRenew: '@',
  },
  template,
};
