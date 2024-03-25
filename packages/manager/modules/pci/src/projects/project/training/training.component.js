import controller from './training.controller';
import template from './training.html';

export default {
  controller,
  template,
  bindings: {
    pciFeatureRedirect: '<',
    trainingFeatures: '<',
  },
};
