import controller from './attach-volume.controller';
import template from './attach-volume.html';

export default {
  controller,
  template,
  bindings: {
    projectId: '<',
    instance: '<',
    volumes: '<',
    goBack: '<',
  },
};
