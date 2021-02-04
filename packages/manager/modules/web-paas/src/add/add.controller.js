import {
  pricingConstants,
  workflowConstants,
} from '@ovh-ux/manager-product-offers';

import { WORKFLOW_OPTIONS } from './add.constants';

export default class {
  /* @ngInject */
  constructor($translate, $q, $window, WebPaas, WucOrderCartService) {
    this.$translate = $translate;
    this.$q = $q;
    this.$window = $window;
    this.WebPaas = WebPaas;
    this.WucOrderCartService = WucOrderCartService;
    this.WORKFLOW_OPTIONS = WORKFLOW_OPTIONS;
  }

  $onInit() {
    this.isAdding = false;
    this.isEditingTemplate = false;
    this.isEditingOffers = false;
    this.availableStorages = [
      {
        value: 5,
        name: '5 GB',
      },
    ];
    this.availableEnvironments = [
      {
        value: 1,
        name: '1 Environment',
      },
    ];
    this.availableUserLicenses = [
      {
        value: 1,
        name: '1 User License',
      },
    ];
    this.project = {
      region: null,
      offer: null,
      name: null,
      template: {
        createNew: true,
        templateUrl: null,
      },
      configuration: {
        storage: this.availableStorages[0],
        environment: this.availableEnvironments[0],
        license: this.availableUserLicenses[0],
      },
    };

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
    return this.WebPaas.getCapabilities(
      planCode,
      this.project.template.createNew,
    )
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
        this.CucCloudMessage.error('Regions not abailable. Try again.'),
      )
      .finally(() => {
        this.loadingCapabilities = false;
      });
  }

  onPlatformOrderSuccess(checkout) {
    this.$window.open(checkout.url, '_blank', 'noopener');
    return this.goBack(this.$translate.instant('web_paas_add_project_success'));
  }

  onPlatformOrderError(error) {
    return this.CucCloudMessage.error(
      this.$translate.instant('web_paas_add_project_error', {
        message: error.message,
      }),
    );
  }

  getPlanCode() {
    return this.WORKFLOW_OPTIONS.planCode;
  }

  getOrderState(state) {
    this.characteristics.isEditable = !state.isLoading;
  }
}
