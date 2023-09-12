import controller from './monitoring.controller';
import template from './monitoring.html';

export default {
  bindings: {
    goBack: '<',
    ips: '<',
    languageEnum: '<',
    monitoringIntervalEnum: '<',
    monitoringProtocolEnum: '<',
    server: '<',
    sms: '<',
  },
  controller,
  template,
  require: {
    dedicatedServer: '^dedicatedServer',
  },
};
