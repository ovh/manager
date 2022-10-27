import controller from './controller';
import template from './template.html';

const component = {
  bindings: {
    projects: '<',
    trackClick: '<',
  },
  controller,
  template,
};

export default component;
