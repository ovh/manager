import angular from 'angular';

import service, { name } from './operator.service';

const moduleName = 'ovhManagerIAMConditionOperator';

angular
  .module(moduleName, [])
  .service(name, service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
