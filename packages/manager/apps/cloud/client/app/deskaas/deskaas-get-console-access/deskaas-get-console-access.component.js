import controller from './deskaas-get-console-access.controller';
import template from './deskaas-get-console-access.html';

const component = {
  bindings: {
    goBackToDetails: '<',
    serviceName: '<',
  },
  controller,
  controllerAs: 'DeskaasGetConsoleAccessCtrl',
  template,
};

export default component;
