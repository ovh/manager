import controller from './generalInformation.controller';
import template from './generalInformation.html';

export default {
  bindings: {
    currentService: '<',
  },
  controller,
  name: 'ovhManagerPccDashboardGeneralInformation',
  template,
};
