import angular from 'angular';

import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './component';

const moduleName =
  'ovhManagerBmServerComponentsDashboardServerInstallImageConfig';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .run(/* @ngTranslationsInject:json ./translations */)
  .component(component.name, component);

export default moduleName;
