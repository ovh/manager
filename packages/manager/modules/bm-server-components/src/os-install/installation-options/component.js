import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    serviceName: '<',
    informations: '<',
    installation: '<',
    configError: '<',
    onError: '&?',
    isOvhInstall: '<',
  },
  controller,
  template,
};
