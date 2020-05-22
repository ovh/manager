import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-ui-angular';

import productOffers from '@ovh-ux/manager-product-offers';
import component from './component';
import routing from './routing';

const moduleName = 'ovhManagerDomainDetachFreeHostingModule';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    productOffers,
    'ui.router',
    'pascalprecht.translate',
  ])
  .component(component.name, component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
