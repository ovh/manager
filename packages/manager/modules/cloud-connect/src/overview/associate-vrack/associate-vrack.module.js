import angular from 'angular';

import component from './associate-vrack.component';
import routing from './associate-vrack.routing';

const moduleName = 'ovhCloudConnectAssociateVrack';

angular
  .module(moduleName, [])
  .config(routing)
  .component(
    'cloudConnectAssociateVrack',
    component,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
