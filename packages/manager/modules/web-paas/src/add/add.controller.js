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
    this.additionalLicenceEdit = false;

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
    if (this.isChangingPlan()) {
      this.loadOptions();
    }
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

    return this.WebPaas.getAddons(this.selectedPlan).then((addons) => {
      this.isGettingAddons = false;
      set(this.selectedPlan, 'addons', addons);
    });
  }

  onOptionsSubmit() {
    if (this.isChangingPlan()) {
      return this.upgradePlan();
    }
    this.isGettingCheckoutInfo = true;
    return this.WebPaas.getOrderSummary(
      this.selectedPlan,
      this.getConfiguration(),
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

  upgradePlan() {
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

  createWebPaas() {
    if (this.isChangingPlan()) {
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
        });
    }
    return this.WebPaas.gotToExpressOrder(
      this.selectedPlan,
      this.getConfiguration(),
    )
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

  shouldRemoveExtraLicences() {
    return (
      this.selectedProject.totalLicences() > this.selectedPlan.getMaxLicenses()
    );
  }
}
