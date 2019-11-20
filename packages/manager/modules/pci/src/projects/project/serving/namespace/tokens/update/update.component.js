import controller from './update.controller';
import template from './update.html';

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
