import angular from 'angular';

import packMove from '../move';
import packResiliation from '../resiliation';
import xdsl from '../xdsl';
import migration from '../migration';
import slots from '../slots';

import controller from './pack.controller';
import routing from './pack.routing';

const moduleName = 'ovhManagerTelecomPack';

angular
  .module(moduleName, [migration, packMove, packResiliation, slots, xdsl])
  .controller('PackCtrl', controller)
  .config(routing)
  .run(/* @ngTranslationsInject:json ../translations */);

export default moduleName;
