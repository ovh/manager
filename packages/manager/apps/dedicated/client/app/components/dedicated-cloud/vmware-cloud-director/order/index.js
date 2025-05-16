import hostModule from '../../datacenter/host';
import component from './component';

const moduleName = 'ovhManagerPccDashboardVmwareCloudDirectorOrder';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    'ui.router',
    hostModule,
  ])
  .component(component.name, component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
