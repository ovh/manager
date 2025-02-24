import controller from './identities.controller';
import template from './identities.template.html';

export default {
  controller,
  template,
  bindings: {
    identitiesGuides: '<',
    trackClick: '<',
  },
};
