import angular from 'angular';

import component from '../details/service/terminate/terminate.component';
import routing from './terminate.routing';

const moduleName = 'ovhManagerWebPaasTerminate';

angular
  .module(moduleName, [])
  .config(routing)
  .component('webPaasTerminate', component)
  .run(/* @ngTranslationsInject:json ../details/service/terminate/translations */);

export default moduleName;
