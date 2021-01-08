import angular from 'angular';

import routing from './cda-ip-list';

const moduleName = 'ovhManagerCdaIpList';

angular
  .module(moduleName, [])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
