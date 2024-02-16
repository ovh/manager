import angular from 'angular';

import 'angular-translate';
import '@ovh-ux/ui-kit';
import 'angular-ui-validate';

import component from './component';
import './index.scss';

const moduleName =
  'ovhManagerBmServerComponentsDashboardServerInstallImageConfigDrive';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate', 'ui.validate'])
  .run(/* @ngTranslationsInject:json ./translations */)
  .component(component.name, component);

export default moduleName;
