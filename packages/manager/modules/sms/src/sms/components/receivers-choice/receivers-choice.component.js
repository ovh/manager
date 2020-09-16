import controller from './receivers-choice.controller';
import template from './receivers-choice.html';

export default {
  bindings: {
    goBack: '<',
    model: '=',
    receivers: '<',
  },
  controller,
  name: 'ovhManagerSmsReceiversChoice',
  template,
};
