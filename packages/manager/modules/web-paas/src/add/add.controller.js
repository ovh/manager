import { find, get, map, set } from 'lodash';
import { ADDON_FAMILY, STORAGE_MULTIPLE } from '../web-paas.constants';
import {
  DEFAULT_PROJECT_NAME,
  NAME_VALIDATION,
  PAGE_SECTION_HEADER,
  TEMPLATE_GUIDE,
} from './add.constants';

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
    this.DEFAULT_PROJECT_NAME = DEFAULT_PROJECT_NAME;
    this.NAME_VALIDATION = NAME_VALIDATION;
    this.PAGE_SECTION_HEADER = PAGE_SECTION_HEADER;
    this.TEMPLATE_GUIDE = TEMPLATE_GUIDE;
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
      name: this.DEFAULT_PROJECT_NAME,
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
    this.project.template.createNew = true;
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
      document.getElementById(this.PAGE_SECTION_HEADER).scrollIntoView(false);
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
      const stagingEnvironment = find(addons, {
        family: 'staging_environment',
      });
      if (stagingEnvironment) {
        return this.WebPaas.getAddons(stagingEnvironment)
          .then((stagingOptions) => {
            addons.push(find(stagingOptions, { family: ADDON_FAMILY.STORAGE }));
            set(this.selectedPlan, 'addons', addons);
            return stagingOptions;
          })
          .finally(() => {
            this.loader.isGettingAddons = false;
          });
      }
      this.loader.isGettingAddons = false;
      set(this.selectedPlan, 'addons', addons);
      return addons;
    });
  }

  onAddonsSubmit() {
    this.prices = null;
    this.loader.isGettingCheckoutInfo = true;
    this.generatePayload();
    return this.WebPaas.getOrderSummary(this.payload, this.getConfiguration())
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

  generatePayload() {
    this.payload = angular.copy(this.selectedPlan);
    this.storageAddon = find(this.payload?.addons, {
      family: ADDON_FAMILY.STORAGE,
    });
    if (this.storageAddon) {
      map(this.payload.addons, (addon) => {
        if (addon.family === ADDON_FAMILY.ENVIRONMENT) {
          set(addon, 'option', [
            {
              planCode: this.storageAddon.planCode,
              quantity: this.storageAddon.quantity / STORAGE_MULTIPLE,
            },
          ]);
        }
      });
    }
  }

  orderProject() {
    this.loader.orderInProgress = true;
    return this.expressOrder();
  }

  expressOrder() {
    return this.WebPaas.gotToExpressOrder(this.payload, this.getConfiguration())
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
