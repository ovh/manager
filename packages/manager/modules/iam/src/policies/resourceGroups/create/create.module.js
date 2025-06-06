import angular from 'angular';

import createResourceGroup from '../../../components/createResourceGroup';

import routing from './create.routing';

const moduleName = 'ovhManagerIAMResourceGroupsCreate';

angular
  .module(moduleName, [createResourceGroup])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
