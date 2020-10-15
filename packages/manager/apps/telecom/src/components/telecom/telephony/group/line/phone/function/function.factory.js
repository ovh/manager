import keys from 'lodash/keys';

export default /* @ngInject */ ($q, OvhApiTelephony) => {
  const mandatoriesPhoneFunctionOptions = ['billingAccount', 'serviceName'];
  let mandatoryNb;

  /*= ==================================
        =            CONSTRUCTOR            =
        =================================== */

  function TelephonyGroupLineFunctionPhone(
    mandatoryOptions,
    phoneFunctionOptionsParam,
  ) {
    let phoneFunctionOptions = phoneFunctionOptionsParam;

    mandatoryNb = mandatoriesPhoneFunctionOptions.length;
    if (!mandatoryOptions) {
      throw new Error(
        'mandatory options must be specified when creating a new TelephonyGroupLineFunctionPhone',
      );
    } else {
      // eslint-disable-next-line no-plusplus
      for (mandatoryNb; mandatoryNb--; ) {
        if (!mandatoryOptions[mandatoriesPhoneFunctionOptions[mandatoryNb]]) {
          // check mandatory attributes
          throw new Error(
            `${mandatoriesPhoneFunctionOptions[mandatoryNb]} option must be specified when creating a new TelephonyGroupLineFunctionPhone`,
          );
        } else {
          // set mandatory attributes
          this[mandatoriesPhoneFunctionOptions[mandatoryNb]] =
            mandatoryOptions[mandatoriesPhoneFunctionOptions[mandatoryNb]];
        }
      }
    }

    if (!phoneFunctionOptions) {
      phoneFunctionOptions = {};
    }

    this.function = null;
    this.label = null;
    this.default = null;
    this.type = null;
    this.keyNum = null;

    this.setPhoneFunctionInfos(phoneFunctionOptions);
  }

  /* -----  End of CONSTRUCTOR  ------*/

  /*= ========================================
    =            PROTOTYPE METHODS            =
    ========================================= */

  /* ----------  FEATURE OPTIONS  ----------*/

  TelephonyGroupLineFunctionPhone.prototype.setPhoneFunctionInfos = function setPhoneFunctionInfos(
    phoneFunctionOptions,
  ) {
    const self = this;

    angular.forEach(keys(phoneFunctionOptions), (phoneFunctionOptionsKey) => {
      if (phoneFunctionOptionsKey.indexOf('$') !== 0) {
        self[phoneFunctionOptionsKey] =
          phoneFunctionOptions[phoneFunctionOptionsKey];
      }
    });

    return self;
  };

  TelephonyGroupLineFunctionPhone.prototype.getAvailableFunctions = function getAvailableFunctions() {
    const self = this;
    return OvhApiTelephony.Line()
      .Phone()
      .FunctionKey()
      .v6()
      .availableFunctions({
        billingAccount: self.billingAccount,
        serviceName: self.serviceName,
        keyNum: self.keyNum,
      })
      .$promise.then(
        (availableFunction) => availableFunction,
        (error) => {
          const message = error.data && error.data.message;
          return $q.reject(message);
        },
      );
  };

  TelephonyGroupLineFunctionPhone.prototype.save = function save() {
    const self = this;

    return OvhApiTelephony.Line()
      .Phone()
      .FunctionKey()
      .v6()
      .save(
        {
          billingAccount: self.billingAccount,
          serviceName: self.serviceName,
          keyNum: self.keyNum,
        },
        {
          function: self.function,
          parameter: self.parameter,
        },
      )
      .$promise.then(
        (availableFunction) => availableFunction,
        (error) => {
          const message = error.data && error.data.message;
          return $q.reject(message);
        },
      );
  };

  TelephonyGroupLineFunctionPhone.prototype.getFunctions = function getFunctions() {
    const self = this;
    const resultKeys = [];
    const requests = [];

    return OvhApiTelephony.Line()
      .Phone()
      .FunctionKey()
      .v6()
      .query({
        billingAccount: self.billingAccount,
        serviceName: self.serviceName,
      })
      .$promise.then(
        (functionKeys) => {
          angular.forEach(functionKeys, (key) => {
            requests.push(
              OvhApiTelephony.Line()
                .Phone()
                .FunctionKey()
                .v6()
                .get({
                  billingAccount: self.billingAccount,
                  serviceName: self.serviceName,
                  keyNum: key,
                })
                .$promise.then(
                  (functionKey) => {
                    resultKeys.push(functionKey);
                    return resultKeys;
                  },
                  () => resultKeys,
                ),
            );
          });

          return $q
            .all(requests)
            .then(
              () => resultKeys,
              () => resultKeys,
            )
            .finally(() => resultKeys);
        },
        () => $q.when(resultKeys),
      );
  };

  return TelephonyGroupLineFunctionPhone;
};
