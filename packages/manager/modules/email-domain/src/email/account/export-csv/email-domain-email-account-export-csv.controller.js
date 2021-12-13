import at from 'lodash/at';
import get from 'lodash/get';
import keys from 'lodash/keys';
import map from 'lodash/map';
import moment from 'moment';

export default class EmailsAccountsToCsvCtrl {
  /* @ngInject */
  constructor(
    $http,
    $scope,
    $interval,
    $q,
    $stateParams,
    $translate,
    Alerter,
    WucEmails,
    exportCsv,
  ) {
    this.$http = $http;
    this.$scope = $scope;
    this.$interval = $interval;
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.WucEmails = WucEmails;
    this.exportCsv = exportCsv;
  }

  $onInit() {
    this.intervalPromise = null;
    this.loading = { exportCsv: false };

    this.$scope.$on('$destroy', () => this.cancelExportPromise());
    this.$scope.cancelExport = () => this.cancelExport();
    this.$scope.exportAccounts = () => this.exportAccounts();
  }

  cancelExport() {
    this.cancelExportPromise();
    this.$scope.resetAction();
  }

  cancelExportPromise() {
    if (this.intervalPromise) {
      this.$interval.cancel(this.intervalPromise);
      this.intervalPromise = undefined;
    }
  }

  exportAccounts() {
    this.loading.exportCsv = true;
    const delegated = get(this.$scope.currentActionData, 'delegate', false);

    const headers = {
      'X-Pagination-Mode': 'CachedObjectList-Pages',
      'X-Pagination-Size': 50000,
    };

    let emailsPromise;
    if (delegated) {
      emailsPromise = this.$http.get(
        `/email/domain/delegatedAccount/${this.$stateParams.productId}/account`,
        {
          headers,
        },
      );
    } else {
      emailsPromise = this.$http.get(
        `/email/domain/${this.$stateParams.productId}/account`,
        {
          headers,
        },
      );
    }

    return emailsPromise
      .then(({ data: accounts }) => {
        const headerArray = keys(accounts[0]);
        const header = `${keys(accounts[0]).join(';')};`;
        const content = map(
          accounts,
          (account) => `${at(account, headerArray).join(';')};`,
        ).join('\n');
        const data = this.exportCsv.exportData({
          datas: [header, content].join('\n'),
          fileName: `export_emails_${moment().format(
            'YYYY-MM-DD_HH:mm:ss',
          )}.csv`,
          separator: ';',
        });
        this.Alerter.success(
          this.$translate.instant(
            'email_tab_modal_accounts_export_csv_success',
            { t0: data },
          ),
          this.$scope.alerts.main,
        );
      })
      .catch((err) =>
        this.Alerter.alertFromSWS(
          this.$translate.instant('email_tab_modal_accounts_export_csv_error'),
          err,
          this.$scope.alerts.main,
        ),
      )
      .finally(() => {
        this.loading.exportCsv = false;
        this.$scope.resetAction();
      });
  }
}
