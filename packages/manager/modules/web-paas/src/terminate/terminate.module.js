import angular from 'angular';

import terminate from '../components/terminate';
import routing from './terminate.routing';

const moduleName = 'ovhManagerWebPaasTerminate';

angular
  .module(moduleName, [terminate])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
