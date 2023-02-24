import angular from 'angular';
import component, { resolves } from './policies.component';

export const name = 'ovhManagerIamPolicies';
export const moduleName = 'ovhManagerIAMPoliciesComponent';

angular
  .module(moduleName, [])
  .component(name, component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default {
  name,
  moduleName,
  resolves,
};
