import angular from 'angular';

import component from './groupIdentities.component';
import selectModal from '../selectModal';

const moduleName = 'ovhManagerIAMGroupIdentity';

angular
  .module(moduleName, [selectModal])
  .component('iamGroupIdentities', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
