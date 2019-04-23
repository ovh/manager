import controller from './controller';
import template from './template.html';

export const component = {
  bindings: {
    projectId: '@',
  },
  controller,
  template,
};

export default component;
