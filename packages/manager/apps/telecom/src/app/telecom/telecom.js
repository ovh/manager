import './orders/orders.bundle';
import './pack/pack.bundle';
import './telephony/telephony.bundle';

angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom', {
    url: '',
    templateUrl: 'app/telecom/telecom.html',
    abstract: true,
    translations: { value: ['../common', '.'], format: 'json' },
    resolve: {
      vipStatus($q, TelecomMediator) {
        // this can be totally async. We don't force it to be resolved before loading state.
        TelecomMediator.initVipStatus();
        return $q.when({});
      },
      serviceCount(TelecomMediator) {
        return TelecomMediator.initServiceCount();
      },
    },
  });
});
