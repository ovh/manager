import angular from 'angular';

import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import uiRouter from '@uirouter/angularjs';
import angularTranslate from 'angular-translate';

import meeting from './move-meeting.component';
import service from './move-meeting.service';

const moduleName = 'ovhManagerTelecomPackMoveMeeting';

angular
  .module(moduleName, [ngTranslateAsyncLoader, uiRouter, angularTranslate])
  .component('packMoveMeeting', meeting)
  .service('MoveMeetingService', service);

export default moduleName;
