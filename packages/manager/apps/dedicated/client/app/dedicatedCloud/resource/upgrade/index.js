import clone from 'lodash/clone';

import { controller, controllerName } from './upgrade.controller';

import state from './upgrade.state';

const MODULE_NAME = 'ovhManagerPccResourceUpgrade';

angular
  .module(MODULE_NAME, ['oui', 'pascalprecht.translate', 'ui.router'])
  .controller(controllerName, controller)
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state(
        'app.dedicatedClouds.datacenter.datastores.resourceUpgrade',
        clone(state),
      );
      $stateProvider.state(
        'app.dedicatedClouds.datacenter.hosts.resourceUpgrade',
        clone(state),
      );
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default MODULE_NAME;
