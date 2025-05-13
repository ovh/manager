import component from './email-obfuscation.component';
import controller from './email-obfuscation.controller';

import routing from './routes';

const moduleName = 'domainEmailObfuscation';

angular
  .module(moduleName, [])
  .component('domainEmailObfuscation', component)
  .controller('DomainEmailObfuscationCtrl', controller)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
