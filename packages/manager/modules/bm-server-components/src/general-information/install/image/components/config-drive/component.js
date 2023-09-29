import controller from './controller';
import template from './index.html';

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
