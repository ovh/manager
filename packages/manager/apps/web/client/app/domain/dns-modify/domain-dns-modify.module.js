import 'angular-translate';
import addDnsFormsModule from './components/add-dns-forms/add-dns-forms.module';
import validationButtonsModule from './components/validation-buttons/validation-buttons.module';
import validationModalModule from './components/validation-modal/validation-modal.module';
import controller from './domain-dns-modify.controller';
import template from './domain-dns-modify.html';
import routing, { componentName } from './domain-dns-modify.state';

angular
  .module(componentName, [
    'pascalprecht.translate',
    addDnsFormsModule,
    validationModalModule,
    validationButtonsModule,
  ])
  .component(componentName, {
    controller,
    template,
    bindings: {
      modifiedDnsList: '<',
      goBack: '<',
    },
  })
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default componentName;
