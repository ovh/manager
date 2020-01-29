import template from './template.html';
import controller from './controller';

export default {
  bindings: {
    cancelLink: '<',
    onError: '&',
    onSuccess: '&',
    plans: '<',
    projectId: '<',
    registryId: '<',
    user: '<',
    onChange: '&',
  },
  controller,
  template,
};
