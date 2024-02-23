import angular from 'angular';

import component from './addAccountModal.component';

const moduleName = 'ovhManagerIAMAddAccountModal';

angular
  .module(moduleName, [])
  .component('iamAddAccountModal', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
