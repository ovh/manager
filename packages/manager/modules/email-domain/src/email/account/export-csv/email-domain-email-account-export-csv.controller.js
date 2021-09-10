import at from 'lodash/at';
import get from 'lodash/get';
import keys from 'lodash/keys';
import map from 'lodash/map';

export default class EmailsAccountsToCsvCtrl {
  /* @ngInject */
  constructor(
    $scope,
    $interval,
    $q,
    $stateParams,
    $translate,
    Alerter,
    WucEmails,
    exportCsv,
  ) {
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

    let emailsPromise;
    if (delegated) {
      emailsPromise = this.WucEmails.getDelegatedEmails(
        this.$stateParams.productId,
      );
    } else {
      emailsPromise = this.WucEmails.getEmails(this.$stateParams.productId, {});
    }

    return emailsPromise.then((emails) => {
      let currentPull = 0;
      const requestsCount = 200;
      let quit = false;
      const requests = map(emails, (id) =>
        delegated
          ? this.WucEmails.getDelegatedEmail(id)
          : this.WucEmails.getEmail(this.$stateParams.productId, id),
      );

      this.intervalPromise = this.$interval(() => {
        const pull = requests.slice(
          currentPull * requestsCount,
          currentPull * requestsCount + requestsCount,
        );
        currentPull += 1;

        if (pull.length <= 0) {
          quit = true;
          this.$interval.cancel(this.intervalPromise);
          return null;
        }

        return this.$q
          .all(pull)
          .then((accounts) => {
            const headerArray = keys(accounts[0]);
            const header = `${keys(accounts[0]).join(';')};`;
            const content = map(
              accounts,
              (account) => `${at(account, headerArray).join(';')};`,
            ).join('\n');

            if (content && (emails.length < requestsCount || quit)) {
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
            }
          })
          .catch((err) =>
            this.Alerter.alertFromSWS(
              this.$translate.instant(
                'email_tab_modal_accounts_export_csv_error',
              ),
              err,
              this.$scope.alerts.main,
            ),
          )
          .finally(() => {
            this.loading.exportCsv = false;
            this.$scope.resetAction();
          });
      }, 200);
    });
  }
}
