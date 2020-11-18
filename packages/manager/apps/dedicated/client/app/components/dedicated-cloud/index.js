import ngOvhFeatureFlipping from '@ovh-ux/ng-ovh-feature-flipping';
import ngAtInternet from '@ovh-ux/ng-at-internet';

import component from './dedicatedCloud.component';
import drpService from './datacenter/drp/dedicatedCloud-datacenter-drp.service';
import dedicatedCloudservice from './dedicatedCloud.service';
import ServicePackService from './service-pack/service-pack.service';
import OptionsService from './dashboard/tiles/options/options.service';
import drpAlerts from './datacenter/drp/alerts';
import generalInformation from './dashboard/tiles/general-information';
import legacyDashboard from './dashboard/legacy';
import options from './dashboard/tiles/options';
import serviceManagement from './dashboard/tiles/service-management';

const moduleName = 'ovhManagerPcc';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    dedicatedCloudservice,
    drpService,
    ngAtInternet,
    ngOvhFeatureFlipping,
    OptionsService,
    ServicePackService,
    drpAlerts,
    generalInformation,
    legacyDashboard,
    options,
    serviceManagement,
  ])
  .component('ovhManagerPcc', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
