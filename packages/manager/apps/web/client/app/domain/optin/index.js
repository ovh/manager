import component from './optin.component';
import controller from './optin.controller';

import routing from './routes';

const moduleName = 'domainOptin';

angular
  .module(moduleName, [])
  .component('domainOptin', component)
  .controller('DomainOptinCtrl', controller)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
