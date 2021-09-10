import get from 'lodash/get';
import punycode from 'punycode';

export default class EmailsUpdateAccountCtrl {
  /* @ngInject */
  constructor($scope, $stateParams, $translate, Alerter, WucEmails, WucUser) {
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.WucEmails = WucEmails;
    this.WucUser = WucUser;
  }

  $onInit() {
    this.isDelegate = get(this.$scope.currentActionData, 'delegate', false);
    this.account = angular.copy(
      this.isDelegate
        ? this.$scope.currentActionData.account
        : this.$scope.currentActionData,
    );
    this.accountSize = [];
    this.constants = {
      descMaxLength: 32,
      descRegexPattern: /^[^:§⁼]*$/,
    };
    this.loading = false;

    this.$scope.updateAccount = () => this.updateAccount();

    this.WucUser.getUrlOf('exchangeOrder')
      .then((exchangeOrder) => {
        this.exchangeOrderUrl = exchangeOrder;
      })
      .catch(() => {
        this.exchangeOrderUrl = null;
      });
    this.WucUser.getUrlOf('guides')
      .then((guides) => {
        this.guideMigrate = get(guides, 'emailsMigrateToExchange');
      })
      .catch(() => {
        this.guideMigrate = null;
      });

    this.getAccountSize();
  }

  accountDescriptionCheck(input) {
    input.$setValidity(
      'descriptionCheck',
      !this.account.description ||
        punycode.toASCII(this.account.description).length <=
          this.constants.descMaxLength,
    );
  }

  getAccountSize() {
    this.loading = true;
    let accountSizePromise;

    if (this.isDelegate) {
      accountSizePromise = this.WucEmails.getDelegatedEmail(this.account.email);
    } else {
      accountSizePromise = this.WucEmails.getDomain(
        this.$stateParams.productId,
      );
    }

    return accountSizePromise
      .then((data) => {
        this.accountSize = data.allowedAccountSize;
      })
      .catch((err) =>
        this.Alerter.alertFromSWS(
          this.$translate.instant('email_tab_error'),
          get(err, 'data', err),
          this.$scope.alerts.main,
        ),
      )
      .finally(() => {
        this.loading = false;
      });
  }

  updateAccount() {
    this.loading = true;
    const data = {
      description: this.account.description
        ? punycode.toASCII(this.account.description)
        : '',
      size: this.account.size,
    };

    let accountPromise;
    if (this.isDelegate) {
      accountPromise = this.WucEmails.updateDelegatedAccount(
        this.account.email,
        data,
      );
    } else {
      accountPromise = this.WucEmails.updateAccount(
        this.$stateParams.productId,
        this.account.accountName,
        data,
      );
    }

    return accountPromise
      .then(() =>
        this.Alerter.success(
          this.$translate.instant('email_tab_modal_update_account_success'),
          this.$scope.alerts.main,
        ),
      )
      .catch((err) =>
        this.Alerter.alertFromSWS(
          this.$translate.instant('email_tab_modal_update_account_error'),
          get(err, 'data', err),
          this.$scope.alerts.main,
        ),
      )
      .finally(() => {
        this.loading = false;
        this.$scope.resetAction();
      });
  }
}
