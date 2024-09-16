import template from './validation-buttons.html';

const validationButtonsComponent = {
  template,
  bindings: {
    openValidationModal: '&',
    cancelModifications: '&',
    showCancelModificationsButton: '<',
    canSubmit: '<',
    shouldClearForm: '=',
  },
};

export default validationButtonsComponent;
