import template from './validation-modal.html';

const validationModalComponent = {
  template,
  bindings: {
    modifiedDnsList: '<',
    isUpdating: '<',
    closeValidationModal: '&',
    applyConfiguration: '&',
  },
};

export default validationModalComponent;
