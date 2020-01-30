import angular from 'angular';

import '@ovh-ux/ng-ovh-swimming-poll';

import tucVoipServiceTask from './telecom-telephony-service-task.service';

const moduleName = 'tucTelecomTelephonyService';

angular
  .module(moduleName, ['ngOvhSwimmingPoll'])
  .service('tucVoipServiceTask', tucVoipServiceTask);

export default moduleName;
