import angular from 'angular';

import component from './userIdentities.component';
import selectModal from '../selectModal';

const moduleName = 'ovhManagerIAMUserIdentity';

angular
  .module(moduleName, [selectModal])
  .component('iamUserIdentities', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
