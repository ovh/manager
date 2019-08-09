import {
  controller,
  controllerName,
} from './upgrade.controller';

import state from './upgrade.state';

const MODULE_NAME = 'ovhManagerPccResourceUpgrade';

angular
  .module(MODULE_NAME, [
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .controller(controllerName, controller)
  .config(/* @ngInject */ ($stateProvider) => {
    $stateProvider.state('app.dedicatedClouds.datacenter.datastores.resourceUpgrade', _.clone(state));
    $stateProvider.state('app.dedicatedClouds.datacenter.hosts.resourceUpgrade', _.clone(state));
  })
  .run(/* @ngTranslationsInject:json ./translations */);

export default MODULE_NAME;
