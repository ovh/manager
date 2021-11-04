import angular from 'angular';

import component from './readonly-identity.component';

const moduleName = 'ovhTelecomOrderAliasReadonlyCoordinate';

angular
  .module(moduleName, [])
  .component('telecomSvaReadonlyIdentityForm', component)
  .run(/* @ngTranslationsInject:json ../translations */);

export default moduleName;
