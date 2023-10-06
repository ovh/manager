import controller from './controller';
import template from './template.html';

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
