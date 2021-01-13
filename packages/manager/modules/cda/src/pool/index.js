import angular from 'angular';

import routing from './cda-pool';
import cdaPoolList from './list';

const moduleName = 'ovhManagerCdaPool';

angular
  .module(moduleName, [cdaPoolList])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
