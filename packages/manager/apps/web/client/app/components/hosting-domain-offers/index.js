import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

import '@ovh-ux/manager-core';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './component';

const moduleName = 'ovhManagerWebComponentsHostingDomainOffers';

angular
  .module(moduleName, ['pascalprecht.translate', 'oui'])
  .component('webComponentHostingDomainOffers', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
