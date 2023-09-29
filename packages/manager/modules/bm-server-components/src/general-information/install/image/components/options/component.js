import controller from './controller';
import template from './index.html';

export default {
  name: 'serverInstallImageOptions',
  bindings: {
    loaders: '<',
    model: '<',
    server: '<',
  },
  controller,
  template,
};
