import controller from './controller';
import template from './template.html';

export default {
  name: 'serverInstallImageConfigDrive',
  bindings: {
    loaders: '<',
    model: '<',
    trackingPrefix: '<',
    server: '<',
  },
  controller,
  template,
};
