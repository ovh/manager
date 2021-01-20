import controller from './controller';
import template from './template.html';

const component = {
  bindings: {
    restrictions: '<',
    updateRestrictions: '<',
    deleteRestriction: '<',
  },
  controller,
  template,
};

export default component;
