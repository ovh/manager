import DnsFormController from './add-dns-form.controller';
import { hostnameValidator, ipValidator } from './add-dns-form.directive';
import template from './add-dns-form.html';

const moduleName = 'addDnsFormModule';

angular
  .module(moduleName, ['pascalprecht.translate'])
  .directive('hostnameValidator', ['WucValidator', hostnameValidator])
  .directive('ipValidator', ['WucValidator', ipValidator])
  .component('addDnsForm', {
    template,
    controller: DnsFormController,
    bindings: {
      modifiedDnsList: '<',
      minDnsSize: '<',
      configurationType: '<',
      nameServer: '<',
      ip: '<',
      onSubmit: '&',
      shouldClearForm: '=',
    },
  })
  .run(/* @ngTranslationsInject:json */);

export default moduleName;
