import controller from './pack-xdsl.controller';
import template from './pack-xdsl.html';

export default {
  controller,
  template,
  bindings: {
    currentActiveLink: '<',
    lineLink: '<',
    modemLink: '<',
    taskLink: '<',
    packName: '<',
    serviceName: '<',
    goBack: '<',
  },
};
