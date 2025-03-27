import angular from 'angular';

import uiRouter from '@uirouter/angularjs';
import angularTranslate from 'angular-translate';

import component from './pack-migration-meeting.component';
import service from './pack-migration-meeting.service';

const moduleName = 'ovhManagerTelecomPackMigrationMeeting';

angular
  .module(moduleName, [uiRouter, angularTranslate])
  .component('packMigrationMeeting', component)
  .service('PackMigrationMeetingService', service);

export default moduleName;
