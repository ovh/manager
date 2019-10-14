import controller from './choose-database.controller';
import template from './choose-database.html';

export default {
  bindings: {
    allowEdit: '<',
    enterpriseDb: '<',
    databases: '<',
    onChange: '&',
  },
  controller,
  template,
};
