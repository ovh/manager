import controller from './choose-cluster-config.controller';
import template from './choose-cluster-config.html';

export default {
  bindings: {
    allowEdit: '<',
    clusters: '<',
    enterpriseDb: '<',
    onChange: '&',
  },
  controller,
  template,
};
