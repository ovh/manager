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

  OrderSuccess(checkout) {
    if (checkout?.prices?.withTaxValue > 0) {
      this.$window.open(checkout.url, '_blank', 'noopener');
    }
    this.Alerter.success(
      this.$translate.instant('web_paas_change_offer_success', {
        orderURL: checkout
          ? this.getOrdersURL(checkout.orderId)
          : this.getOrdersURL(),
      }),
      this.alerts.add,
    );
    this.scrollToTop();
  }

  onOrderError(error) {
    this.Alerter.alertFromSWS(
      `${this.$translate.instant('web_paas_change_offer_error')} ${get(
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
      .catch((error) => this.onOrderError(error))
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
        this.OrderSuccess(order);
      })
      .catch((error) => {
        this.onOrderError(error);
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
      this.selectedProject?.getTotalLicences() >
        this.selectedPlan.getMaxLicenses() && !this.cpu
    );
  }

  /** Gets additional licence count for the selected plan */
  getAdditionalLicencesCount() {
    return this.selectedPlan.getMaxLicenses() - this.selectedPlan.getLicences();
  }

  /** Gets users to be removed to downgrade to selected plan */
  getNumberOfUsersToRemove() {
    return (
      this.selectedProject.getTotalLicences() -
      (this.selectedPlan.getLicences() + this.getAdditionalLicencesCount())
    );
  }
}
