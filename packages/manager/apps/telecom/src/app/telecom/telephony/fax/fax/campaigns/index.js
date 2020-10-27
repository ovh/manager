import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import serviceFaxCampaigns from '../../../service/fax/campaigns';

import routing from './campaigns.routing';

const moduleName = 'ovhManagerTelecomTelephonyFaxFaxCampaigns';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
    serviceFaxCampaigns,
  ])
  .config(routing);

export default moduleName;
