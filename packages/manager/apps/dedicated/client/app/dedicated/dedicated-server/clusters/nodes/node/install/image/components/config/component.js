import controller from './controller';
import template from './index.html';

export default {
  name: 'dedicatedServerInstallImageConfig',
  bindings: {
    checksumTypeEnum: '<',
    imageTypeEnum: '<',
    loaders: '<',
    model: '<',
  },
  controller,
  template,
};
