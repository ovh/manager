import find from 'lodash/find';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import map from 'lodash/map';
import set from 'lodash/set';

function groupPortaByNumbers(portabilities) {
  const numbers = [];
  forEach(portabilities, (porta) => {
    forEach(porta.numbersList, (number) => {
      numbers.push({
        number,
        portability: porta,
        lastStepDone: find(porta.steps.slice().reverse(), { status: 'done' }),
      });
    });
  });
  return numbers;
}

angular.module('managerApp').controller('TelecomTelephonyAliasPortabilitiesCtrl', class TelecomTelephonyAliasPortabilitiesCtrl {
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
    console.log('init');
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
    console.log('fetchPortability');
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
      console.log('results', results);
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
    console.log('attache mandate', number);
    const modal = this.$uibModal.open({
      animation: true,
      templateUrl: 'app/telecom/telephony/alias/portability/portabilities/attach/telecom-telephony-alias-portability-portabilities-attach.html',
      controller: 'TelecomTelephonyServicePortabilityMandateAttachCtrl',
      controllerAs: '$ctrl',
      resolve: {
        data: () => ({
          id: number.portability.id,
        }),
      },
    });

    modal.result.then((mandate) => {
      console.log(mandate);
    });
    /*
    modal.result.then((conditions) => {
      // Set existing condition state to delete
      _.forEach(self.number.feature.timeCondition.conditions, (condition) => {
        _.set(condition, 'state', 'TO_DELETE');
      });

      return self.number.feature.timeCondition.saveConditions().then(() => {
        self.number.feature.timeCondition.conditions = self.number.feature.timeCondition.conditions
          .concat(_.map(conditions, (condition) => {
            _.set(condition, 'billingAccount', $stateParams.billingAccount);
            _.set(condition, 'serviceName', $stateParams.serviceName);
            _.set(condition, 'state', 'TO_CREATE');
            _.set(condition, 'featureType', 'easyHunting');

            _.set(condition, 'day', condition.weekDay);
            _.set(condition, 'hourBegin', condition.timeFrom.split(':').slice(0, 2).join(''));
            _.set(condition, 'hourEnd', condition.timeTo.split(':').slice(0, 2).join(''));

            _.set(condition, 'featureType', 'sip');

            return new VoipTimeConditionCondition(condition);
          }));

        uiCalendarConfig.calendars.conditionsCalendar.fullCalendar('refetchEvents');
        return self.number.feature.timeCondition.saveConditions().then(() => {
          TucToast.success(
            $translate.instant('telephony_common_time_condition_import_configuration_success'));
        }).catch(() => {
          TucToast.error(
            $translate.instant('telephony_common_time_condition_import_configuration_error'));
        }).finally(() => {
          self.$onInit();
        });
      });
    }).catch((error) => {
      if (error) {
        TucToast.error(
          $translate.instant('telephony_common_time_condition_import_configuration_error'));
      }
    });
    */
  }
});
