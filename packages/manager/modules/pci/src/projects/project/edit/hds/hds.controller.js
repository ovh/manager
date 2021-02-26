import { MESSAGES_CONTAINER_NAME } from '../edit.constant';

export default class ProjectHdsController {
  /* @ngInject */
  constructor(
    $translate,
    $timeout,
    atInternet,
    OrderCartService,
    CucCloudMessage,
  ) {
    this.$translate = $translate;
    this.$timeout = $timeout;
    this.atInternet = atInternet;
    this.orderCart = OrderCartService;
    this.CucCloudMessage = CucCloudMessage;

    this.isCheckout = false;
    this.model = {
      hds: false,
      agreements: false,
    };
  }

  $onInit() {
    this.model.hds = this.hds.isCertifiedProject;
  }

  trackClick(hit) {
    this.atInternet.trackClick({
      name: hit,
      type: 'action',
    });
  }

  sendTracking() {
    this.trackClick('PublicCloud::pci::projects::project_edit_update');
    if (this.model.hds) {
      this.trackClick('PublicCloud::pci::projects::project_edit_HDS_on');
    }

    if (!this.model.hds && this.hds.isCertifiedProject) {
      this.trackClick('PublicCloud::pci::projects::project_edit_HDS_off');
    }
  }

  isValidForSummary() {
    return (
      this.model.hds &&
      !this.hds.isCertifiedProject &&
      this.hds.isValidSupportLevel
    );
  }

  isValidToCheckout() {
    return (
      !this.isCheckout &&
      !this.hds.isCertifiedProject &&
      this.model.agreements &&
      this.model.hds
    );
  }

  checkoutCart() {
    this.sendTracking();

    this.isCheckout = true;
    return this.OrderCartService.checkoutCart(this.cart.cartId)
      .then(() => {
        this.hds.isCertifiedProject = true;
        return this.$timeout().then(() =>
          this.CucCloudMessage.success(
            this.$translate.instant(
              'pci_projects_project_edit_hds_btn_validate_status_success',
              { projectName: this.projectName },
            ),
            MESSAGES_CONTAINER_NAME,
          ),
        );
      })
      .catch((error) =>
        this.$timeout().then(() =>
          this.CucCloudMessage.error(
            this.$translate.instant(
              'pci_projects_project_edit_hds_btn_validate_status_error',
              {
                message: error.message,
              },
            ),
            MESSAGES_CONTAINER_NAME,
          ),
        ),
      )
      .finally(() => {
        this.isCheckout = false;
      });
  }

  onHdsCheckboxChanged(hdsCheckbox) {
    if (!hdsCheckbox.status) {
      this.model.agreements = false;
    }
  }
}
