export default class XdslModemCtrl {
  /* @ngInject */
  constructor(
    $scope,
    $translate,
    $q,
    OvhApiXdsl,
    TucPackXdslModemMediator,
    TucToast,
  ) {
    this.$scope = $scope;
    this.$translate = $translate;
    this.$q = $q;
    this.OvhApiXdsl = OvhApiXdsl;
    this.TucToast = TucToast;
    this.mediator = TucPackXdslModemMediator;
    this.TucPackXdslModemMediator = TucPackXdslModemMediator;
  }

  $onInit() {
    this.loaders = {
      modem: true,
    };

    this.$scope.$on('changeAccessNameEvent', (event, data) => {
      if (this.serviceName === data.xdslId) {
        this.accessName = data.description;
      }
    });

    this.$q
      .all([
        this.TucPackXdslModemMediator.open(this.serviceName, () => {
          this.TucToast.error(this.$translate.instant('xdsl_model_task_error'));
        }),
        this.getAccessName(),
      ])
      .finally(() => {
        this.loaders.modem = false;
      });

    this.$scope.$on('$destroy', () => {
      this.TucPackXdslModemMediator.close();
    });
  }

  getAccessName() {
    return this.OvhApiXdsl.Modem()
      .v6()
      .get({
        xdslId: this.serviceName,
      })
      .$promise.then((access) => {
        this.accessName = access.description || access.packName;
        this.isZyxelBrand = access.brandName === 'Zyxel';
        return access;
      })
      .catch((err) => {
        this.TucToast.error(this.$translate.instant('xdsl_model_access_error'));
        return this.$q.reject(err);
      });
  }
}
