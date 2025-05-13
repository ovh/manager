import angular from 'angular';

export default /* @ngInject */ function(
  $q,
  OvhApiSms,
  TucSmsService,
  TUC_SMS_REGEX,
  TUC_SMS_STOP_CLAUSE,
) {
  const self = this;
  let currentSms = null;
  const smsText = {
    coding: '7bit',
    defaultSize: 160,
    remainingCharacters: null,
    equivalence: null,
    threshold: null,
    maxlength: null,
  };

  self.smsServices = {}; // access to TucSmsService by name
  self.initDeferred = null;
  self.apiScheme = null;

  self.getApiScheme = function getApiScheme() {
    if (!self.apiScheme) {
      return OvhApiSms.v6()
        .schema()
        .$promise.then((scheme) => {
          self.apiScheme = scheme;
          return self.apiScheme;
        });
    }
    return $q.when(self.apiScheme);
  };

  /*= ============================
        =         SMS SERVICE         =
        ============================= */

  self.getAccounts = function getAccounts() {
    return self.smsServices;
  };

  /* ----------  CURRENT SMS SERVICE  ----------*/

  self.setCurrentSmsService = function setCurrentSmsService(smsService) {
    currentSms = smsService;
    return currentSms;
  };

  self.getCurrentSmsService = function getCurrentSmsService() {
    if (!currentSms) {
      throw new Error('SMS service is not set');
    }
    return currentSms;
  };

  /* ----------  ACTIONS  ----------*/

  function addSmsService(smsOptions) {
    const addedSms = new TucSmsService(smsOptions);

    if (!self.smsServices[addedSms.name]) {
      self.smsServices[addedSms.name] = addedSms;
      return addedSms;
    }
    return null;
  }

  /* -----  End of SMS SERVICE  ------*/

  /*= ========================================
        =            GET SMS INFO TEXT            =
        ========================================= */

  self.getSmsInfoText = function getSmsInfoText(
    messageParam,
    suffix,
    threshold,
  ) {
    const message = messageParam || '';
    smsText.threshold = threshold || 255;

    const length =
      message.length + (suffix ? TUC_SMS_STOP_CLAUSE.value.length : 0);

    if (message.match(TUC_SMS_REGEX.default7bitGSMAlphabet)) {
      smsText.coding = '7bit';
      if (length <= 160) {
        smsText.defaultSize = 160;
        smsText.equivalence = 1;
        smsText.remainingCharacters = smsText.defaultSize - length;
      } else if (length > 160 && length <= 306) {
        smsText.defaultSize = 146;
        smsText.equivalence = 2;
        smsText.remainingCharacters = 306 - length;
      } else {
        smsText.defaultSize = 153;
        smsText.equivalence = Math.ceil(length / smsText.defaultSize);
        smsText.remainingCharacters =
          smsText.defaultSize * smsText.equivalence - length;
      }
    } else {
      smsText.coding = '8bit';
      if (length <= 70) {
        smsText.defaultSize = 70;
        smsText.equivalence = 1;
        smsText.remainingCharacters = smsText.defaultSize - length;
      } else if (length > 70 && length <= 134) {
        smsText.defaultSize = 64;
        smsText.equivalence = 2;
        smsText.remainingCharacters = 134 - length;
      } else {
        smsText.defaultSize = 67;
        smsText.equivalence = Math.ceil(length / smsText.defaultSize);
        smsText.remainingCharacters =
          smsText.defaultSize * smsText.equivalence - length;
      }
    }

    if (smsText.equivalence > smsText.threshold) {
      if (smsText.coding === '7bit') {
        smsText.maxlength = (smsText.threshold - 1) * 153 + 160;
      } else {
        smsText.maxlength = (smsText.threshold - 1) * 64 + 70;
      }
      smsText.maxLengthReached = true;
    } else {
      smsText.maxlength = null;
      smsText.maxLengthReached = false;
    }

    return smsText;
  };

  /* -----  End of GET SMS INFO TEXT  ------*/

  /*= =====================================
        =            INITIALIZATION            =
        ====================================== */

  self.initAll = function initAll(force) {
    if (self.initDeferred && !force) {
      return self.initDeferred.promise;
    }

    self.initDeferred = $q.defer();

    OvhApiSms.v6()
      .query()
      .$promise.then((smsIds) =>
        OvhApiSms.Aapi()
          .detail({
            smsIds,
          })
          .$promise.then((smsDetails) => {
            angular.forEach(smsDetails, (smsDetail) => {
              addSmsService(smsDetail);
            });

            self.initDeferred.resolve(self.smsServices);
          }),
      );

    return self.initDeferred.promise;
  };

  /* -----  End of INITIALIZATION  ------*/
}
