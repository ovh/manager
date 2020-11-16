import steps from './basicOptions.steps';

import {
  name as serviceName,
  UpgradeBasicOptionsService,
} from './basicOptions.service';

const moduleName = 'ovhManagerPccServicePackUpgradeBasicOptionsComponent';

angular
  .module(moduleName, [...steps])
  .run(/* @ngTranslationsInject:json ./translations */)
  .service(serviceName, UpgradeBasicOptionsService);

export default moduleName;
