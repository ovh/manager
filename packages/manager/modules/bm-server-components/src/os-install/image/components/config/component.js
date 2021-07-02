import controller from './controller';
import template from './index.html';

export default {
  name: 'serverOsInstallImageConfig',
  bindings: {
    checksumTypeEnum: '<',
    imageTypeEnum: '<',
    loaders: '<',
    model: '<',
  },
  controller,
  template,
};
