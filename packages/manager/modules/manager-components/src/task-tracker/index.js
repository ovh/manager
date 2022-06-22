import angular from 'angular';

import ngOvhUtils from '@ovh-ux/ng-ovh-utils';
import '@ovh-ux/ui-kit';

import component from './task-tracker.component';

const moduleName = 'ovhManagerComponentsTaskTracker';

angular
  .module(moduleName, ['oui', ngOvhUtils])
  .component('taskTracker', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
