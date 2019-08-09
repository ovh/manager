import component from './component';
import header from './header';

const componentName = 'stepper';
const moduleName = 'dedicatedCloudDashboardTilesOptionsOrderStepper';

angular
  .module(moduleName, [
    header,
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component(componentName, component);

export default moduleName;
