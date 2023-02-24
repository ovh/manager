import angular from 'angular';
import component from './iam.component';

export const name = 'ovhManagerIam';
export const moduleName = 'ovhManagerIAMComponent';

angular.module(moduleName, []).component(name, component);

export default {
  name,
  moduleName,
};
