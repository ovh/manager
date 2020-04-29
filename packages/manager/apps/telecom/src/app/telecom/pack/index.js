import angular from 'angular';

import internetAccess from './internet-access';
import packVoipLineActivation from './slots/voipLine/activation/pack-voipLine-activation.module';

import templates from './pack.templates';

import controller from './pack.controller';
import routing from './pack.routing';

const moduleName = 'ovhManagerTelecomPack';

angular
  .module(moduleName, [internetAccess, packVoipLineActivation])
  .controller('PackCtrl', controller)
  .config(routing)
  .run(templates)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
