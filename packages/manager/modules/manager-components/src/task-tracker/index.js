import angular from 'angular';

import ngOvhUtils from '@ovh-ux/ng-ovh-utils';
import '@ovh-ux/ui-kit';

import component from './task-tracker.component';
import service from './task-tracker.service.js';

const moduleName = 'ovhManagerComponentsTaskTracker';

angular
  .module(moduleName, ['oui', ngOvhUtils])
  .component('taskTracker', component)
  .service('TaskTrackerService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
