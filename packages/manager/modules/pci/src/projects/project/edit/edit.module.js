import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-api-wrappers'; // should be a peer dependency of ovh-api-services
import '@ovh-ux/ng-ovh-user-pref';
import 'angular-translate';
import 'ovh-api-services';
import '@ovh-ux/ui-kit';

import remove from './remove';
import hds from './hds';

import component from './edit.component';
import routing from './edit.routing';
import orderCart from '../../order-cart.service';

const moduleName = 'ovhManagerPciProjectEdit';

angular
  .module(moduleName, [
    hds,
    remove,
    'ngOvhUserPref',
    'oui',
    'ovhManagerCore',
    'ovh-api-services',
    'pascalprecht.translate',
  ])
  .config(routing)
  .component('pciProjectEdit', component)
  .run(/* @ngTranslationsInject:json ./translations */)
  .service('orderCart', orderCart);

export default moduleName;
