import angular from 'angular';
import '@ovh-ux/manager-core';
import '@ovh-ux/ui-kit';
import 'angular-translate';

import './style.scss';

import component from './component';

const moduleName = 'ovhManagerAnthosDashboardAccessRestrictionTable';

angular
  .module(moduleName, ['oui', 'ovhManagerCore', 'pascalprecht.translate'])
  .component('anthosAccessRestrictionTable', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
