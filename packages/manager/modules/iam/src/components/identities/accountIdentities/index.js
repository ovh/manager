import angular from 'angular';

import accountDelegation from './accountDelegation';
import component from './accountIdentities.component';

const moduleName = 'ovhManagerIAMAccountIdentities';

angular
  .module(moduleName, [accountDelegation])
  .component('iamAccountIdentities', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
