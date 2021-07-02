import angular from 'angular';

import '@ovh-ux/ui-kit';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ng-at-internet';

import configModule from './components/config';
import configDriveModule from './components/config-drive';
import optionsModule from './components/options';

import component from './component';
import service from './service';

const moduleName = 'ovhManagerBmServerComponentsOsInstallImageComponent';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    'ngTranslateAsyncLoader',
    'ngAtInternet',
    configModule,
    configDriveModule,
    optionsModule,
  ])
  .run(/* @ngTranslationsInject:json ./translations */)
  .service('osInstallServiceImage', service)
  .component(component.name, component);

export default moduleName;
