import angular from 'angular';
import webDomainModifyAddDnsFormModule from './add-dns-form/add-dns-form.module';
import addDnsFormsComponent from './add-dns-forms.component';

const moduleName = 'webDomainDnsModifyAddDnsFormsModule';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    webDomainModifyAddDnsFormModule,
  ])
  .component('webDomainDnsModifyAddDnsForms', addDnsFormsComponent)
  .run(/* @ngTranslationsInject:json */);

export default moduleName;
