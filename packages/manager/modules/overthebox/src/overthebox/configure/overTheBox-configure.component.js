import controller from './overTheBox-configure.controller';
import template from './overTheBox-configure.html';

export default {
  controller,
  template,
  bindings: {
    orderHash: '<',
    goOrderOverTheBox: '<',
  },
};
