import ngOvhFeatureFlipping from '@ovh-ux/ng-ovh-feature-flipping';
import ngAtInternet from '@ovh-ux/ng-at-internet';

import drpAlerts from '../datacenter/drp/alerts';
import generalInformation from './tiles/general-information';
import legacyDashboard from './legacy';
import options from './tiles/options';
import serviceManagement from './tiles/service-management';
import lv1Lv2MigrationBanner from './lv1-lv2-migration-banner';
import component from './dedicatedCloud-dashboard.component';

const moduleName = 'ovhManagerPccDashboard';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    drpAlerts,
    generalInformation,
    legacyDashboard,
    ngAtInternet,
    ngOvhFeatureFlipping,
    options,
    serviceManagement,
    lv1Lv2MigrationBanner,
  ])
  .component('pccDashboard', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
