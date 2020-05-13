import assignIn from 'lodash/assignIn';
import filter from 'lodash/filter';
import isObject from 'lodash/isObject';
import map from 'lodash/map';
import snakeCase from 'lodash/snakeCase';

import { PASSWORD_VALIDATOR } from './detail.constant';

export default class PackHostedEmailDetailCtrl {
  /* @ngInject */
  constructor(
    $q,
    $state,
    $http,
    $translate,
    TucToast,
    OvhApiPackXdsl,
    OvhApiPackXdslHostedEmail,
  ) {
    this.$q = $q;
    this.$state = $state;
    this.$http = $http;
    this.$translate = $translate;
    this.TucToast = TucToast;
    this.OvhApiPackXdsl = OvhApiPackXdsl;
    this.OvhApiPackXdslHostedEmail = OvhApiPackXdslHostedEmail;
  }

  $onInit() {
    this.askForDelete = false;
    this.accountDeleting = false;
    this.loading = true;

    this.passwordRules = [
      {
        id: 'length',
        caption: this.$translate.instant(
          'hosted_email_detail_change_password_rule_size',
        ),
        validator(str) {
          return str && str.length > 7 && str.length < 21;
        },
      },
      {
        id: 'specialChar',
        caption: this.$translate.instant(
          'hosted_email_detail_change_password_rule_special',
          { list: '#{}()[]-|@=*+/!:;' },
        ),
        validator: PASSWORD_VALIDATOR,
        immediateWarning: true,
      },
    ];

    return this.$q
      .all([this.loadConfiguration(), this.getAccount(), this.loadPackInfo()])
      .finally(() => {
        this.loading = false;
      });
  }

  convertToReadableValue(valueParam) {
    let value = valueParam;
    const orig = value;
    const units = [
      'hosted_email_detail_byte',
      'hosted_email_detail_Kb',
      'hosted_email_detail_Mb',
      'hosted_email_detail_Gb',
      'hosted_email_detail_Tb',
    ];
    let index = 0;
    while (value / 1024 > 1 && index < units.length) {
      value /= 1024;
      index += 1;
    }
    return {
      raw: orig,
      human: Math.round(value * 10) / 10,
      unit: this.$translate.instant(units[index]),
    };
  }

  /**
   * Load pack information
   * @return {Promise}
   */
  loadPackInfo() {
    return this.OvhApiPackXdsl.Aapi()
      .get({
        packId: this.packName,
      })
      .$promise.then((packInfo) => {
        this.pack = packInfo.general;
        return this.pack;
      });
  }

  /**
   * Load detail of the hosted email account
   * @return {Promise}
   */
  loadConfiguration() {
    return this.OvhApiPackXdslHostedEmail.v6()
      .getConfig({
        packId: this.packName,
        domain: this.serviceName,
      })
      .$promise.then((config) => {
        this.configuration = config;

        this.configuration.services = filter(
          map(this.configuration.services, (service, type) =>
            isObject(service) ? assignIn({ type }, service) : false,
          ),
          (service) => isObject(service),
        );
        this.configuration.status = {
          value: this.configuration.status,
          label: this.configuration.status
            ? this.$translate.instant('hosted_email_detail_active')
            : this.$translate.instant('hosted_email_detail_inactive'),
          icon: this.configuration.status
            ? 'ovh-font ovh-font-filled-check text-success'
            : 'ovh-font ovh-font-filled-error text-warning',
        };
        return this.configuration;
      })
      .catch(() => {
        this.TucToast.error(
          this.$translate.instant('hosted_email_detail_loading_error'),
        );
      });
  }

  /**
   * Get account information
   * @return {Promise}
   */
  getAccount() {
    return this.OvhApiPackXdslHostedEmail.v6()
      .getAccount({
        packId: this.packName,
        domain: this.serviceName,
      })
      .$promise.then((account) => {
        this.account = account;
        this.account.offer = {
          value: this.account.offer,
          label: this.$translate.instant(
            `hosted_email_detail_${snakeCase(this.account.offer)}`,
          ),
        };
        this.account.quota = this.convertToReadableValue(account.quota.value);
        this.account.size = this.convertToReadableValue(account.size.value);
        return this.account;
      })
      .catch(() => {
        this.TucToast.error(
          this.$translate.instant('hosted_email_detail_loading_error'),
        );
      });
  }

  /**
   * Change the password
   * @return {Promise}
   */
  changePassword() {
    this.changingPassword = true;
    return this.OvhApiPackXdslHostedEmail.v6()
      .changePassword(
        {
          packId: this.packName,
          domain: this.serviceName,
        },
        {
          password: this.password,
        },
      )
      .$promise.then(() => {
        this.TucToast.success(
          this.$translate.instant(
            'hosted_email_detail_change_password_success',
            { email: this.serviceName },
          ),
        );
        return this.$state.go('telecom.packs.pack');
      })
      .catch(() => {
        this.TucToast.error(
          this.$translate.instant('hosted_email_detail_change_password_error'),
        );
      })
      .finally(() => {
        this.changingPassword = false;
      });
  }

  static getPasswordStrength(val) {
    return (val.length - 8) / 12;
  }

  /* =====================================
     =         DELETE ACCOUNT            =
     ===================================== */
  onDeleteAccountConfirmClick() {
    this.accountDeleting = true;

    return this.OvhApiPackXdslHostedEmail.v6()
      .delete({
        packId: this.packName,
        domain: this.serviceName,
      })
      .$promise.then(() => {
        this.TucToast.success(
          this.$translate.instant(
            'hosted_email_detail_client_delete_account_success',
            { email: this.serviceName },
          ),
        );
        return this.$state.go('telecom.packs.pack');
      })
      .catch((error) => {
        this.TucToast.error(
          this.$translate.instant(
            'hosted_email_detail_client_delete_account_error',
          ),
        );
        return this.$q.reject(error);
      })
      .finally(() => {
        this.accountDeleting = false;
        this.askForDelete = false;
      });
  }

  /* -----  End of DELETE ACCOUNT  ------*/
}
