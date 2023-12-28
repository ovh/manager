import template from './template.html';

export default {
  bindings: {
    user: '<',
    credential: '<',
    fields: '<',
    fieldSecretKeyLabel: '@',
    containerName: '<',
    role: '<',
    onCopyFieldClick: '&',
  },
  template,
};
