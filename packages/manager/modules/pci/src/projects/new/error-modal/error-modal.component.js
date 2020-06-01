import template from './error-modal.html';

const component = {
  bindings: {
    goBack: '<',
    message: '<',
    submitAction: '<',
    submitLabel: '<',
    submitLink: '<',
  },
  template,
};

export default component;
