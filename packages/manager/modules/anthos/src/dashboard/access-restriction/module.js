import angular from 'angular';
import '@ovh-ux/manager-core';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';
import 'angular-translate';

import component from './component';
import table from './table';
import routing from './routing';
import hasFocus from '../components/has-focus';

const moduleName = 'ovhManagerAnthosDashboardAccessRestriction';

angular
  .module(moduleName, [
    'oui',
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    table,
    hasFocus,
  ])
  .component('anthosAccessRestriction', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
