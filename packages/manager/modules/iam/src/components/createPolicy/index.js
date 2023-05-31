import angular from 'angular';

import actionSelect from '../actionSelect';
import deleteEntity from '../deleteEntity';
import resourceSelect from '../resourceSelect';

import component from './createPolicy.component';

const moduleName = 'ovhManagerIAMComponentsCreatePolicy';

angular
  .module(moduleName, [actionSelect, deleteEntity, resourceSelect])
  .component('iamCreatePolicy', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
