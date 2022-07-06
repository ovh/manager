import angular from 'angular';

import ngOvhUtils from '@ovh-ux/ng-ovh-utils';
import '@ovh-ux/ui-kit';

import component from './task-tracker.component';
import TaskTracker from './TaskTracker.class';

const moduleName = 'ovhManagerComponentsTaskTracker';

angular
  .module(moduleName, ['oui', ngOvhUtils])
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
