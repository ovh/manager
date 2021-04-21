import set from 'lodash/set';
import {
  pricingConstants,
  workflowConstants,
} from '@ovh-ux/manager-product-offers';

import { WORKFLOW_OPTIONS } from './add.constants';

export default class {
  /* @ngInject */
  constructor(
    $q,
    $timeout,
    $translate,
    $window,
    Alerter,
    WebPaas,
    WucOrderCartService,
  ) {
    this.$q = $q;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.$window = $window;
    this.Alerter = Alerter;
    this.WebPaas = WebPaas;
    this.WucOrderCartService = WucOrderCartService;
    this.WORKFLOW_OPTIONS = WORKFLOW_OPTIONS;
    this.alerts = {
      add: 'web_paas_add',
    };
  }

  $onInit() {
    this.isAdding = false;
    this.isEditingTemplate = false;
    this.isEditingOffers = false;
    this.isGettingAddons = false;
    this.isGettingCheckoutInfo = false;

    this.project = {
      region: null,
      offer: null,
      name: null,
      template: {
        createNew: true,
        templateUrl: null,
      },
    };

    this.productOffers = {
      pricingType: pricingConstants.PRICING_CAPACITIES.RENEW,
      user: this.user,
      workflowOptions: {
        serviceNameToAddProduct: null,
        catalog: this.catalog,
        catalogItemTypeName: WORKFLOW_OPTIONS.catalogItemTypeName,
        productName: WORKFLOW_OPTIONS.productName,
        getPlanCode: this.getPlanCode.bind(this),
        onGetConfiguration: () => this.getConfiguration(),
      },
      workflowType: workflowConstants.WORKFLOW_TYPES.ORDER,
    };
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  onPlanSubmit() {
    this.loadCapabilities(this.project.offer);
  }

  onPlanSelect(product) {
    this.selectedPlan = product.selectedPlan;
    this.project.offer = product.selectedPlan.planCode;
  }

  onTemplateSelect(templateUrl) {
    this.project.template.templateUrl = templateUrl;
  }

  onTemplateFocus() {
    this.isEditingTemplate = true;
  }

  onTemplateSubmit() {
    this.loadOptions();
    this.isEditingTemplate = false;
  }

  onOfferFocus() {
    this.isEditingOffers = true;
  }

  onOfferSubmit() {
    this.isEditingOffers = false;
  }

  getConfiguration() {
    const config = [
      {
        label: 'region',
        value: this.project.region,
      },
      {
        label: 'project_title',
        value: this.project.name,
      },
    ];
    if (!this.project.template.createNew) {
      config.push({
        label: 'options_url',
        value: this.project.template.templateUrl,
      });
    }
    return config;
  }

  loadCapabilities(planCode) {
    this.loadingCapabilities = true;
    return this.WebPaas.getCapabilities(planCode)
      .then((capabilities) => {
        this.capabilities = capabilities;
        if (
          this.capabilities.regions &&
          this.capabilities.regions.length === 1
        ) {
          [this.project.region] = this.capabilities.regions;
        }
      })
      .catch(() =>
        this.Alerter.alertFromSWS(
          this.$translate.instant('web_paas_add_project_region_na'),
          'error',
          this.alerts.add,
        ),
      )
      .finally(() => {
        this.loadingCapabilities = false;
      });
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
    if (checkout.prices && checkout.prices.withTax.value > 0) {
      this.$window.open(checkout.url, '_blank', 'noopener');
    }
    this.Alerter.success(
      this.$translate.instant('web_paas_add_project_success', {
        orderURL: this.getOrdersURL(checkout.orderId),
      }),
      this.alerts.add,
    );
    this.scrollToTop();
  }

  onPlatformOrderError(error) {
    this.Alerter.alertFromSWS(
      this.$translate.instant('web_paas_add_project_error'),
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
    this.WebPaas.getAddons(this.selectedPlan).then((addons) => {
      this.isGettingAddons = false;
      set(this.selectedPlan, 'addons', addons);
    });
  }

  onOptionsSubmit() {
    this.isGettingCheckoutInfo = true;
    this.WebPaas.getOrderSummary(this.selectedPlan, this.getConfiguration())
      .then(({ contracts, prices, cart }) => {
        this.cart = cart;
        this.contracts = contracts;
        this.prices = prices;
      })
      .catch((error) =>
        !this.onError || this.onError({ error }) === false
          ? this.$q.reject(error)
          : null,
      )
      .finally(() => {
        this.isGettingCheckoutInfo = false;
      });
  }

  createWebPaas() {
    this.WebPaas.checkoutCart(this.cart)
      .then((checkout) => {
        this.onPlatformOrderSuccess(checkout);
      })
      .catch((error) => {
        this.onPlatformOrderError(error);
      });
  }
}
