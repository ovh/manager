import controller from './dedicatedCloud-datacenter.controller';
import template from './dedicatedCloud-datacenter.html';

export default {
  bindings: {
    datacenter: '<',
    editDetails: '<',
    backupState: '<',
    dashboardState: '<',
    datastoresState: '<',
    drpAvailability: '<',
    drpState: '<',
    hostsState: '<',
    surveyUrl: '<',
  },
  controller,
  template,
};
