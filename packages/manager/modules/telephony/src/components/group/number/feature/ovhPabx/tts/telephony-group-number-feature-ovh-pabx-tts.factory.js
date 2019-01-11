angular.module('managerApp').run(($translate, asyncLoader) => {
  asyncLoader.addTranslations(
    import(`./translations/Messages_${$translate.use()}.xml`)
      .catch(() => import(`./translations/Messages_${$translate.fallbackLanguage()}.xml`))
      .then(x => x.default),
  );
  $translate.refresh();
});
angular.module('managerApp').factory('TelephonyGroupNumberOvhPabxTts', ($q, OvhApiTelephony) => {
  /*= ==================================
    =            CONSTRUCTOR            =
    =================================== */

  function TelephonyGroupNumberOvhPabxTts(ttsOptionsParam) {
    let ttsOptions = ttsOptionsParam;

    if (!ttsOptions) {
      ttsOptions = {};
    }

    // check for mandatory options
    if (!ttsOptions.billingAccount) {
      throw new Error('billingAccount option must be specified when creating a new TelephonyGroupNumberOvhPabxTts');
    }

    if (!ttsOptions.serviceName) {
      throw new Error('serviceName option must be specified when creating a new TelephonyGroupNumberOvhPabxTts');
    }

    // set mandatory attributes
    this.billingAccount = ttsOptions.billingAccount;
    this.serviceName = ttsOptions.serviceName;

    // other attributes
    this.id = ttsOptions.id || _.random(_.now());
    this.voice = null;
    this.text = null;

    // custom attributes
    this.inEdition = false;
    this.saveForEdition = null;
    this.status = null;

    this.setOptions(ttsOptions);
  }

  /* -----  End of CONSTRUCTOR  ------*/

  /*= ========================================
    =            PROTOTYPE METHODS            =
    ========================================= */

  TelephonyGroupNumberOvhPabxTts.prototype.setOptions = function (ttsOptions) {
    const self = this;

    self.voice = _.get(ttsOptions, 'voice', 'Helene');
    self.text = _.get(ttsOptions, 'text', '');

    return self;
  };

  /* ----------  API CALLS  ----------*/

  TelephonyGroupNumberOvhPabxTts.prototype.create = function () {
    const self = this;

    self.status = 'CREATING';

    return OvhApiTelephony.OvhPabx().Tts().v6().create({
      billingAccount: self.billingAccount,
      serviceName: self.serviceName,
    }, {
      voice: self.voice,
      text: self.text,
    }).$promise.then((ttsOptions) => {
      self.id = ttsOptions.id;
      self.status = 'OK';
      return self;
    }).catch((error) => {
      // if creation fail - back to DRAFT status
      self.status = 'DRAFT';
      return $q.reject(error);
    });
  };

  TelephonyGroupNumberOvhPabxTts.prototype.remove = function () {
    const self = this;

    self.status = 'DELETING';

    return OvhApiTelephony.OvhPabx().Tts().v6().remove({
      billingAccount: self.billingAccount,
      serviceName: self.serviceName,
      id: self.id,
    }).$promise.catch((error) => {
      self.status = 'OK';
      return $q.reject(error);
    });
  };

  /* ----------  EDITION  ----------*/

  TelephonyGroupNumberOvhPabxTts.prototype.startEdition = function () {
    const self = this;

    self.inEdition = true;
    self.saveForEdition = {
      voice: angular.copy(self.voice),
      text: angular.copy(self.text),
    };

    return self;
  };

  TelephonyGroupNumberOvhPabxTts.prototype.stopEdition = function (cancel) {
    const self = this;

    if (self.saveForEdition && cancel) {
      self.voice = self.saveForEdition.voice;
      self.text = self.saveForEdition.text;
    }

    self.saveForEdition = null;
    self.inEdition = false;

    return self;
  };

  TelephonyGroupNumberOvhPabxTts.prototype.hasChange = function (attr) {
    const self = this;

    if (!self.inEdition || !self.saveForEdition) {
      return false;
    }

    if (attr) {
      return !_.isEqual(_.get(self.saveForEdition, attr), _.get(self, attr));
    }
    return self.hasChange('voice') || self.hasChange('text');
  };

  /* -----  End of PROTOTYPE METHODS  ------*/

  return TelephonyGroupNumberOvhPabxTts;
});
