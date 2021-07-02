import angular from 'angular';

import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './component';
import './index.scss';

const moduleName = 'ovhManagerBmServerComponentsOsInstallImageConfigDriveComponent';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .run(/* @ngTranslationsInject:json ./translations */)
  .component(component.name, component);

export default moduleName;
