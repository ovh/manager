import angular from 'angular';

import alias from './alias';
import associateDevice from './associateDevice';
import group from './group';
import scheduler from './scheduler';
import service from './service';
import timeCondition from './timeCondition';

import mediatorService from './telephony-mediator.service';
import voipService from './telephony-voip-service.service';
/* @TODO remove reference to sidebar service -> should be managed by the host project */
// import sidebarService from './sidebar/telephony-sidebar.service';

const moduleName = 'ovhManagerTelephonyComponents';

angular.module(moduleName, [
  alias,
  associateDevice,
  group,
  scheduler,
  service,
  timeCondition,
])
  .service('TelephonyMediator', mediatorService)
  .service('TelephonyVoipService', voipService);
// .service('TelephonySidebar', sidebarService);

export default moduleName;
