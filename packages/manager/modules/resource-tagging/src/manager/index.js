import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import '@ovh-ux/ng-ovh-utils';

import component from './component';

const moduleName = 'ovhManagerResourceTaggingManager';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'ngOvhUtils',
    'oui',
    'pascalprecht.translate',
  ])
  .component('ovhManagerResourceTaggingManager', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
