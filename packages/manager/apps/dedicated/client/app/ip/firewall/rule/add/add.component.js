import controller from './add.controller';
import template from './add.html';

export default {
  bindings: {
    goBack: '<',
    ip: '<',
    ipBlock: '<',
  },
  controller,
  template,
};
