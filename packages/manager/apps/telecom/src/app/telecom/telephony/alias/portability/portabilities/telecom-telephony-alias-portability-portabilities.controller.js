import find from 'lodash/find';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import map from 'lodash/map';
import set from 'lodash/set';

import template from './attach/portabilities-attach.html';
import controller from './attach/portabilities-attach.controller';

function groupPortaByNumbers(portabilities) {
  let numbers = [];
  forEach(portabilities, (portability) => {
    numbers = portability.numbersList.map(number => ({
      number,
      portability,
      lastStepDone: find(portability.steps.slice().reverse(), { status: 'done' }),
    }));
  });
  return numbers;
}

export default class TelecomTelephonyAliasPortabilitiesCtrl {
  constructor($q, $stateParams, $translate, $uibModal, OvhApiTelephony, TucToast) {
    this.$translate = $translate;
    this.$stateParams = $stateParams;
    this.$q = $q;
    this.OvhApiTelephony = OvhApiTelephony;
    this.TucToast = TucToast;
    this.$uibModal = $uibModal;
  }

  $onInit() {
    this.loading = {
      cancel: false,
    };

    this.serviceName = this.$stateParams.serviceName;
    this.init();
  }

  init() {
    this.isLoading = true;
    this.fetchPortability().then((result) => {
      this.numbers = groupPortaByNumbers(result);
    }).catch((error) => {
      this.TucToast.error([this.$translate.instant('telephony_alias_portabilities_load_error'), get(error, 'data.message')].join(' '));
      return this.$q.reject(error);
    }).finally(() => {
      this.isLoading = false;
    });
  }

  fetchPortability() {
    return this.OvhApiTelephony.Portability().v6().query({
      billingAccount: this.$stateParams.billingAccount,
    }).$promise.then(ids => this.$q.all(map(ids, id => this.OvhApiTelephony.Portability().v6().get({
      billingAccount: this.$stateParams.billingAccount,
      id,
    }).$promise.then(porta => this.$q.all({
      steps: this.OvhApiTelephony.Portability().v6().getStatus({
        billingAccount: this.$stateParams.billingAccount,
        id,
      }).$promise,
      canBeCancelled: this.OvhApiTelephony.Portability().v6().canBeCancelled({
        billingAccount: this.$stateParams.billingAccount,
        id,
      }).$promise,
      documentAttached: this.OvhApiTelephony.Portability().PortabilityDocument().v6().query({
        billingAccount: this.$stateParams.billingAccount,
        id,
      }).$promise,
    }).then((results) => {
      set(porta, 'steps', results.steps);
      set(porta, 'canBeCancelled', results.canBeCancelled.value);
      set(porta, 'documentAttached', results.documentAttached);
      return porta;
    })))));
  }

  confirmCancelPortability(portability) {
    this.loading.cancel = true;

    return this.OvhApiTelephony.Portability().v6().cancel({
      billingAccount: this.$stateParams.billingAccount,
      id: portability.id,
    }, {}).$promise.then(() => {
      this.TucToast.success(this.$translate.instant('telephony_alias_portabilities_cancel_success'));
      return this.init();
    }).catch((error) => {
      this.TucToast.error([this.$translate.instant('telephony_alias_portabilities_cancel_error'), get(error, 'data.message')].join(' '));
      return this.$q.reject(error);
    }).finally(() => {
      this.loading.cancel = false;
    });
  }

  attachMandate(number) {
    const modal = this.$uibModal.open({
      animation: true,
      template,
      controller,
      controllerAs: '$ctrl',
      resolve: {
        data: () => ({
          id: number.portability.id,
        }),
      },
    });

    modal.result.then((mandate) => {
      if (mandate && mandate.upload && mandate.upload.name) {
        // refresh portabilities
        this.init();
      }
    });
  }
}
