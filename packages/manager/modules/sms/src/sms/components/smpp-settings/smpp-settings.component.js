import template from './smpp-settings.html';

export default {
  bindings: {
    serviceName: '<',
    smppSettings: '<',
    loading: '<',
  },
  name: 'ovhManagerSmsSmppSettings',
  template,
};
