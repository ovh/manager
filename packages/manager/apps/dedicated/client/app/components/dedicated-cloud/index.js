import ngOvhFeatureFlipping from '@ovh-ux/ng-ovh-feature-flipping';
import ngAtInternet from '@ovh-ux/ng-at-internet';

import component from './dedicatedCloud.component';
import drpService from './datacenter/drp/dedicatedCloud-datacenter-drp.service';
import dedicatedCloudservice from './dedicatedCloud.service';
import ServicePackService from './service-pack/service-pack.service';
import OptionsService from './dashboard/tiles/options/options.service';
import ManagedVcdMigrationBanner from './vmware-cloud-director/migration-banner';
import CustomerSurveyBanner from './customer-survey-banner';

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
    ManagedVcdMigrationBanner,
    CustomerSurveyBanner,
  ])
  .component('ovhManagerPcc', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
