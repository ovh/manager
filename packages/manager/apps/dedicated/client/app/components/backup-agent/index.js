import ngOvhFeatureFlipping from '@ovh-ux/ng-ovh-feature-flipping';
import ngAtInternet from '@ovh-ux/ng-at-internet';

import component from './dedicatedCloud.component';
import zertoService from './datacenter/zerto/dedicatedCloud-datacenter-zerto.service';
import dedicatedCloudservice from './dedicatedCloud.service';
import ServicePackService from './service-pack/service-pack.service';
import OptionsService from './dashboard/tiles/options/options.service';
import ManagedVcdMigrationBanner from './vmware-cloud-director/migration-banner';
import CustomerSurveyBanner from './customer-survey-banner';
import PccGuides from './guides';

const moduleName = 'ovhManagerPcc';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    dedicatedCloudservice,
    zertoService,
    ngAtInternet,
    ngOvhFeatureFlipping,
    OptionsService,
    ServicePackService,
    ManagedVcdMigrationBanner,
    CustomerSurveyBanner,
    PccGuides,
  ])
  .component('ovhManagerPcc', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
