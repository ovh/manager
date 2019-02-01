import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';

import { DOMAIN_URL } from './constants';
import component from './component';

import activation from './activation';

const moduleName = 'ovhManagerPackSlotsDomain';

angular
  .module(moduleName, [
    activation,
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component('packDomainSlot', component)
  .constant('PACK_SLOTS_DOMAIN_URL', DOMAIN_URL);

export default moduleName;
