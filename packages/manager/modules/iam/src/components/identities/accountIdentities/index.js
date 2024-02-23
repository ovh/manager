import angular from 'angular';

import component from './accountIdentities.component';
import addAccountModal from './addAccountModal';

const moduleName = 'ovhManagerIAMAccountIdentities';

angular
  .module(moduleName, [addAccountModal])
  .component('iamAccountIdentities', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
