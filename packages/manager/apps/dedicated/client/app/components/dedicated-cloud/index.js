import ngOvhFeatureFlipping from '@ovh-ux/ng-ovh-feature-flipping';
import ngAtInternet from '@ovh-ux/ng-at-internet';
import ovhManagerIncidentBanner from '@ovh-ux/manager-incident-banner';

import component from './dedicatedCloud.component';
import drpService from './datacenter/drp/dedicatedCloud-datacenter-drp.service';
import dedicatedCloudservice from './dedicatedCloud.service';
import ServicePackService from './service-pack/service-pack.service';
import OptionsService from './dashboard/tiles/options/options.service';

const moduleName = 'ovhManagerPcc';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    dedicatedCloudservice,
    drpService,
    ngAtInternet,
    ngOvhFeatureFlipping,
    ovhManagerIncidentBanner,
    OptionsService,
    ServicePackService,
  ])
  .component('ovhManagerPcc', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
