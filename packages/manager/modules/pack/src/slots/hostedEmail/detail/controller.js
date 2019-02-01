import assignIn from 'lodash/assignIn';
import filter from 'lodash/filter';
import get from 'lodash/get';
import isObject from 'lodash/isObject';
import map from 'lodash/map';
import snakeCase from 'lodash/snakeCase';

export default class {
  /* @ngInject */
  constructor(
    $q,
    $stateParams,
    $state,
    $http,
    $translate,
    TucToast,
    OvhApiPackXdsl,
  ) {
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.$state = $state;
    this.$http = $http;
    this.$translate = $translate;
    this.TucToast = TucToast;
    this.OvhApiPackXdsl = OvhApiPackXdsl;


    this.askForDelete = false;
    this.accountDeleting = false;
  }

  $onInit() {
    this.loading = true;

    this.passwordRules = [
      {
        id: 'length',
        caption: this.$translate.instant('hosted_email_detail_change_password_rule_size'),
        validator(str) {
          return str && str.length > 7 && str.length < 21;
        },
      },
      {
        id: 'specialChar',
        caption: this.$translate.instant('hosted_email_detail_change_password_rule_special', { list: '#{}()[]-|@=*+/!:;' }),
        validator: /^[\w~"#'\{\}\(\\)[\]\-\|\\^@=\*\+\/!:;.,?<>%*µÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ]+$/, // eslint-disable-line
        immediateWarning: true,
      },
    ];

    assignIn(this, this.$stateParams);
    return this.$q.all([
      this.loadConfiguration(),
      this.getAccount(),
      this.loadPackInfo(),
    ]).finally(() => {
      this.loading = false;
    });
  }

  toHuman(valueParam) {
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

  loadPackInfo() {
    return this.OvhApiPackXdsl
      .Aapi()
      .get({
        packId: this.$stateParams.packName,
      })
      .$promise
      .then((packInfo) => {
        this.pack = packInfo.general;
        return this.pack;
      });
  }

  /**
   * Load detaild of the hosted email account
   * @return {Promise}
   */
  loadConfiguration() {
    const params = encodeURIComponent(JSON.stringify({
      emailAddress: this.$stateParams.serviceName,
    }));
    return this.$http
      .get(`/emails/trunk/ws.dispatcher/getConfigurationInfo?params=${params}`, {
        serviceType: 'ws',
      })
      .then((response) => {
        if (get(response, 'data.error')) {
          this.TucToast.error(this.$translate.instant('hosted_email_detail_loading_error'));
          return this.$q.reject();
        }
        this.configuration = get(response, 'data.answer');
        this.configuration.services = filter(
          map(
            this.configuration.services,
            (service, type) => (isObject(service) ? assignIn({ type }, service) : false),
          ),
          service => isObject(service),
        );

        this.configuration.type = {
          value: this.configuration.type,
          label: this.$translate.instant(`hosted_email_detail_${snakeCase(this.configuration.type)}`),
        };
        this.configuration.status = {
          value: this.configuration.status,
          label: this.configuration.status ? this.$translate.instant('hosted_email_detail_active') : this.$translate.instant('hosted_email_detail_inactive'),
          icon: this.configuration.status ? 'ovh-font ovh-font-filled-check text-success' : 'ovh-font ovh-font-filled-error text-warning',
        };
        return this.configuration;
      })
      .catch((err) => {
        this.TucToast.error(this.$translate.instant('hosted_email_detail_loading_error'));
        return this.$q.reject(err);
      });
  }

  /**
   * Get account information
   * @return {Promise}
   */
  getAccount() {
    const params = encodeURIComponent(JSON.stringify({
      account: {
        primaryEmailAddress: this.$stateParams.serviceName,
      },
    }));
    return this.$http
      .get(`/managedServices/linuxmail/individual/trunk/ws.dispatcher/getAccount?params=${params}`, {
        serviceType: 'ws',
      })
      .then((response) => {
        if (get(response, 'data.error')) {
          this.TucToast.error(this.$translate.instant('hosted_email_detail_loading_error'));
          return this.$q.reject();
        }
        this.account = get(response, 'data.answer');
        this.account.quota = this.toHuman(this.account.quota);
        this.account.size = this.toHuman(this.account.size);
        return this.account;
      })
      .catch((err) => {
        this.TucToast.error(this.$translate.instant('hosted_email_detail_loading_error'));
        return this.$q.reject(err);
      });
  }

  /**
   * Change the password
   * @return {Promise}
   */
  changePassword() {
    this.changingPassword = true;
    const params = encodeURIComponent(JSON.stringify({
      account: {
        primaryEmailAddress: this.$stateParams.serviceName,
        password: this.password,
      },
    }));
    return this.$http
      .get(`/managedServices/linuxmail/individual/trunk/ws.dispatcher/updateAccount?params=${params}`, {
        serviceType: 'ws',
      })
      .then((response) => {
        if (get(response, 'data.answer.status') === 'done') {
          this.TucToast.success(this.$translate.instant('hosted_email_detail_change_password_success', { email: this.$stateParams.serviceName }));
          return this.$state.go('pack');
        }
        const msg = get(response, 'data.error.message') || '';
        this.TucToast.error([this.$translate.instant('hosted_email_detail_change_password_error'), msg].join(' '));
        return this.$q.reject(response.data);
      })
      .catch((err) => {
        this.TucToast.error(this.$translate.instant('hosted_email_detail_change_password_error'));
        return this.$q.reject(err);
      })
      .finally(() => {
        this.changingPassword = false;
      });
  }

  static getStrength(val) {
    return (val.length - 8) / 12;
  }

  /*= =====================================
  =            DELETE ACCOUNT            =
  ====================================== */

  onDeleteAccountConfirmClick() {
    this.accountDeleting = true;

    const params = encodeURIComponent(JSON.stringify({
      primaryEmailAddress: this.$stateParams.serviceName,
    }));

    return this.$http
      .get(`/managedServices/linuxmail/individual/trunk/ws.dispatcher/suspendAccount?params=${params}`, {
        serviceType: 'ws',
      })
      .then((response) => {
        if (get(response, 'data.answer.status') === 'done' || get(response, 'data.answer.status') === 'pending') {
          this.TucToast.success(this.$translate.instant('hosted_email_detail_client_delete_account_success', { email: this.$stateParams.serviceName }));
          return this.$state.go('pack');
        }
        const msg = get(response, 'data.error.message') || '';
        return this.TucToast.error([this.$translate.instant('hosted_email_detail_client_delete_account_error'), msg].join(' '));
      })
      .catch((err) => {
        this.TucToast.error(this.$translate.instant('hosted_email_detail_client_delete_account_error'));
        return this.$q.reject(err);
      })
      .finally(() => {
        this.accountDeleting = false;
        this.askForDelete = false;
      });
  }
}
