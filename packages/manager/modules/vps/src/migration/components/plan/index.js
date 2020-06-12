import angular from 'angular';

import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './plan.component';

const moduleName = 'ovhManagerVpsMigrationPlan';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate', 'ui.router'])
  .component(component.name, component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
