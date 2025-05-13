import template from './hds.html';
import controller from './hds.controller';

const component = {
  bindings: {
    cart: '<',
    hds: '<',
    projectName: '<',
    summary: '<',
  },
  controller,
  template,
};

export default component;
