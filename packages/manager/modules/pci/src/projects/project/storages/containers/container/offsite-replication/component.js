import template from './template.html';
import controller from './controller';

const component = {
  bindings: {
    isOffsiteReplicationEnabled: '<',
    onOffsiteReplicationChange: '&',
  },
  template,
  controller,
};

export default component;
