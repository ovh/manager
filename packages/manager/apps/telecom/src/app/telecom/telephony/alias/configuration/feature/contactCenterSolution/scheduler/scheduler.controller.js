import get from 'lodash/get';

export default class TelecomTelephonyAliasConfigurationSchedulerCtrl {
  /* @ngInject */
  constructor($q, $stateParams, $translate, TelephonyMediator, TucToast) {
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.TelephonyMediator = TelephonyMediator;
    this.TucToast = TucToast;
  }

  $onInit() {
    this.loading = true;

    return this.TelephonyMediator.getGroup(this.$stateParams.billingAccount)
      .then((group) => {
        this.number = group.getNumber(this.$stateParams.serviceName);

        return this.number.feature.init();
      })
      .then(() =>
        this.$q.all({
          scheduler: this.number.feature.getScheduler(),
          timeCondition: this.number.feature.getTimeCondition(),
        }),
      )
      .catch((error) => {
        this.TucToast.error(
          `${this.$translate.instant(
            'telephony_alias_configuration_scheduler_load_error',
          )} ${get(error, 'data.message', '')}`,
        );
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
