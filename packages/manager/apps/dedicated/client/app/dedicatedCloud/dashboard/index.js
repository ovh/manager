import ngOvhFeatureFlipping from '@ovh-ux/ng-ovh-feature-flipping';

import drpAlerts from '../datacenter/drp/alerts';
import generalInformation from './tiles/general-information';
import legacy from './legacy';
import options from './tiles/options';
import serviceManagement from './tiles/service-management';

import component from './dedicatedCloud-dashboard.component';
import routing from './dedicatedCloud-dashboard.routing';

const moduleName = 'ovhManagerPccDashboard';

angular
  .module(moduleName, [
    ngOvhFeatureFlipping,
    drpAlerts,
    'oui',
    generalInformation,
    legacy,
    options,
    'pascalprecht.translate',
    serviceManagement,
    'ui.router',
  ])
  .component('pccDashboard', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
