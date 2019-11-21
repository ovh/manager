import get from 'lodash/get';

import { PCI_URLS } from '../../constants';

export default class PciProjectNewCtrl {
  /* @ngInject */
  constructor($q, $state, $translate, $window, atInternet, coreConfig, CucCloudMessage,
    OVH_PAYMENT_METHOD_TYPE, ovhPaymentMethod, PciProjectNewService) {
    // dependencies injections
    this.$q = $q;
    this.$state = $state;
    this.$translate = $translate;
    this.$window = $window;
    this.atInternet = atInternet;
    this.CucCloudMessage = CucCloudMessage;
    this.OVH_PAYMENT_METHOD_TYPE = OVH_PAYMENT_METHOD_TYPE;
    this.ovhPaymentMethod = ovhPaymentMethod;
    this.PciProjectNewService = PciProjectNewService;

    // other attributes used in view
    this.loading = {
      init: false,
      creating: false,
      addPayment: false,
    };

    this.messages = {
      list: null,
      handler: null,
    };

    this.descriptionModel = null;
    this.paymentModel = null;
    this.region = coreConfig.getRegion();
    this.paymentMethodSubmitFn = null;
  }

  /* ==============================
  =            Helpers            =
  =============================== */

  getNextButtonText() {
    const currentStep = this.getCurrentStep();
    let translationKey;

    if (currentStep.name === 'description' && this.region !== 'US') {
      translationKey = 'pci_projects_new_continue';
    } else if (currentStep.model.mode === 'credits' || this.hasCreditToOrder()
      || (this.paymentStatus() && currentStep.model.projectId && this.newProjectInfo.order)) {
      translationKey = 'pci_projects_new_credit_and_create';
    } else {
      const isBankAccount = get(currentStep.model.selectedPaymentMethodType, 'paymentType')
        === this.OVH_PAYMENT_METHOD_TYPE.BANK_ACCOUNT;
      translationKey = isBankAccount ? 'pci_projects_new_add' : 'pci_projects_new_create';
    }

    return this.$translate.instant(translationKey);
  }

  getNextLinkHref() {
    const currentStep = this.getCurrentStep();

    if (currentStep.name === 'description') {
      return this.region !== 'US'
        ? this.getStateLink('next')
        : get(PCI_URLS, 'US.website_order["cloud-resell-eu"].US')(currentStep.model.name || '');
    }

    return this.paymentMethodUrl;
  }

  isCancelVisible() {
    const currentStep = this.getCurrentStep();
    return currentStep.name === 'description' || !this.shouldProcessChallenge();
  }

  isNextButtonDisabled() {
    const currentStep = this.getCurrentStep();

    if (currentStep.name === 'description') {
      return !currentStep.model.agreements;
    }

    return this.loading.creating
      || currentStep.loading.init
      || currentStep.loading.availableSteps
      || currentStep.loading.voucher
      || (currentStep.model.voucher.value && !currentStep.model.voucher.submitted)
      || (currentStep.model.mode === 'credits' && !currentStep.model.credit.value);
  }

  isNextButtonVisible() {
    const currentStep = this.getCurrentStep();

    if (currentStep.name === 'description') {
      return this.region !== 'US';
    }

    const isBankAccount = get(currentStep.model.selectedPaymentMethodType, 'paymentType')
      === this.OVH_PAYMENT_METHOD_TYPE.BANK_ACCOUNT;

    return !isBankAccount && !this.shouldProcessChallenge();
  }

  isPaymentMethodIntegrationVisible() {
    const currentStep = this.getCurrentStep();

    return currentStep.name !== 'description'
      && !this.paymentStatus()
      && !get(currentStep, 'model.defaultPaymentMethod');
  }

  isStepComplete(step) {
    const stepNames = this.steps.map(({ name }) => name);

    return stepNames.indexOf(step.name) < stepNames.indexOf(this.getCurrentStep().name);
  }

  isCreditAsteriskVisible() {
    const currentStep = this.getCurrentStep();

    if (currentStep.name === 'description') {
      return false;
    }

    return currentStep.model.mode === 'paymentMethod' && this.hasCreditToOrder();
  }

  isBlackFridayAsteriskVisible() {
    if (this.dlpStatus) return false;
    return ['paymentMethod', 'credits'].includes(get(this.getCurrentStep(), 'model.mode'));
  }

  /* ----------  Some payment helpers  ---------- */

  buildPaymentCallbackUrlBase(projectId = null) {
    // first build base of callback urls
    // build from scratch to be sure that old query parameters
    // are reset (in case of previous payment error)
    const { location } = this.$window;
    let callbackUrlBase = `${location.protocol}//${location.host}${location.pathname}${this.getStateLink('payment', false)}?`;
    const callbackParams = [];

    if (this.descriptionModel.name) {
      callbackParams.push(`description=${this.descriptionModel.name}`);
    }
    if (projectId) {
      callbackParams.push(`projectId=${projectId}`);
    }
    if (this.paymentModel.mode === 'credits' && this.paymentModel.credit.value) {
      callbackParams.push(
        `credit=${this.paymentModel.credit.value}`,
        `mode=${this.paymentModel.mode}`,
      );
    }

    if (this.paymentModel.voucher.valid) {
      callbackParams.push(`voucher=${this.paymentModel.voucher.value}`);
    }

    if (callbackParams.length) {
      callbackUrlBase = `${callbackUrlBase}${callbackParams.join('&')}`;
    }

    return callbackUrlBase;
  }

  /* -----  End of Helpers  ------ */

  /* ================================
  =            Callbacks            =
  ================================= */

  onIntegrationInitialized(paymentMethodSubmitFn) {
    this.paymentMethodSubmitFn = paymentMethodSubmitFn;
  }

  onIntegrationSubmit() {
    if (this.paymentModel.selectedPaymentMethodType.paymentType !== 'PAYPAL') {
      this.loading.addPayment = true;
    }

    const callbackUrlBase = this.buildPaymentCallbackUrlBase();

    return {
      default: this.paymentModel.setAsDefault,
      register: true,
      callbackUrl: {
        cancel: [callbackUrlBase, 'paymentStatus=cancel'].join('&'),
        error: [callbackUrlBase, 'paymentStatus=error'].join('&'),
        failure: [callbackUrlBase, 'paymentStatus=failure'].join('&'),
        pending: [callbackUrlBase, 'paymentStatus=pending'].join('&'),
        success: [callbackUrlBase, 'paymentStatus=success'].join('&'),
      },
    };
  }

  onIntegrationSubmitError() {
    this.loading.addPayment = false;

    if (!this.paymentModel.projectId) {
      // just explain that payment has failed
      this.CucCloudMessage.error(this.$translate.instant('pci_projects_new_add_payment_error_message'));
    } else {
      // explain that project has been created
      // but that credit needs to be paid before using it
      this.CucCloudMessage.error(this.$translate.instant('pci_projects_new_add_credit_payment_error_message'));
    }
  }

  onIntegrationSubmitSuccess(paymentMethod) {
    this.loading.addPayment = false;

    if (this.paymentModel.selectedPaymentMethodType.paymentType === 'PAYPAL') {
      this.paymentModel.defaultPaymentMethod = paymentMethod;
      this.paymentModel.paymentStatus = 'success';
    }

    // success => HiPay
    // accepted => PayPal
    if (!this.paymentModel.projectId && !this.newProjectInfo.order) {
      // if no projectId and no credit order from newProjectInfo API call
      // this mean that project is not yet created
      // and that a new payment method has been added
      return this.createProject();
    }

    if (!this.paymentModel.projectId && this.newProjectInfo.order) {
      // if no projectId and credit order from newProjectInfo API call
      // we need to pay credit first before creating project
      // so return true and let display payment step with informations about credit
      return true;
    }

    // if projectId - this mean that project has been created with credit
    // and payment of this credit is OK
    return this.onProjectCreated(this.paymentModel.projectId);
  }

  /* -----  End of Callbacks  ------ */


  /* ==============================
  =            Actions            =
  =============================== */

  createProject() {
    this.loading.creating = true;

    const hasCredit = this.paymentModel.mode === 'credits' && this.paymentModel.credit.value;
    const hasOrderCredit = this.newProjectInfo.order
        && (!this.paymentStatus()
          || ['success', 'accepted'].includes(this.paymentStatus())
          || (this.paymentStatus() && this.paymentModel.projectId && this.newProjectInfo.order));
    const hasVoucher = this.paymentModel.voucher.valid && this.paymentModel.voucher.value;
    const createParams = {
      description: this.descriptionModel.name,
    };

    if (hasVoucher) {
      createParams.voucher = this.paymentModel.voucher.value;
    } else if (hasCredit) {
      createParams.credit = this.paymentModel.credit.value;
    } else if (hasOrderCredit) {
      createParams.credit = this.newProjectInfo.order.value;
    }

    return this.PciProjectNewService
      .acceptAgreements(this.contracts)
      .then(() => this.PciProjectNewService.createNewProject(createParams))
      .then(({ orderId, project }) => {
        if (!hasVoucher && (hasCredit || hasOrderCredit)) {
          return this.payCredit({ orderId, project });
        }

        return this.onProjectCreated(project);
      })
      .catch(() => {
        this.loading.creating = false;
        this.CucCloudMessage.error(this.$translate.instant('pci_projects_new_create_error_message'));
      });
  }

  payCredit({ orderId, project }) {
    const callbackUrlBase = this.buildPaymentCallbackUrlBase(project);
    const paymentParams = {
      orderId,
      default: false,
      register: false,
      callbackUrl: {
        cancel: [callbackUrlBase, 'paymentStatus=cancel'].join('&'),
        error: [callbackUrlBase, 'paymentStatus=error'].join('&'),
        failure: [callbackUrlBase, 'paymentStatus=failure'].join('&'),
        pending: [callbackUrlBase, 'paymentStatus=pending'].join('&'),
        success: [callbackUrlBase, 'paymentStatus=success'].join('&'),
      },
    };

    const paymentType = {
      paymentType: 'CREDIT_CARD',
      isLegacy: () => false,
    };

    return this.ovhPaymentMethod
      .addPaymentMethod(paymentType, paymentParams)
      .then(({ url }) => {
        this.$window.location.href = url;
      });
  }

  /* -----  End of Actions  ------ */

  /* =============================
  =            Events            =
  ============================== */

  onNextBtnClick() {
    const currentStep = this.getCurrentStep();

    if (this.paymentModel.mode === 'credits' && this.paymentModel.credit.value) {
      this.atInternet.trackEvent({
        page: this.trackingPage,
        event: 'PCI_PAYMENT_MODE_CREDIT',
      });
    }

    if (currentStep.name === 'description') {
      return true;
    }

    // if default payment or credit amount - create project
    if (this.paymentModel.defaultPaymentMethod
      || (this.paymentModel.mode === 'credits' && this.paymentModel.credit.value)
      || (this.newProjectInfo.order && ['success', 'accepted'].includes(this.paymentStatus()))
      || (this.paymentStatus() && currentStep.model.projectId && this.newProjectInfo.order)
      || (this.paymentModel.voucher.valid
        && this.paymentModel.voucher.paymentMethodRequired === false)
    ) {
      return this.createProject();
    }

    // if no default payment method - add new one before creating project
    if (this.paymentMethodSubmitFn) {
      return this.paymentMethodSubmitFn();
    }

    return true;
  }

  /* -----  End of Events  ------ */

  /* =====================================
  =            Initialization            =
  ====================================== */

  $onInit() {
    // set models
    this.descriptionModel = this.getStepByName('description').model;
    this.paymentModel = this.getStepByName('payment').model;

    // manage messages
    this.CucCloudMessage.unSubscribe('pci.projects.new');
    this.messages.handler = this.CucCloudMessage.subscribe('pci.projects.new', {
      onMessage: () => {
        this.messages.list = this.messages.handler.getMessages();
      },
    });

    if (this.paymentModel.projectId && this.paymentStatus() === 'success') {
      return this.onProjectCreated(this.paymentModel.projectId);
    }

    return true;
  }

  /* -----  End of Initialization  ------ */
}
