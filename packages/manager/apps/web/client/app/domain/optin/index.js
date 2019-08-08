import component from './optin.component';
import controller from './optin.controller';

const moduleName = 'domainOptin';

angular.module(moduleName, [])
  .component('domainOptin', component)
  .controller('DomainOptinCtrl', controller);

export default moduleName;
