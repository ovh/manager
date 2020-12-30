import angular from 'angular';

import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import ovhManagerAdvices from '@ovh-ux/manager-advices';

import component from './component';

const moduleName = 'ovhManagerVpsAdvicesComponentAdvices';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    'ui.router',
    ovhManagerAdvices,
  ])
  .component('dedicatedCloudVpsAdvices', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
