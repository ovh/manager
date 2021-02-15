import {
  pricingConstants,
  workflowConstants,
} from '@ovh-ux/manager-product-offers';

import { WORKFLOW_OPTIONS } from './add.constants';

export default class {
  /* @ngInject */
  constructor($q, $translate, $window, Alerter, WebPaas, WucOrderCartService) {
    this.$q = $q;
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

    this.project = {
      region: null,
      offer: null,
      name: null,
      template: {
        createNew: true,
        templateUrl: null,
      },
    };

    this.setStaticOptions();

    this.productOffers = {
      pricingType: pricingConstants.PRICING_CAPACITIES.RENEW,
      user: this.user,
      workflowOptions: {
        catalog: this.catalog,
        catalogItemTypeName: WORKFLOW_OPTIONS.catalogItemTypeName,
        productName: WORKFLOW_OPTIONS.productName,
        serviceNameToAddProduct: null,
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

  onPlanSelect(plan) {
    this.project.offer = plan;
  }

  onTemplateSelect(templateUrl) {
    this.project.template.templateUrl = templateUrl;
  }

  onTemplateFocus() {
    this.isEditingTemplate = true;
  }

  onTemplateSubmit() {
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

  onPlatformOrderSuccess(checkout) {
    this.$window.open(checkout.url, '_blank', 'noopener');
    $('html, body').animate(
      { scrollTop: $('.add-page-header').offset().top },
      500,
    );
    return this.Alerter.success(
      this.$translate.instant('web_paas_add_project_success', {
        orderURL: this.getOrdersURL(checkout.orderId),
      }),
      this.alerts.add,
    );
  }

  onPlatformOrderError(error) {
    return this.Alerter.alertFromSWS(
      this.$translate.instant('web_paas_add_project_error'),
      error,
      this.alerts.add,
    );
  }

  getPlanCode() {
    return this.project.offer;
  }

  getOrderState(state) {
    this.characteristics.isEditable = !state.isLoading;
  }

  setStaticOptions() {
    this.availableStorages = [
      {
        value: this.plans[0].getStorage(),
        name: this.$translate.instant('web_paas_add_project_storage', {
          storageSize: this.plans[0].getStorage(),
        }),
      },
    ];
    this.availableEnvironments = [
      {
        value: this.plans[0].getProdEnvironment(),
        name: this.$translate.instant('web_paas_add_project_environment', {
          count: this.plans[0].getProdEnvironment(),
        }),
      },
    ];
    this.availableUserLicenses = [
      {
        value: this.plans[0].getMaxLicenses(),
        name: this.$translate.instant('web_paas_add_project_license', {
          count: this.plans[0].getMaxLicenses(),
        }),
      },
    ];
    this.project.configuration = {
      ...this.project.configuration,
      storage: this.availableStorages[0],
      environment: this.availableEnvironments[0],
      license: this.availableUserLicenses[0],
    };
  }
}
