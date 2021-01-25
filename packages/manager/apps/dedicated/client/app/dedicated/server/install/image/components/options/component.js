import controller from './controller';
import template from './index.html';

export default {
  name: 'dedicatedServerInstallImageOptions',
  bindings: {
    loaders: '<',
    model: '<',
    server: '<',
  },
  controller,
  template,
};
