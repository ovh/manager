import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ng-ui-router-layout';
import '@uirouter/angularjs';
import 'angular-translate';
import 'angular-ui-bootstrap';
import 'ovh-api-services';
import '@ovh-ux/ui-kit';

import component from './component';
import routing from './routing';
import service from './service';
import dashboard from './dashboard/veeam-dashboard.component';
import storage from './storage/veeam-storage.component';
import storageAdd from './storage/add/veeam-storage-add.component';
import storageQuota from './storage/update-quota/veeam-storage-update-quota.component';
import updateOffer from './dashboard/update-offer/veeam-update-offer.component';

import './index.less';

import '@ovh-ux/ui-kit/dist/css/oui.css';

const moduleName = 'ovhManagerVeeamCloudConnect';

angular
  .module(moduleName, [
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    'ngOvhCloudUniverseComponents',
    'ngUiRouterLayout',
    'ui.bootstrap',
    'ovh-api-services',
    'oui',
  ])
  .config(routing)
  .component('ovhManagerVeeamCloudConnectComponent', component)
  .component('ovhManagerVeeamCloudConnectDashboardComponent', dashboard)
  .component('ovhManagerVeeamCloudConnectStorageComponent', storage)
  .component('ovhManagerVeeamCloudConnectStorageAddComponent', storageAdd)
  .component('ovhManagerVeeamCloudConnectStorageQuotaComponent', storageQuota)
  .component('ovhManagerVeeamCloudConnectUpdateOfferComponent', updateOffer)
  .service('VeeamCloudConnectService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
