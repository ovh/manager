import component from './dashboard.component';

import ovhManagerPccDashboardGeneralInformation from './generalInformation';
import ovhManagerPccDashboardLegacy from './legacy';
import ovhManagerPccDashboardOptions from './options';
import ovhManagerPccDashboardServiceManagement from './serviceManagement';

const moduleName = 'ovhManagerPccDashboard';

angular
  .module(moduleName, [
    'oui',
    ovhManagerPccDashboardGeneralInformation,
    ovhManagerPccDashboardLegacy,
    ovhManagerPccDashboardOptions,
    ovhManagerPccDashboardServiceManagement,
    'pascalprecht.translate',
    'ui.router',
  ])
  .component(component.name, component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
