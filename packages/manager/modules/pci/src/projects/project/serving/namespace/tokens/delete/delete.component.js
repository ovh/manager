import controller from './delete.controller';
import template from './delete.html';

export default {
  bindings: {
    goBack: '<',
    namespaceId: '<',
    tokenId: '<',
    projectId: '<',
  },
  template,
  controller,
};
