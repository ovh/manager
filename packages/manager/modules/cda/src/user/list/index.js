import angular from 'angular';

import routing from './cda-user-list';

const moduleName = 'ovhManagerCdaUserList';

angular
  .module(moduleName, [])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
