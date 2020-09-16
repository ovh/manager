import template from './sms-tips.html';

export default {
  bindings: {
    goToComposeTip: '<',
    goToSizeTip: '<',
    receiversUrl: '<',
  },
  name: 'ovhManagerSmsSmsTips',
  template,
};
