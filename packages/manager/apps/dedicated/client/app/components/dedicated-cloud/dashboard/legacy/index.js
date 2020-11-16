import component from './legacy.component';

import drp from '../../datacenter/drp';
import securityOptionsTile from '../tiles/security-options';
import vmwareOptionTile from '../tiles/vmware-option';

const moduleName = 'ovhManagerPccDashboardLegacy';

angular
  .module(moduleName, [
    drp,
    securityOptionsTile,
    vmwareOptionTile,
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component(component.name, component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
