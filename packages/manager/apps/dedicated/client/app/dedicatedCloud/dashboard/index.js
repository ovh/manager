import ngOvhFeatureFlipping from '@ovh-ux/ng-ovh-feature-flipping';
import ngAtInternet from '@ovh-ux/ng-at-internet';

import drpAlerts from '../datacenter/drp/alerts';
import generalInformation from './tiles/general-information';
import legacy from './legacy';
import associateIpBloc from './associate-ip-bloc';
import options from './tiles/options';
import serviceManagement from './tiles/service-management';
import update from './update';

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
    associateIpBloc,
    ngAtInternet,
    options,
    'pascalprecht.translate',
    serviceManagement,
    'ui.router',
    update,
  ])
  .component('pccDashboard', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
