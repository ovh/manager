import angular from 'angular';

import '@ovh-ux/ui-kit';

import component from './task-tracker.component';
import './task-tracker.styles.scss';
import TaskTracker from './TaskTracker.class';

const moduleName = 'ovhManagerComponentsTaskTracker';

angular
  .module(moduleName, ['oui'])
  .config(
    /* @ngInject */
    ($compileProvider) => {
      TaskTracker.init($compileProvider);
    },
  )
  .component('taskTracker', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export { TaskTracker };
export default moduleName;
