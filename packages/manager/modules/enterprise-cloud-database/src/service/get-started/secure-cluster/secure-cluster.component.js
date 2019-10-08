import controller from './secure-cluster.controller';
import template from './secure-cluster.html';

export default {
  template,
  controller,
  bindings: {
    clusterName: '<',
    disabled: '<',
    onDataChange: '&',
  },
};
