import addDnsFormComponent from './add-dns-form.component';
import { hostnameValidator, ipValidator } from './add-dns-form.directive';

const moduleName = 'webDomainDnsModifyAddDnsFormModule';

angular
  .module(moduleName, ['pascalprecht.translate'])
  .directive('webDomainDnsModifyHostnameValidator', [
    'WucValidator',
    hostnameValidator,
  ])
  .directive('webDomainDnsModifyIpValidator', ['WucValidator', ipValidator])
  .component('webDomainDnsModifyAddDnsForm', addDnsFormComponent)
  .run(/* @ngTranslationsInject:json */);

export default moduleName;
