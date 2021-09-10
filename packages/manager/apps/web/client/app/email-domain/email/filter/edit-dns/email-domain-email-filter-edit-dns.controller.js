import without from 'lodash/without';

export default class EmailsEditDnsFilterCtrl {
  /* @ngInject */
  constructor($scope, $stateParams, $translate, Alerter, WucEmails) {
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.WucEmails = WucEmails;
  }

  $onInit() {
    this.customFilter = {
      value: null,
      regex: /(^(([a-z0-9]){1}([a-z\-0-9]{0,253}\.))+([a-z]{2,62}|xn--[a-z0-9]{2,58})|(?:\.ovh\.org))$/,
    };
    this.loading = false;

    this.$scope.updateDnsFilter = () => this.updateDnsFilter();

    this.getModels();
  }

  getModels() {
    this.loading = true;
    this.WucEmails.getModels()
      .then((models) => {
        this.dnsFilterEnum = without(
          models.models['domain.DomainMXFilterEnum'].enum,
          'CUSTOM',
        );
        this.selectedFilter =
          models.models['domain.DomainFilterOperandEnum'].enum;
        this.loading = false;
      })
      .catch((err) => {
        this.Alerter.alertFromSWS(
          this.$translate.instant('email_tab_table_acls_error'),
          err,
          this.$scope.alerts.main,
        );
        this.$scope.resetAction();
      });
  }

  updateDnsFilter() {
    this.loading = true;
    this.WucEmails.setDnsFilter(this.$stateParams.productId, {
      mxFilter: this.selectedFilter,
      customTarget: this.customFilter.value,
    })
      .then(() =>
        this.Alerter.success(
          this.$translate.instant('emails_dns_filter_edit_success'),
          this.$scope.alerts.main,
        ),
      )
      .catch((err) =>
        this.Alerter.alertFromSWS(
          this.$translate.instant('email_tab_modal_edit_filter_error'),
          err,
          this.$scope.alerts.main,
        ),
      )
      .finally(() => {
        this.loading = false;
        this.$scope.resetAction();
      });
  }
}
