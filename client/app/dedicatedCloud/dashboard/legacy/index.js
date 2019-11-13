import component from './legacy.component';

import deleteDrp from '../../deleteDrp';
import drpAlerts from '../../datacenter/drp/alerts';
import drpDatacenterSelection from '../../drpDatacenterSelection';

const moduleName = 'ovhManagerPccDashboardLegacy';

angular
  .module(moduleName, [
    deleteDrp,
    drpAlerts,
    drpDatacenterSelection,
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component(component.name, component);

export default moduleName;
