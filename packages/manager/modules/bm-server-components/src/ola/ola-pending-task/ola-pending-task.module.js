import component from './ola-pending-task.component';

const moduleName = 'ovhManagerDedicatedServerInterfacesOlaPendingTask';

angular
  .module(moduleName, [])
  .component('dedicatedServerInterfacesOlaPendingTask', component)
  .run(/* @ngTranslationsInject:json ../translations */);

export default moduleName;
