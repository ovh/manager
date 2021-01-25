import controller from './controller';
import template from './index.html';

export default {
  name: 'dedicatedServerInstallImageConfigDrive',
  bindings: {
    loaders: '<',
    model: '<',
    server: '<',
  },
  controller,
  template,
};
