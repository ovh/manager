import template from './index.html';

export default {
  name: 'pciProjectNewProgress',
  template,
  bindings: {
    steps: '<',
    onProgressStepClick: '<',
  },
};
