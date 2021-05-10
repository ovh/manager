import { get, set } from 'lodash';

export default class WebPassAddCtrl {
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
    this.alerts = {
      add: 'web_paas_add',
    };
  }

  $onInit() {
    this.loader = {
      isEditingTemplate: false,
      isEditingOffers: false,
      isGettingAddons: false,
      isGettingCheckoutInfo: false,
      orderInProgress: false,
      loadingCapabilities: false,
    };

    this.prices = null;

    this.project = {
      region: null,
      offer: null,
      name: null,
      template: {
        createNew: true,
        templateUrl: null,
      },
    };
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  onPlanSubmit() {
    return this.loadCapabilities(this.project.offer);
  }

  onPlanSelect(product) {
    this.selectedPlan = product.selectedPlan;
    this.project.offer = product.selectedPlan.planCode;
  }

  onTemplateSelect(templateUrl) {
    this.project.template.templateUrl = templateUrl;
  }

  onTemplateFocus() {
    this.loader.isEditingTemplate = true;
  }

  onTemplateSubmit() {
    this.loadAddons();
    this.loader.isEditingTemplate = false;
  }

  onOfferFocus() {
    this.loader.isEditingOffers = true;
  }

  onOfferSubmit() {
    this.loader.isEditingOffers = false;
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
    this.loader.loadingCapabilities = true;
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
        this.loader.loadingCapabilities = false;
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

  onOrderSuccess(checkout) {
    if (checkout?.prices?.withTaxValue > 0) {
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

  onOrderError(error) {
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

  loadAddons() {
    this.loader.isGettingAddons = true;
    return this.WebPaas.getAddons(this.selectedPlan).then((addons) => {
      this.loader.isGettingAddons = false;
      set(this.selectedPlan, 'addons', addons);
    });
  }

  onAddonsSubmit() {
    this.prices = null;
    this.loader.isGettingCheckoutInfo = true;
    return this.WebPaas.getOrderSummary(
      this.selectedPlan,
      this.getConfiguration(),
    )
      .then(({ contracts, prices, cart }) => {
        this.cart = cart;
        this.contracts = contracts;
        this.prices = prices;
      })
      .catch((error) => this.onOrderError(error))
      .finally(() => {
        this.loader.isGettingCheckoutInfo = false;
      });
  }

  orderProject() {
    this.loader.orderInProgress = true;
    return this.expressOrder();
  }

  expressOrder() {
    return this.WebPaas.gotToExpressOrder(
      this.selectedPlan,
      this.getConfiguration(),
    )
      .then(() => {
        this.onOrderSuccess();
      })
      .catch((error) => {
        this.onOrderError(error);
      })
      .finally(() => {
        this.loader.orderInProgress = false;
      });
  }
}
