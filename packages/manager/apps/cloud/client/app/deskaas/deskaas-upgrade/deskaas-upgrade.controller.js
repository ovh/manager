class DeskaasUpgradeCtrl {
  constructor(
    $translate,
    $q,
    $state,
    $stateParams,
    CucControllerHelper,
    DeskaasService,
    OvhApiDeskaasService,
  ) {
    this.$translate = $translate;
    this.$q = $q;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.CucControllerHelper = CucControllerHelper;
    this.DeskaasService = DeskaasService;
    this.OvhApiDeskaasService = OvhApiDeskaasService;
    this.deskaasOffer = null;
    this.flags = {
      init: true,
    };
  }

  $onInit() {
    this.serviceName = this.$stateParams.serviceName;
    this.references = this.$stateParams.references;

    if (this.references) {
      this.flags.init = false;
      return;
    }
    this.DeskaasService.getMe()
      .then((me) => {
        this.me = me;
        return this.DeskaasService.fetchProductPlans(me);
      })
      .then(() => this.DeskaasService.getDetails(this.serviceName))
      .then((details) => {
        this.details = details;
        this.references = this.DeskaasService.getUpgradeOptions(
          details.planCode,
        );
      })
      .finally(() => {
        this.flags.init = false;
      });
  }

  confirmUpgrade() {
    this.saving = true;
    return this.CucControllerHelper.modal
      .showConfirmationModal({
        titleText: this.$translate.instant('vdi_btn_popup_upgrade'),
        textHtml: this.$translate.instant('vdi_confirm_upgrade', {
          plan: this.deskaasOffer.name,
          price: this.deskaasOffer.priceText,
        }),
      })
      .then(() =>
        this.OvhApiDeskaasService.v6().upgradeService(
          {
            serviceName: this.serviceName,
          },
          {
            planCode: this.deskaasOffer.planCode,
          },
        ),
      )
      .then((taskId) => {
        this.$state.go('deskaas.details', {
          serviceName: this.serviceName,
          followTask: taskId,
        });
      })
      .finally(() => {
        this.saving = false;
      });
  }
}

angular
  .module('managerApp')
  .controller('DeskaasUpgradeCtrl', DeskaasUpgradeCtrl);
