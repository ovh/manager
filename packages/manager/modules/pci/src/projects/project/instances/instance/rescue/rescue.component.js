import controller from './rescue.controller';
import template from './rescue.html';

export default {
  controller,
  template,
  bindings: {
    projectId: '<',
    instance: '<',
    images: '<',
    goBack: '<',
  },
};
