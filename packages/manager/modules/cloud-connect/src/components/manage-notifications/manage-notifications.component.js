import controller from './manage-notifications.controller';
import template from './manage-notifications.html';

export default {
  bindings: {
    goBack: '<',
    uuid: '<',
    description: '<',
  },
  controller,
  template,
};
