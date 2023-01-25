import template from './template.html';

const component = {
  bindings: {
    cancelLabel: '<',
    goBack: '<',
    message: '<',
    submitAction: '<',
    submitLabel: '<',
    submitLink: '<',
  },
  template,
};

export default component;
