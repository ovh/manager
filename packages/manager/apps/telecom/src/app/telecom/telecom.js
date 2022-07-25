import './orders/orders.bundle';
import './pack';
import './telephony';

import { User } from '@ovh-ux/manager-models';

angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom', {
    url: '',
    templateUrl: 'app/telecom/telecom.html',
    abstract: true,
    translations: { value: ['../common', '.'], format: 'json' },
    resolve: {
      user: /* @ngInject */ (coreConfig) => new User(coreConfig.getUser()),
      vipStatus($q, TelecomMediator) {
        // this can be totally async. We don't force it to be resolved before loading state.
        TelecomMediator.initVipStatus();
        return $q.when({});
      },
    },
  });
});
