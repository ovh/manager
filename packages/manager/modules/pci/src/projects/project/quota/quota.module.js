import angular from 'angular';
import 'angular-translate';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ng-ovh-api-wrappers'; // should be a peer dependency of ovh-api-services
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ng-ovh-payment-method';
import 'ovh-api-services';
import '@ovh-ux/ui-kit';

import header from '../../../components/project/quota-region-header';
import component from './quota.component';
import routing from './quota.routing';
import service from './quota.service';
import increaseQuota from './increase-request';

const moduleName = 'ovhManagerPciProjectQuota';

angular
  .module(moduleName, [
    header,
    increaseQuota,
    'ovhManagerCore',
    'ngOvhCloudUniverseComponents',
    'ngTranslateAsyncLoader',
    'oui',
    'ovhManagerCore',
    'ovh-api-services',
    'pascalprecht.translate',
    'ngOvhPaymentMethod',
  ])
  .component('pciProjectQuota', component)
  .service('PciProjectQuota', service)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
