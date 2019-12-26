import angular from 'angular';
import keys from 'lodash/keys';

export default /* @ngInject */ (OvhApiSms) => {
  /*= ==================================
    =            CONSTRUCTOR            =
    =================================== */

  function TucSmsService(optionsParam) {
    let options = optionsParam;

    if (!options) {
      options = {};
    }

    // options check
    if (!options.name) {
      throw new Error(
        'name option must be specified when creating a new TucSmsService',
      );
    }

    // mandatory
    this.name = options.name;

    // other options
    this.setInfos(options);

    // custom
    this.inEdition = false;
    this.saveForEdition = null;
  }

  /* -----  End of CONSTRUCTOR  ------*/

  /*= ========================================
    =            PROTOTYPE METHODS            =
    ========================================= */

  TucSmsService.prototype.setInfos = function setInfos(options) {
    const self = this;

    angular.forEach(keys(options), (optionKey) => {
      self[optionKey] = options[optionKey];
    });

    return self;
  };

  TucSmsService.prototype.getDisplayedName = function getDisplayedName() {
    const self = this;

    return self.description || self.name;
  };

  /* ----------  API CALLS  ----------*/

  TucSmsService.prototype.save = function save() {
    const self = this;

    return OvhApiSms.v6().edit(
      {
        serviceName: self.name,
      },
      {
        description: self.description,
      },
    ).$promise;
  };

  /* ----------  EDITION  ----------*/

  TucSmsService.prototype.startEdition = function startEdition() {
    const self = this;

    self.inEdition = true;

    self.saveForEdition = {
      description: angular.copy(self.description),
    };

    return self;
  };

  TucSmsService.prototype.stopEdition = function stopEdition(cancel) {
    const self = this;

    if (self.saveForEdition && cancel) {
      self.description = angular.copy(self.saveForEdition.description);
    }

    self.saveForEdition = null;
    self.inEdition = false;

    return self;
  };

  /* -----  End of PROTOTYPE METHODS  ------*/

  return TucSmsService;
};
