import controller from './controller';
import template from './template.html';

const component = {
  bindings: {
    onContactUsLinkClick: '&',
  },
  controller,
  template,
};

export default component;
