import angular from 'angular';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';

import routing from './nas-details.routes';

const moduleName = 'ovhManagerNASDetails';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate', 'ui.router'])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
