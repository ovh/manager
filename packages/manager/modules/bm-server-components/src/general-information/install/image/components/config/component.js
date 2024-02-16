import controller from './controller';
import template from './template.html';

export default {
  name: 'serverInstallImageConfig',
  bindings: {
    checksumTypeEnum: '<',
    imageTypeEnum: '<',
    loaders: '<',
    model: '<',
  },
  controller,
  template,
};
