import 'angular-translate';
import '@ovh-ux/ng-ovh-payment-method';
import '@ovh-ux/ng-ovh-contracts';
import component from './domain-dns-anycast.component';

const moduleName = 'domainAnycast';

angular
  .module(moduleName, [
    'ngOvhContracts',
    'ngOvhPaymentMethod',
    'oui',
    'pascalprecht.translate',
  ])
  .component('domainAnycast', component);

export default moduleName;
