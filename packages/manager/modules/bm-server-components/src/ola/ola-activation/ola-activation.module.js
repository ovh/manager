import component from './ola-activation.component';

const moduleName = 'ovhManagerDedicatedServerInterfacesOlaActivation';

angular
  .module(moduleName, [])
  .component('dedicatedServerInterfacesOlaActivation', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
