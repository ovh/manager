import angular from 'angular';

import uiRouter from '@uirouter/angularjs';
import angularTranslate from 'angular-translate';

import component from './pack-migration-meeting.component';

const moduleName = 'ovhManagerTelecomPackMigrationMeeting';

angular
  .module(moduleName, [uiRouter, angularTranslate])
  .component('packMigrationMeeting', component);

export default moduleName;
