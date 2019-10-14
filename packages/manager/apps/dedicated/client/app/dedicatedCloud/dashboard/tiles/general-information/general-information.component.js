import controller from './general-information.controller';
import template from './general-information.html';

export default {
  bindings: {
    currentService: '<',
  },
  controller,
  name: 'ovhManagerPccDashboardGeneralInformation',
  template,
};
