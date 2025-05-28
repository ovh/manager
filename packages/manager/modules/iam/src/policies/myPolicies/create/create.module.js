import angular from 'angular';

import createPolicy from '../../../components/createPolicy';

import routing from './create.routing';

const moduleName = 'ovhManagerIAMPolicyCreate';

angular
  .module(moduleName, [createPolicy])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
