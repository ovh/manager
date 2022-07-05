import angular from 'angular';

import '@ovh-ux/ui-kit';

import component from './task-tracker.component';
import service from './task-tracker.service';
import './task-tracker.styles.scss';

const moduleName = 'ovhManagerComponentsTaskTracker';

angular
  .module(moduleName, ['oui'])
  .component('taskTracker', component)
  .service('TaskTrackerService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
