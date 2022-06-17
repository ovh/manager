import controller from './add.controller';
import template from './add.html';

export default {
  bindings: {
    goBack: '<',
    messageContainer: '<',
    onAssociationSuccess: '<',
    onCreationSuccess: '<',
    projectId: '<',
  },
  controller,
  template,
};
