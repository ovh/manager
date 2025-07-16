import component from './legacy.component';

import zerto from '../../datacenter/zerto';
import securityOptionsTile from '../tiles/security-options';
import vmwareOptionTile from '../tiles/vmware-option';

const moduleName = 'ovhManagerPccDashboardLegacy';

angular
  .module(moduleName, [
    zerto,
    securityOptionsTile,
    vmwareOptionTile,
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component(component.name, component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
