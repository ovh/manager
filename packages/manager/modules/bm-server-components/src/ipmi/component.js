import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    user: '<',
    server: '<',
    onEditName: '&?',
    onEditNetboot: '&?',
    onOsInstall: '&?',
    onIpmiRestart: '&?',
    onKvmOrder: '&?',
  },
  controller,
  template,
  transclude: true,
};
