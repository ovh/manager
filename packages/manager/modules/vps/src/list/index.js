import angular from 'angular';

import 'angular-translate';
import '@ovh-ux/ui-kit';
import '@ovh-ux/ng-translate-async-loader';

import component from './vps-list.component';
import vpsStateInfo from '../dashboard/components/vps-state-info';

const moduleName = 'ovhManagerVpsList';

angular
  .module(moduleName, [
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    vpsStateInfo,
  ])
  .component('ovhManagerVpsList', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
