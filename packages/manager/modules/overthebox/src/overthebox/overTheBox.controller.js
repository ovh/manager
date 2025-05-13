export default class OverTheBoxCtrl {
  /* @ngInject */
  constructor(
    $scope,
    $translate,
    $q,
    OvhApiOverTheBox,
    TucToast,
    CORE_URLS,
    OVER_THE_BOX,
  ) {
    this.$scope = $scope;
    this.$translate = $translate;
    this.$q = $q;
    this.OvhApiOverTheBox = OvhApiOverTheBox;
    this.TucToast = TucToast;
    this.CORE_URLS = CORE_URLS;
    this.OVER_THE_BOX = OVER_THE_BOX;
  }

  $onInit() {
    this.dice = Math.round(Math.random() * 100);
    this.expressLiteOrder = this.CORE_URLS.orderExpressLite;
    this.orderBoost = this.CORE_URLS.orderBoost;

    this.disabledRemote = true;

    this.checkDevices();
    this.updateName = this.updateName.bind(this);
  }

  checkDevices() {
    return this.OvhApiOverTheBox.v6()
      .getDevice({
        serviceName: this.serviceName,
      })
      .$promise.then(() => {
        this.disabledRemote = false;
      })
      .catch(() => {
        this.disabledRemote = true;
      })
      .finally(() => {
        this.loader = false;
      });
  }

  /**
   * Rename the title of the page
   * @param {String} str New Name
   * @returns {Promise}
   */
  updateName(str) {
    this.nameUpdating = true;

    return this.OvhApiOverTheBox.v6()
      .putService(
        {
          serviceName: this.serviceName,
        },
        {
          customerDescription: str,
        },
      )
      .$promise.then(() => {
        this.service.customerDescription = str;

        this.$scope.$emit(
          'overTheBox_updateName',
          this.service.serviceName,
          this.service.customerDescription || this.service.serviceName,
        );
        return str;
      })
      .catch((err) => {
        this.TucToast.error(
          this.$translate.instant('overTheBox_error_rename', this.serviceName),
        );
        return this.$q.reject(err);
      })
      .finally(() => {
        this.nameUpdating = false;
      });
  }
}
