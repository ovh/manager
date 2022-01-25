import controller from './information.controller';
import template from './information.html';

export default {
  bindings: {
    pool: '<',
    database: '<',
    goBack: '<',
  },
  controller,
  template,
};
