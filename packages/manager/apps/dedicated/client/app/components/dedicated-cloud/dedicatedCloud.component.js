import controller from './dedicatedCloud.controller';
import template from './dedicatedCloud.html';

export default {
  bindings: {
    datacentersState: '<',
    dedicatedCloud: '<',
    editDetails: '<',
    licenseState: '<',
    logsState: '<',
    operationState: '<',
    pccDashboardState: '<',
    productId: '<',
    securityState: '<',
    setMessage: '<',
    usersState: '<',
  },
  controller,
  template,
};
