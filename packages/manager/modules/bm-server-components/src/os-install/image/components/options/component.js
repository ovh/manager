import controller from './controller';
import template from './index.html';

export default {
  name: 'serverOsInstallImageOptions',
  bindings: {
    loaders: '<',
    model: '<',
    server: '<',
  },
  controller,
  template,
};
