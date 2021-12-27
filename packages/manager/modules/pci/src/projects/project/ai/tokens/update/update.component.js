import controller from './update.controller';
import template from './update.html';

export default {
  bindings: {
    goBack: '<',
    tokenId: '<',
    projectId: '<',
  },
  template,
  controller,
};
