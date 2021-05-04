import { get, set } from 'lodash';
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
    this.stepperIndex = 0;
    this.isEditingTemplate = false;
    this.isEditingOffers = false;
    this.isGettingAddons = false;
    this.isGettingCheckoutInfo = false;
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
    if (this.selectedProject) {
      this.setStepperIndex();
      this.project.name = this.selectedProject.projectName;
      this.onPlanSelect(this.selectedProject);
    }
  }

  setStepperIndex() {
    this.stepperIndex = 1;
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  onPlanSubmit() {
    this.loadCapabilities(this.project.offer);
    if (this.isChangingPlan()) {
      this.upgradePlan();
    }
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

  onPlatformOrderSuccess() {
    this.Alerter.success(
      this.$translate.instant('web_paas_add_project_success'),
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

  upgradePlan() {
    this.isGettingCheckoutInfo = true;
    set(this.selectedProject, 'quantity', 1);
    this.WebPaas.getUpgradeCheckoutInfo(
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

  createWebPaas() {
    this.WebPaas.gotToExpressOrder(this.selectedPlan, this.getConfiguration())
      .then(() => {
        this.onPlatformOrderSuccess();
      })
      .catch((error) => {
        this.onPlatformOrderError(error);
      });
  }

  isEditable() {
    return !this.isChangingPlan();
  }

  isChangingPlan() {
    return this.selectedProject;
  }
}
