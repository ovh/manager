import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';
import 'ovh-ui-angular';

import './logs-offer.less';

import component from './logs-offer.component';
import routing from './logs-offer.routing';
import service from './logs-offer.service';

const moduleName = 'ovhManagerDbaasLogsDetailOffer';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'oui',
    'ovhManagerCore',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
  ])
  .config(routing)
  .service('LogsOfferService', service)
  .component('dbaasLogsDetailOffer', component);

export default moduleName;
