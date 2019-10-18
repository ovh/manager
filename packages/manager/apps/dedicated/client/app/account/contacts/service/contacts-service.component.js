import controller from './user-contacts-service.controller';
import template from './user-contacts-service.html';

export default {
  bindings: {
    editContacts: '<',
    getServiceInfos: '<',
    services: '<',
  },
  controller,
  template,
};
