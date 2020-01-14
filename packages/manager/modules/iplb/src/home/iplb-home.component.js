import controller from './iplb-home.controller';
import template from './iplb-home.html';

export default {
  bindings: {
    goToCipherChange: '<',
    goToFailoverIp: '<',
    goBack: '<',
    goToNatIpDetail: '<',
    goToUpdateQuota: '<',
    serviceName: '<',
  },
  controller,
  template,
};
