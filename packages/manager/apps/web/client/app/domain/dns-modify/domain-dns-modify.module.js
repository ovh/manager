import 'angular-translate';
import webDomainDnsModifyAddDnsForms from './components/add-dns-forms/add-dns-forms.module';
import webDomainDnsModifyValidationButtonsModule from './components/validation-buttons/validation-buttons.module';
import webDomainValidationModalModule from './components/validation-modal/validation-modal.module';
import domainDnsModifyComponent from './domain-dns-modify.component';
import routing from './domain-dns-modify.state';

angular
  .module(domainDnsModifyComponent.name, [
    'pascalprecht.translate',
    webDomainDnsModifyAddDnsForms,
    webDomainValidationModalModule,
    webDomainDnsModifyValidationButtonsModule,
  ])
  .component(domainDnsModifyComponent.name, domainDnsModifyComponent)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default domainDnsModifyComponent.name;
