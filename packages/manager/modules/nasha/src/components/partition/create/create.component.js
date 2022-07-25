import controller from './create.controller';
import template from './create.template.html';

export default {
  bindings: {
    close: '<',
    nasha: '<',
    nashaApiUrl: '<',
    partitionNames: '<',
    protocolEnum: '<',
  },
  controller,
  template,
};
