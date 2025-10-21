import angular from 'angular';

import component, { name } from './timezone.component';

const moduleName = 'ovhManagerIAMConditionTimezone';

angular
  .module(moduleName, [])
  .component(name, component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
