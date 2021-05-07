import { get, set } from 'lodash';

export default class {
  /* @ngInject */
  constructor($q, $timeout, $translate, $window, Alerter, WebPaas) {
    this.$q = $q;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.$window = $window;
    this.Alerter = Alerter;
    this.WebPaas = WebPaas;
    this.alerts = {
      changeOffer: 'web_paas_change_offer',
    };
  }

  $onInit() {
    this.isAdding = false;
    this.stepperIndex = 0;
    this.isEditingOffers = false;
    this.isGettingAddons = false;
    this.isGettingCheckoutInfo = false;
    this.orderInProgress = false;
    this.prices = null;
    this.additionalLicenceEdit = false;

    this.project = {
      region: null,
      offer: null,
      name: null,
    };

    this.project.name = this.selectedProject.projectName;
    this.onPlanSelect(this.selectedProject);
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  onPlanSubmit() {
    if (this.shouldRemoveExtraLicences()) {
      return this.loadOptions();
    }
    return this.getUpgradePlan();
  }

  onPlanSelect(product) {
    this.selectedPlan = product.selectedPlan;
    this.project.offer = product.selectedPlan.planCode;
  }

  onOfferFocus() {
    this.isEditingOffers = true;
  }

  onOfferSubmit() {
    this.isEditingOffers = false;
  }

  scrollToTop() {
    this.$timeout(() => {
      document.getElementById('web-pass-add-header').scrollIntoView({
        behavior: 'smooth',
      });
      document.getElementById('web-pass-add-alert').focus();
    });
  }

  onPlatformOrderSuccess(checkout) {
    if (checkout && checkout.prices && checkout.prices.withTax.value > 0) {
      this.$window.open(checkout.url, '_blank', 'noopener');
    }
    this.Alerter.success(
      this.$translate.instant('web_paas_add_project_success', {
        orderURL: checkout
          ? this.getOrdersURL(checkout.orderId)
          : this.getOrdersURL(),
      }),
      this.alerts.add,
    );
    this.scrollToTop();
  }

  onPlatformOrderError(error) {
    this.Alerter.alertFromSWS(
      `${this.$translate.instant('web_paas_add_project_error')} ${get(
        error,
        'data.message',
      )}`,
      error,
      this.alerts.add,
    );
    this.scrollToTop();
  }

  getPlanCode() {
    return this.project.offer;
  }

  getOrderState(state) {
    this.characteristics.isEditable = !state.isLoading;
  }

  loadOptions() {
    this.isGettingAddons = true;
    this.additionalLicenceEdit = this.shouldRemoveExtraLicences();
    if (this.additionalLicenceEdit) {
      return this.WebPaas.getUsers(this.selectedProject.serviceId).then(
        (list) => {
          this.userList = list;
          this.isGettingAddons = false;
        },
      );
    }
    return null;
  }

  onOptionsSubmit() {
    return this.getUpgradePlan();
  }

  getUpgradePlan() {
    this.isGettingCheckoutInfo = true;
    set(this.selectedProject, 'quantity', 1);
    return this.WebPaas.getUpgradeCheckoutInfo(
      this.selectedProject.serviceId,
      this.selectedPlan,
    )
      .then(({ contracts, prices, cart }) => {
        this.cart = cart;
        this.contracts = contracts;
        this.prices = prices;
      })
      .catch((error) => this.onPlatformOrderError(error))
      .finally(() => {
        this.isGettingCheckoutInfo = false;
      });
  }

  upgradeOffer() {
    return this.WebPaas.checkoutUpgrade(
      this.selectedProject.serviceId,
      this.selectedPlan,
      this.selectedProject.quantity,
    )
      .then(({ order }) => {
        this.onPlatformOrderSuccess(order);
      })
      .catch((error) => {
        this.onPlatformOrderError(error);
      })
      .finally(() => {
        this.orderInProgress = false;
      });
  }

  isChangingPlan() {
    return this.selectedProject;
  }

  shouldRemoveExtraLicences() {
    return (
      this.selectedProject?.totalLicences() > this.selectedPlan.getMaxLicenses()
    );
  }

  /** Gets additional licence count for the selected plan */
  getAdditionalLicencesCount() {
    return this.selectedPlan.getMaxLicenses() - this.selectedPlan.getLicences();
  }

  /** Gets users to be removed to downgrade to selected plan */
  getUsersToRemoveCount() {
    return (
      this.selectedProject.totalLicences() -
      (this.selectedPlan.getLicences() + this.getAdditionalLicencesCount())
    );
  }
}
