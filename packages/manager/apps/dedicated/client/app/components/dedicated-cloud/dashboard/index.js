import ngOvhFeatureFlipping from '@ovh-ux/ng-ovh-feature-flipping';
import ngAtInternet from '@ovh-ux/ng-at-internet';

import zertoAlerts from '../datacenter/zerto/alerts';
import generalInformation from './tiles/general-information';
import legacyDashboard from './legacy';
import options from './tiles/options';
import vmwareCloudDirector from './tiles/vmware-cloud-director';
import serviceManagement from './tiles/service-management';
import lv1Lv2MigrationBanner from './lv1-lv2-migration-banner';
import component from './dedicatedCloud-dashboard.component';
import './dedicatedCloud-dashboard.scss';
import dedicatedcloudDatacenterZertoSiteStateBadgeComponent from '../datacenter/zerto/siteStateBadge';

const moduleName = 'ovhManagerPccDashboard';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    zertoAlerts,
    generalInformation,
    legacyDashboard,
    ngAtInternet,
    ngOvhFeatureFlipping,
    options,
    vmwareCloudDirector,
    serviceManagement,
    lv1Lv2MigrationBanner,
    dedicatedcloudDatacenterZertoSiteStateBadgeComponent,
  ])
  .component('pccDashboard', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
