import angular from 'angular';
import component, { resolves } from './policy.component';

export const name = 'ovhManagerIamPolicy';
export const moduleName = 'ovhManagerIAMPolicyComponent';

angular
  .module(moduleName, [])
  .component(name, component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default {
  name,
  moduleName,
  resolves,
};
