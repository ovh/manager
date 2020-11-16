import controller from './anti-affinity.controller';
import template from './anti-affinity.html';

export default {
  bindings: {
    nodePool: '<',
    antiAffinityMaxNodes: '<',
  },
  controller,
  template,
};
