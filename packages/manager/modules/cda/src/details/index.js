import angular from 'angular';

import routing from './cda-details';

const moduleName = 'ovhManagerCdaDetails';

angular
  .module(moduleName, [])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
