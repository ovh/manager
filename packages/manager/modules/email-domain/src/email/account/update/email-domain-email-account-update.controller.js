import get from 'lodash/get';
import punycode from 'punycode';

const exchangeOrderGuides = {
  EU: {
    CZ: 'https://www.ovh.cz/emails/hosted-exchange-2013/',
    DE: 'https://www.ovh.de/emails/hosted-exchange/',
    ES: 'https://www.ovh.es/emails/hosted-exchange/',
    FI: 'https://www.ovh-hosting.fi/sahkopostit/hosted-exchange/',
    FR: 'https://www.ovh.com/fr/emails/hosted-exchange/',
    GB: 'https://www.ovh.co.uk/emails/hosted-exchange/',
    IT: 'https://www.ovh.it/emails/hosted-exchange/',
    LT: 'https://www.ovh.lt/El_pastas/hosted-exchange/',
    NL: 'https://www.ovh.nl/emails/hosted-exchange/',
    PL: 'https://www.ovh.pl/emaile/hosted-exchange/',
    PT: 'https://www.ovh.pt/emails/hosted-exchange-2013/',
  },
  CA: {
    ASIA: 'https://www.ovh.com/us/emails/hosted-exchange/',
    AU: 'https://www.ovh.com/us/emails/hosted-exchange/',
    CA: 'https://www.ovh.com/ca/en/emails/hosted-exchange/',
    QC: 'https://www.ovh.com/ca/fr/emails/hosted-exchange/',
    SG: 'https://www.ovh.com/us/emails/hosted-exchange/',
    WE: 'https://www.ovh.com/us/emails/hosted-exchange/',
    WS: 'https://www.ovh.com/us/emails/hosted-exchange/',
  },
};

export default class EmailsUpdateAccountCtrl {
  /* @ngInject */
  constructor(
    $scope,
    $stateParams,
    $translate,
    coreConfig,
    Alerter,
    WucEmails,
    WucUser,
  ) {
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.coreConfig = coreConfig;
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

    this.exchangeOrderUrl = null;
    if (this.coreConfig.isRegion('EU')) {
      this.exchangeOrderUrl = get(
        exchangeOrderGuides.EU,
        this.coreConfig.getUser().ovhSubsidiary,
        exchangeOrderGuides.EU.FR,
      );
    } else if (this.coreConfig.isRegion('CA')) {
      this.exchangeOrderUrl = get(
        exchangeOrderGuides.CA,
        this.coreConfig.getUser().ovhSubsidiary,
        exchangeOrderGuides.CA.CA,
      );
    }

    this.guideMigrate = null;
    if (this.coreConfig.isRegion('EU')) {
      this.guideMigrate =
        'https://docs.ovh.com/fr/microsoft-collaborative-solutions/migration-adresse-e-mail-mutualisee-vers-exchange/';
    }

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
