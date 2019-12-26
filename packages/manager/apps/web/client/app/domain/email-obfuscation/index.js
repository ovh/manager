import component from './email-obfuscation.component';
import controller from './email-obfuscation.controller';

const moduleName = 'domainEmailObfuscation';

angular
  .module(moduleName, [])
  .component('domainEmailObfuscation', component)
  .controller('DomainEmailObfuscationCtrl', controller);

export default moduleName;
