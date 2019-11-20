export default /* @ngInject */ function
($scope, $stateParams, $translate, $q, OvhApiOverTheBox, TucToast, CORE_URLS) {
  const self = this;

  self.dice = Math.round(Math.random() * 100);
  self.expressLiteOrder = CORE_URLS.orderExpressLite;
  self.orderBoost = CORE_URLS.orderBoost;

  this.disabledRemote = true;

  this.checkDevices = function checkDevices() {
    return OvhApiOverTheBox.v6().getDevice({
      serviceName: $stateParams.serviceName,
    }).$promise.then(() => {
      self.disabledRemote = false;
    }, () => {
      self.disabledRemote = true;
    }).finally(() => {
      self.loader = false;
    });
  };

  /**
     * Rename the title of the page
     * @param {String} str New Name
     * @returns {Promise}
     */
  self.updateName = function updateName(str) {
    self.nameUpdating = true;

    return OvhApiOverTheBox.v6().putService({
      serviceName: $stateParams.serviceName,
    }, {
      customerDescription: str,
    }).$promise.then(() => {
      self.service.customerDescription = str;

      $scope.$emit(
        'overTheBox_updateName',
        self.service.serviceName,
        self.service.customerDescription || self.service.serviceName,
      );
      return str;
    }).catch((err) => {
      TucToast.error($translate.instant('overTheBox_error_rename', $stateParams));
      return $q.reject(err);
    }).finally(() => {
      self.nameUpdating = false;
    });
  };

  /**
     * Load services
     */
  this.getService = function getService() {
    return OvhApiOverTheBox.v6().get({ serviceName: $stateParams.serviceName }).$promise.then(
      (service) => {
        self.service = service;
      },
      (error) => {
        self.error.service = error.data;
        TucToast.error([$translate.instant('an_error_occured'), error.data.message].join(' '));
      },
    );
  };

  function init() {
    return $q.all([
      self.getService(),
      self.checkDevices(),
    ]);
  }

  init();
}
