import controller from './controller';
import template from './template.html';

const component = {
  bindings: {
    goBack: '<',
    goToNutanixGeneralInfo: '<',
    redeployMethod: '<',
    redeployConfig: '<',
    serviceName: '<',
  },
  template,
  controller,
};

export default component;
