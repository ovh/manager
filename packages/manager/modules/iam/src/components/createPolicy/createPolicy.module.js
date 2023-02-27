import angular from 'angular';
import component, { resolves } from './createPolicy.component';

export const name = 'ovhManagerIamCreatePolicy';
export const moduleName = 'ovhManagerIAMCreatePolicyComponent';

angular
  .module(moduleName, [])
  .component(name, component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default {
  name,
  moduleName,
  resolves,
};
