angular.module('managerApp').controller('PackHostedEmailDetailCtrl', function ($q, $stateParams, $state, $http, $translate, TucToast, OvhApiPackXdsl) {
  const self = this;

  self.askForDelete = false;
  self.accountDeleting = false;

  function toHuman(valueParam) {
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
      unit: $translate.instant(units[index]),
    };
  }

  /**
   * Load pack information
   * @return {Promise}
   */
  this.loadPackInfo = function () {
    return OvhApiPackXdsl.Aapi().get({
      packId: $stateParams.packName,
    }).$promise.then((packInfo) => {
      self.pack = packInfo.general;
      return self.pack;
    });
  };

  /**
   * Load detaild of the hosted email account
   * @return {Promise}
   */
  this.loadConfiguration = function () {
    const params = encodeURIComponent(JSON.stringify({
      emailAddress: $stateParams.serviceName,
    }));
    return $http.get(`/emails/trunk/ws.dispatcher/getConfigurationInfo?params=${params}`, {
      serviceType: 'ws',
    }).then((response) => {
      if (_.get(response, 'data.error')) {
        TucToast.error($translate.instant('hosted_email_detail_loading_error'));
        return $q.reject();
      }
      self.configuration = _.get(response, 'data.answer');
      self.configuration.services = _.chain(self.configuration.services)
        .map((service, type) => (_.isObject(service) ? _.extend({ type }, service) : false))
        .filter(service => _.isObject(service))
        .value();
      self.configuration.type = {
        value: self.configuration.type,
        label: $translate.instant(`hosted_email_detail_${_.snakeCase(self.configuration.type)}`),
      };
      self.configuration.status = {
        value: self.configuration.status,
        label: self.configuration.status ? $translate.instant('hosted_email_detail_active') : $translate.instant('hosted_email_detail_inactive'),
        icon: self.configuration.status ? 'ovh-font ovh-font-filled-check text-success' : 'ovh-font ovh-font-filled-error text-warning',
      };
      return self.configuration;
    }).catch((err) => {
      TucToast.error($translate.instant('hosted_email_detail_loading_error'));
      return $q.reject(err);
    });
  };

  /**
   * Get account information
   * @return {Promise}
   */
  this.getAccount = function () {
    const params = encodeURIComponent(JSON.stringify({
      account: {
        primaryEmailAddress: $stateParams.serviceName,
      },
    }));
    return $http.get(`/managedServices/linuxmail/individual/trunk/ws.dispatcher/getAccount?params=${params}`, {
      serviceType: 'ws',
    }).then((response) => {
      if (_.get(response, 'data.error')) {
        TucToast.error($translate.instant('hosted_email_detail_loading_error'));
        return $q.reject();
      }
      self.account = _.get(response, 'data.answer');
      self.account.quota = toHuman(self.account.quota);
      self.account.size = toHuman(self.account.size);
      return self.account;
    }).catch((err) => {
      TucToast.error($translate.instant('hosted_email_detail_loading_error'));
      return $q.reject(err);
    });
  };

  /**
   * Change the password
   * @return {Promise}
   */
  this.changePassword = function () {
    this.changingPassword = true;
    const params = encodeURIComponent(JSON.stringify({
      account: {
        primaryEmailAddress: $stateParams.serviceName,
        password: this.password,
      },
    }));
    return $http.get(`/managedServices/linuxmail/individual/trunk/ws.dispatcher/updateAccount?params=${params}`, {
      serviceType: 'ws',
    }).then((response) => {
      if (_.get(response, 'data.answer.status') === 'done') {
        TucToast.success($translate.instant('hosted_email_detail_change_password_success', { email: $stateParams.serviceName }));
        return $state.go('telecom.pack');
      }
      const msg = _.get(response, 'data.error.message') || '';
      TucToast.error([$translate.instant('hosted_email_detail_change_password_error'), msg].join(' '));
      return $q.reject(response.data);
    }).catch((err) => {
      TucToast.error($translate.instant('hosted_email_detail_change_password_error'));
      return $q.reject(err);
    }).finally(() => {
      self.changingPassword = false;
    });
  };

  this.getStrength = function (val) {
    return (val.length - 8) / 12;
  };

  /*= =====================================
  =            DELETE ACCOUNT            =
  ====================================== */

  self.onDeleteAccountConfirmClick = function () {
    self.accountDeleting = true;

    const params = encodeURIComponent(JSON.stringify({
      primaryEmailAddress: $stateParams.serviceName,
    }));

    return $http.get(`/managedServices/linuxmail/individual/trunk/ws.dispatcher/suspendAccount?params=${params}`, {
      serviceType: 'ws',
    }).then((response) => {
      if (_.get(response, 'data.answer.status') === 'done' || _.get(response, 'data.answer.status') === 'pending') {
        TucToast.success($translate.instant('hosted_email_detail_client_delete_account_success', { email: $stateParams.serviceName }));
        return $state.go('telecom.pack');
      }
      const msg = _.get(response, 'data.error.message') || '';
      return TucToast.error([$translate.instant('hosted_email_detail_client_delete_account_error'), msg].join(' '));
    }).catch((err) => {
      TucToast.error($translate.instant('hosted_email_detail_client_delete_account_error'));
      return $q.reject(err);
    }).finally(() => {
      self.accountDeleting = false;
      self.askForDelete = false;
    });
  };

  /* -----  End of DELETE ACCOUNT  ------*/

  /**
   * Controller Initialization
   */
  this.$onInit = function () {
    this.loading = true;

    this.passwordRules = [
      {
        id: 'length',
        caption: $translate.instant('hosted_email_detail_change_password_rule_size'),
        validator(str) {
          return str && str.length > 7 && str.length < 21;
        },
      },
      {
        id: 'specialChar',
        caption: $translate.instant('hosted_email_detail_change_password_rule_special', { list: '#{}()[]-|@=*+/!:;' }),
        validator: /^[\w~"#'\{\}\(\\)[\]\-\|\\^@=\*\+\/!:;.,?<>%*µÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ]+$/, // eslint-disable-line
        immediateWarning: true,
      },
    ];

    _.extend(this, $stateParams);
    return $q.all([
      this.loadConfiguration(),
      this.getAccount(),
      this.loadPackInfo(),
    ]).finally(() => {
      self.loading = false;
    });
  };
});
