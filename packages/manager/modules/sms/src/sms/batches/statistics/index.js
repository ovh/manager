import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ui-kit';

import component from './telecom-sms-batches-statistics.component';
import routing from './routing';

import './telecom-sms-batches-statistics.scss';

const moduleName = 'ovhManagerSmsBatchesStatistics';

angular
  .module(moduleName, ['oui', 'ui.router'])
  .component(component.name, component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
