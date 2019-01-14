import angular from 'angular';

import group from './group';
import scheduler from './scheduler';

import mediatorService from './telephony-mediator.service';
import voipService from './telephony-voip-service.service';

const moduleName = 'ovhManagerTelephonyComponents';

angular.module(moduleName, [
  group,
  scheduler,
])
  .service('TelephonyMediator', mediatorService)
  .service('TelephonyVoipService', voipService);

export default moduleName;
