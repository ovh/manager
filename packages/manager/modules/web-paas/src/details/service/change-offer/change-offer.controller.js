import { find, get, set, max } from 'lodash';
import { ADDON_FAMILY } from '../../../web-paas.constants';
import Plan from '../../../plan.class';

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
      document.getElementById('web-pass-add-header').scrollIntoView(false);
    });
  }

  onOrderSuccess(checkout) {
    if (checkout?.prices?.withTaxValue > 0) {
      this.$window.open(checkout.url, '_blank', 'noopener');
    }
    this.Alerter.success(
      this.$translate.instant('web_paas_change_offer_success', {
        orderURL: checkout
          ? this.getOrdersURL(checkout.orderId)
          : this.getOrdersURL(),
      }),
      this.alerts.changeOffer,
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
      this.alerts.changeOffer,
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

  /**
   * Get total price of the selected plan including all additional options (whicha are already included)
   */
  getTotalPrice() {
    this.totalPrice = this.selectedPlan.getRenewablePrice();
    const newEnvironmentPlanCode = find(this.selectedPlan.addonFamilies, {
      name: ADDON_FAMILY.ENVIRONMENT,
    }).addons[0];
    const environmentAddon = new Plan(
      find(this.catalog.addons, { planCode: newEnvironmentPlanCode }),
    );
    this.selectedProject.addons.forEach((addon) => {
      let addonPrice =
        find(this.availableAddons, {
          productName: addon.productName,
        }).getRenewablePrice().value * 100000000;

      switch (addon.planFamilyName) {
        case ADDON_FAMILY.STORAGE:
          addonPrice =
            find(this.selectedProject.addons, {
              planFamilyName: ADDON_FAMILY.ENVIRONMENT,
            }).quantity *
            addonPrice *
            addon.quantity;
          this.totalPrice += addonPrice;
          break;
        case ADDON_FAMILY.ENVIRONMENT:
          addonPrice = environmentAddon.getRenewablePrice();
          this.totalPrice += (addon.quantity - 2) * addonPrice;
          break;
        default:
          this.totalPrice += addon.quantity * addonPrice;
          break;
      }
    });
    set(this.selectedPlan, 'totalPrice', this.totalPrice);
  }

  getUpgradePlan() {
    this.isGettingCheckoutInfo = true;
    this.prices = null;
    set(this.selectedProject, 'quantity', 1);
    this.getTotalPrice();
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
    this.orderInProgress = true;
    return this.WebPaas.checkoutUpgrade(
      this.selectedProject.serviceId,
      this.selectedPlan,
      this.selectedProject.quantity,
    )
      .then(({ order }) => {
        this.onOrderSuccess(order);
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

  /**
   * Gives whethere to remove users or not
   * (current plan included user licences-new plan included user licences) + Max(0, current plan addon qty - new plan max addon qty )
   */
  shouldRemoveExtraLicences() {
    this.selectedAddonLicences =
      this.selectedPlan.getMaxLicenses() - this.selectedPlan.getLicences();
    this.availableUserLicencesToBe =
      this.selectedProject.selectedPlan.getLicences() -
      this.selectedPlan.getLicences() +
      max([0, this.getAdditionalLicencesCount() - this.selectedAddonLicences]);

    return this.getNumberOfUsersToRemove() > 0;
  }

  /** Gets additional licence count for the selected project */
  getAdditionalLicencesCount() {
    return (
      this.selectedProject.getTotalLicences() -
      this.selectedProject.selectedPlan.getLicences()
    );
  }

  /** Gets users to be removed to downgrade to selected plan */
  getNumberOfUsersToRemove() {
    return (
      this.availableUserLicencesToBe -
      this.selectedProject.getAvailableUserLicenses()
    );
  }

  isCurrentOffer() {
    return (
      this.selectedProject.selectedPlan.planCode === this.selectedPlan.planCode
    );
  }
}
