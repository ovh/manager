import {
  pricingConstants,
  workflowConstants,
} from '@ovh-ux/manager-product-offers';

import { WORKFLOW_OPTIONS } from './add.constants';

export default class {
  /* @ngInject */
  constructor($translate, $q, CucCloudMessage, PlatformSh, WucOrderCartService) {
    this.$translate = $translate;
    this.$q = $q;
    this.CucCloudMessage = CucCloudMessage;
    this.PlatformSh = PlatformSh;
    this.WucOrderCartService = WucOrderCartService;
  }

  $onInit() {
    this.isAdding = false;
    this.isEditingTemplate = false;
    this.isEditingOffers = false;
    this.availableStorages = [{
      value: 5,
      name: '5 GB',
    }];
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
      },
    };

    this.loadMessages();

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

  loadMessages() {
    this.CucCloudMessage.unSubscribe('platform-sh.add');
    this.messageHandler = this.CucCloudMessage.subscribe(
      'platform-sh.add',
      { onMessage: () => this.refreshMessages() },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  onPlanSubmit() {
    this.loadCapabilities(this.project.offer);
  }

  onOptionsSubmit() {}

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
    const config = [{
      label: 'region',
      value: this.project.region,
    }, {
      label: 'project_title',
      value: this.project.name,
    }];
    if (!this.project.template.createNew) {
      config.push({
        label: 'options_url',
        value: this.project.template.templateUrl,
      })
    }
    return config;
  }

  loadCapabilities(planCode) {
    this.loadingCapabilities = true;
    return this.PlatformSh.getCapabilities(planCode)
      .then((capabilities) => {
        this.capabilities = capabilities;
        if (this.capabilities.availableRegions &&
            this.capabilities.availableRegions.length === 1) {
          this.project.region = this.capabilities.availableRegions[0];
        }
      })
      .catch(() => this.CucCloudMessage.error('Regions not abailable. Try again.'))
      .finally(() => {
        this.loadingCapabilities = false;
      })
  }

  onPlatformOrderSuccess() {
    return this.goBack(
      this.$translate.instant('platform_sh_add_project_success'),
    );
  }

  onPlatformOrderError(error) {
    return this.CucCloudMessage.error(
      this.$translate.instant('platform_sh_add_project_error', {
        message: error.message,
      }),
    );
  }

  getPlanCode() {
    return WORKFLOW_OPTIONS.planCode;
  }

  getOrderState(state) {
    this.characteristics.isEditable = !state.isLoading;
  }
}
