import angular from 'angular';
import addDnsFormModule from './add-dns-form/add-dns-form.module';
import controller from './add-dns-forms.controller';
import template from './add-dns-forms.html';

const moduleName = 'addDnsFormsModule';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate', addDnsFormModule])
  .component('addDnsForms', {
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
  })
  .run(/* @ngTranslationsInject:json */);

export default moduleName;
