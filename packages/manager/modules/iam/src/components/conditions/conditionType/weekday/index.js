import angular from 'angular';

import timezone from '../timezone';
import component, { name as componentName } from './weekdayCondition.component';
import service, { name as serviceName } from './weekdayCondition.service';

const moduleName = 'ovhManagerIAMConditionWeekday';

angular
  .module(moduleName, [timezone])
  .component(componentName, component)
  .service(serviceName, service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
