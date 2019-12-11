import drpAlerts from '../datacenter/drp/alerts';

import generalInformation from './tiles/general-information';
import legacy from './legacy';
import options from './tiles/options';
import serviceManagement from './tiles/service-management';

import component from './dashboard.component';

const moduleName = 'ovhManagerPccDashboard';

angular
  .module(moduleName, [
    drpAlerts,
    'oui',
    generalInformation,
    legacy,
    options,
    'pascalprecht.translate',
    serviceManagement,
    'ui.router',
  ])
  .component(component.name, component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
