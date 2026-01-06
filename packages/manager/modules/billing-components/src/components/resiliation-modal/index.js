import atInternet from '@ovh-ux/ng-at-internet';
import angular from 'angular';

import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import resiliate from './resiliate.component';

const moduleName = 'ovhManagerBillingResiliateModalWrapperModule';

angular
  .module(moduleName, [
    atInternet,
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component('ovhManagerBillingResiliateModalWrapper', resiliate)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
