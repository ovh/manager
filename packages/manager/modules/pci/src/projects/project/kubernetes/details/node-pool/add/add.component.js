import controller from './add.controller';
import template from './add.html';

const component = {
  bindings: {
    antiAffinityMaxNodes: '<',
    region: '<',
    goBack: '<',
    kubeId: '<',
    projectId: '<',
    cancelLink: '<',
  },
  controller,
  template,
};

export default component;
