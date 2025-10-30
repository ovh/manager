import controller from './billing-confirmTerminate.controller';
import template from './billing-confirmTerminate.html';

export default {
  bindings: {
    questions: '<',
    service: '<',
    serviceId: '<',
    user: '<',
    confirmTermination: '<',
    goBack: '<',
    shouldHideQuestions: '<',
  },
  controller,
  template,
};
