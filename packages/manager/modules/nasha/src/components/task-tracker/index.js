import angular from 'angular';

import 'angular-translate';
import { taskTracker } from '@ovh-ux/manager-components';

import component from './task-tracker.component';

const moduleName = 'ovhManagerNashaComponentsTaskTracker';

angular
  .module(moduleName, ['pascalprecht.translate', taskTracker])
  .component('nashaComponentsTaskTracker', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export { createTaskTrackerStateOptions } from './task-tracker.utils';

export default moduleName;
