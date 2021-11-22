import findIndex from 'lodash/findIndex';
import get from 'lodash/get';
import trim from 'lodash/trim';
import punycode from 'punycode';

import guides from './email-domain-email-account-guides';

export default class EmailsCreateAccountCtrl {
  /* @ngInject */
  constructor(
    $scope,
    $q,
    $stateParams,
    $translate,
    coreConfig,
    Alerter,
    WucEmails,
    WucUser,
  ) {
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$q = $q;
    this.$translate = $translate;
    this.coreConfig = coreConfig;
    this.Alerter = Alerter;
    this.WucEmails = WucEmails;
    this.WucUser = WucUser;
  }

  createGuide(deviceName, guideName, guideUrl, logo) {
    const guide = {
      guideName,
      guideUrl,
    };
    const idxDevice = findIndex(this.devices, { deviceName });

    if (idxDevice >= 0) {
      this.devices[idxDevice].guides.push(guide);
    } else {
      this.devices.push({
        deviceName,
        guides: [guide],
        logo,
      });
    }
  }

  setGuideByName(deviceName) {
    const idxDevice = findIndex(this.devices, { deviceName });

    if (idxDevice >= 0) {
      this.currentGuide = this.devices[idxDevice];
    } else {
      this.currentGuide = {};
    }
  }

  // "MAC", "OUTLOOK", "IPHONE", "ANDROID", "OTHER"
  $onInit() {
    this.currentGuideName = 'OUTLOOK';
    this.currentGuide = {};

    this.devices = [];

    this.account = {
      accountName: '',
      description: '',
      password: '',
      size: 5000000000,
    };
    this.allowedAccountSize = [];
    this.constants = {
      descMaxLength: 32,
      descRegexPattern: /^[^:§⁼]*$/,
      nameMaxLength: 32,
      nameMinLength: 2,
      nameRegexPattern: /^\w+[\w.-]+\w*$/,
      passwordMaxLength: 30,
      passwordMinLength: 9,
    };
    this.domain = this.$stateParams.productId;
    this.guides = {};
    this.loading = { accountSize: false };
    this.validation = {
      password: '',
      postmaster: false,
    };

    this.$scope.createAccount = () => this.createAccount();

    const subsidiary = this.coreConfig.getUser().ovhSubsidiary;

    if (this.coreConfig.isRegion('EU')) {
      this.createGuide(
        'MAC',
        'El capitan',
        get(
          guides,
          `${subsidiary}.emailsConfigurationMacElCapitain`,
          guides.FR.emailsConfigurationMacElCapitain,
        ),
        'assets/images/logos/iOS9.png',
      );
      this.createGuide(
        'MAC',
        'Mavericks / Yosemite',
        get(
          guides,
          `${subsidiary}.emailsConfigurationMacMavericksAndYosemite`,
          guides.FR.emailsConfigurationMacMavericksAndYosemite,
        ),
        'assets/images/logos/iOS9.png',
      );
      this.createGuide(
        'MAC',
        'Mountain Lion',
        get(
          guides,
          `${subsidiary}.emailsConfigurationMacMountainLion`,
          guides.FR.emailsConfigurationMacMountainLion,
        ),
        'assets/images/logos/iOS9.png',
      );
      this.createGuide(
        'OUTLOOK',
        '2016',
        get(
          guides,
          `${subsidiary}.emailsConfigurationOutlook2016`,
          guides.FR.emailsConfigurationOutlook2016,
        ),
        'assets/images/logos/outlook2013.png',
      );
      this.createGuide(
        'OUTLOOK',
        '2013',
        get(
          guides,
          `${subsidiary}.emailsConfigurationOutlook2013`,
          guides.FR.emailsConfigurationOutlook2013,
        ),
        'assets/images/logos/outlook2013.png',
      );
      this.createGuide(
        'OUTLOOK',
        '2010',
        get(
          guides,
          `${subsidiary}.emailsConfigurationOutlook2010`,
          guides.FR.emailsConfigurationOutlook2010,
        ),
        'assets/images/logos/outlook2013.png',
      );
      this.createGuide(
        'OUTLOOK',
        '2007',
        get(
          guides,
          `${subsidiary}.emailsConfigurationOutlook2007`,
          guides.FR.emailsConfigurationOutlook2007,
        ),
        'assets/images/logos/outlook2013.png',
      );
      this.createGuide(
        'IPHONE',
        '',
        get(
          guides,
          `${subsidiary}.emailsConfigurationAuto`,
          guides.FR.emailsConfigurationAuto,
        ),
        'assets/images/logos/iOS9.png',
      );
      this.createGuide(
        'IPHONE',
        '9.1',
        get(
          guides,
          `${subsidiary}.emailsConfigurationIos9`,
          guides.FR.emailsConfigurationIos9,
        ),
        'assets/images/logos/iOS9.png',
      );
      this.createGuide(
        'ANDROID',
        '6',
        get(
          guides,
          `${subsidiary}.emailsConfigurationAndroid6`,
          guides.FR.emailsConfigurationAndroid6,
        ),
        'assets/images/logos/android.jpg',
      );
      this.createGuide(
        'OTHER',
        'ALL',
        get(
          guides,
          `${subsidiary}.emailsConfiguration`,
          guides.FR.emailsConfiguration,
        ),
        'assets/images/logos/OVH-logo.png',
      );
    }

    this.setGuideByName(this.currentGuideName);
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

  accountPasswordCheck(input) {
    input.$setValidity(
      'passwordCheck',
      !!this.account.password &&
        !/^\s/.test(this.account.password) &&
        !/\s$/.test(this.account.password) &&
        !this.account.password.match(
          /[ÂÃÄÀÁÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ]/,
        ),
    );
  }

  createAccount() {
    this.account.accountName = trim(this.account.accountName);

    this.WucEmails.createAccount(this.$stateParams.productId, this.account)
      .then(() =>
        this.Alerter.success(
          this.$translate.instant('email_tab_modal_create_account_success'),
          this.$scope.alerts.main,
        ),
      )
      .catch((err) =>
        this.Alerter.alertFromSWS(
          this.$translate.instant('email_tab_modal_create_account_error'),
          err,
          this.$scope.alerts.main,
        ),
      )
      .finally(() => this.$scope.resetAction());
  }

  getAccountSize() {
    this.loading.accountSize = true;

    this.$q
      .all({
        domain: this.WucEmails.getDomain(this.$stateParams.productId),
        quotas: this.WucEmails.getQuotas(this.$stateParams.productId),
        emails: this.WucEmails.getEmails(this.$stateParams.productId, {
          accountName: '%',
        }),
      })
      .then(({ domain, quotas, emails }) => {
        this.allowedAccountSize = domain.allowedAccountSize;

        if (
          quotas.account === emails.length &&
          emails.indexOf('postmaster') === -1
        ) {
          this.account.accountName = 'postmaster';
          this.validation.postmaster = true;
        }
      })
      .catch((err) =>
        this.Alerter.alertFromSWS(
          this.$translate.instant('email_tab_error'),
          err.data,
          this.$scope.alerts.main,
        ),
      )
      .finally(() => {
        this.loading.accountSize = false;
      });
  }

  isPasswordMatches() {
    return this.account.password === this.validation.password;
  }

  isPasswordDefined() {
    return this.account.password && this.validation.password;
  }
}
