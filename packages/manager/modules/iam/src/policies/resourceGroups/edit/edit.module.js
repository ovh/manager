import angular from 'angular';

import createResourceGroup from '../../../components/createResourceGroup';

import routing from './edit.routing';

const moduleName = 'ovhManagerIAMResourceGroupsEdit';

angular
  .module(moduleName, [createResourceGroup])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
