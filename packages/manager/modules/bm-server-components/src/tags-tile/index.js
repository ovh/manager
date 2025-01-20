import angular from 'angular';

import '@ovh-ux/ui-kit';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import ovhManagerCore from '@ovh-ux/manager-core';

import component from './component';

const moduleName = 'ovhManagerBmServerComponentsTagsTileComponent';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    'ngTranslateAsyncLoader',
    ovhManagerCore,
  ])
  .component('serverTagsTile', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
