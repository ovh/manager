import template from './template.html';
import controller from './controller';

export default {
  bindings: {
    pool: '<',
    listener: '<',
    goToPoolEdition: '<',
    goToEditName: '<',
    goToDelete: '<',
  },
  template,
  controller,
};
