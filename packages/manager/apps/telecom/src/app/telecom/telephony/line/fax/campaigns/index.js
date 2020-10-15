import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';

import serviceFaxCampaigns from '../../../service/fax/campaigns';

import routing from './campaigns.routing';

const moduleName = 'ovhManagerTelecomTelephonyLineFaxCampaigns';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'pascalprecht.translate',
    'ui.router',
    serviceFaxCampaigns,
  ])
  .config(routing);

export default moduleName;
