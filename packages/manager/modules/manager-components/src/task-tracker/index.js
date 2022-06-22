import angular from 'angular';

import '@ovh-ux/ui-kit';

import component from './task-tracker.component';
import './task-tracker.styles.scss';

const moduleName = 'ovhManagerComponentsTaskTracker';

angular
  .module(moduleName, ['oui'])
  .component('taskTracker', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
