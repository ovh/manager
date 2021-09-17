import controller from './controller';
import template from './template.html';

const component = {
  bindings: {
    availableLangs: '<',
    currentLang: '<',
  },
  controller,
  template,
};

export default component;
