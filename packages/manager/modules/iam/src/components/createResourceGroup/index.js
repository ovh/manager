import angular from 'angular';

import deleteEntity from '../deleteEntity';
import resourceSelect from '../resourceSelect';

import component from './createResourceGroup.component';

const moduleName = 'ovhManagerIAMComponentsCreateResourceGroup';

angular
  .module(moduleName, [deleteEntity, resourceSelect])
  .component('iamCreateResourceGroup', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
