import angular from 'angular';

import packMove from '../move';
import packResiliation from '../resiliation/pack-resiliation';
import xdsl from '../xdsl';
import migration from '../migration';
import slots from '../slots';

import { PACK } from './pack.constant';
import controller from './pack.controller';
import routing from './pack.routing';

const moduleName = 'ovhManagerTelecomPack';

angular
  .module(moduleName, [migration, packMove, packResiliation, slots, xdsl])
  .constant('PACK', PACK)
  .controller('PackCtrl', controller)
  .config(routing)
  .run(/* @ngTranslationsInject:json ../translations */);

export default moduleName;
