import angular from 'angular';

import createPolicy from '../../components/createPolicy';

import routing from './edit.routing';

const moduleName = 'ovhManagerIAMPolicyEdit';

angular
  .module(moduleName, [createPolicy])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
