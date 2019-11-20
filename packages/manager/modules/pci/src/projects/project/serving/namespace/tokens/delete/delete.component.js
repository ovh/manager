import controller from './delete.controller';
import template from './delete.html';

const component = {
  bindings: {
    goBack: '<',
    namespaceId: '<',
    tokenId: '<',
    projectId: '<',
  },
  template,
  controller,
};

export default component;
