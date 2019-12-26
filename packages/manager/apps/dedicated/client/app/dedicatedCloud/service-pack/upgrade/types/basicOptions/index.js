import steps from './basicOptions.steps';

import { registerState } from './basicOptions.routing';
import {
  name as serviceName,
  UpgradeBasicOptionsService,
} from './basicOptions.service';

const moduleName = 'ovhManagerPccServicePackUpgradeBasicOptions';

angular
  .module(moduleName, [...steps])
  .config(registerState)
  .run(/* @ngTranslationsInject:json ./translations */)
  .service(serviceName, UpgradeBasicOptionsService);

export default moduleName;
