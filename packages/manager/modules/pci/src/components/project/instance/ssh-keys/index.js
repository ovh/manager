import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './ssh-keys.component';

const moduleName = 'ovhManagerPciSshKeys';

angular
  .module(moduleName, [
    'oui',
    'ngOvhCloudUniverseComponents',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .component('pciProjectInstanceSshKeys', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
