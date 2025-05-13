import controller from './add-dns-forms.controller';
import template from './add-dns-forms.html';

const addDnsFormsComponent = {
  template,
  controller,
  bindings: {
    minNumberOfDns: '<',
    maxNumberOfDns: '<',
    modifiedDnsList: '<',
    configurationType: '<',
    showForm: '<',
    showCancelModificationsButton: '<',
    updateError: '<',
    canSubmit: '<',
    openValidationModal: '&',
    cancelModifications: '&',
    onSubmit: '&',
    onRemove: '&',
    shouldClearForm: '=',
  },
};

export default addDnsFormsComponent;
