import get from 'lodash/get';
import merge from 'lodash/merge';

export default class PciProjectNewCtrl {
  /* @ngInject */
  constructor($q, $translate, $window, CucCloudMessage, ovhContacts,
    ovhPaymentMethod, PciProjectNewService) {
    // dependencies injections
    this.$q = $q;
    this.$translate = $translate;
    this.$window = $window;
    this.CucCloudMessage = CucCloudMessage;
    this.ovhContacts = ovhContacts;
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
  }

  /* ==============================
  =            Helpers            =
  =============================== */

  getNextButtonText() {
    const currentStep = this.getCurrentStep();
    let translationKey;

    if (currentStep.name === 'description') {
      translationKey = 'pci_projects_new_continue';
    } else if (currentStep.model.mode === 'credits') {
      translationKey = 'pci_projects_new_credit_and_create';
    } else if (get(currentStep.model.paymentType, 'paymentType.value') === 'BANK_ACCOUNT') {
      translationKey = 'pci_projects_new_add';
    } else {
      translationKey = 'pci_projects_new_create';
    }

    return this.$translate.instant(translationKey);
  }

  getNextLinkHref() {
    const currentStep = this.getCurrentStep();

    if (currentStep.name === 'description') {
      return this.getStateLink('newt');
    }

    return this.paymentMethodUrl;
  }

  isNextButtonDisabled() {
    const currentStep = this.getCurrentStep();

    if (currentStep.name === 'description') {
      return true;
    }

    return this.loading.creating || currentStep.loading.init || currentStep.loading.availableSteps;
  }

  isNextButtonVisible() {
    const currentStep = this.getCurrentStep();

    if (currentStep.name === 'description') {
      // for description step - next button is visible when agreements is not checked
      return !currentStep.model.agreements;
    }

    return get(currentStep.model.paymentType, 'paymentType.value') !== 'BANK_ACCOUNT';
  }

  isStepComplete(step) {
    const stepNames = this.steps.map(({ name }) => name);

    return stepNames.indexOf(step.name) < stepNames.indexOf(this.getCurrentStep().name);
  }

  /* -----  End of Helpers  ------ */

  /* ==============================
  =            Actions            =
  =============================== */

  createProject() {
    this.loading.creating = true;

    const descriptionModel = this.getStepByName('description').model;
    // const paymentModel = this.getStepByName('payment').model;
    const createParams = {
      description: descriptionModel.name,
    };

    return this.PciProjectNewService
      .createNewProject(createParams)
      .then((response) => {
        this.onProjectCreated(response.project);
      })
      .catch(() => {
        this.loading.creating = false;
      });
  }

  addPaymentMethod() {
    this.loading.addPayment = true;

    const descriptionModel = this.getStepByName('description').model;
    const paymentModel = this.getStepByName('payment').model;

    // first build base of callback url
    let callbackUrlBase = this.$window.location.href;
    const callbackParams = [];
    const hasQueryParam = this.$window.location.hash.indexOf('?') > -1;

    if (descriptionModel.name) {
      callbackParams.push(`description=${descriptionModel.name}`);
    }
    if (paymentModel.mode === 'credits' && paymentModel.credit) {
      callbackParams.push(`credit=${paymentModel.credit}`);
    }
    // TODO: manage voucher
    if (callbackParams.length) {
      callbackUrlBase = `${callbackUrlBase}${hasQueryParam ? '&' : '?'}${callbackParams.join('&')}`;
    }

    // set the right params depending if it is an original payment method
    // or a new one (with /me/payment/method)
    let addPaymentParams = {
      default: true,
    };
    let billingContactPromise = this.$q.when(true);

    if (!paymentModel.paymentType.original) {
      addPaymentParams = merge(addPaymentParams, {
        register: true,
        callbackUrl: {
          cancel: [callbackUrlBase, 'hiPayStatus=cancel'].join('&'),
          error: [callbackUrlBase, 'hiPayStatus=error'].join('&'),
          failure: [callbackUrlBase, 'hiPayStatus=failure'].join('&'),
          pending: [callbackUrlBase, 'hiPayStatus=pending'].join('&'),
          success: [callbackUrlBase, 'hiPayStatus=success'].join('&'),
        },
      });

      billingContactPromise = this.ovhContacts
        .findMatchingContactFromNic()
        .then((contact) => {
          if (!contact.id) {
            return this.ovhContacts
              .createContact(contact);
          }

          return contact;
        })
        .then(({ id }) => {
          addPaymentParams.billingContactId = id;
          return true;
        });
    } else {
      // if it's an "original", it is paypal
      addPaymentParams.returnUrl = callbackUrlBase;
    }

    return billingContactPromise
      .then(() => this.ovhPaymentMethod
        .addPaymentMethod(paymentModel.paymentType, addPaymentParams))
      .catch(() => {
        this.loading.addPayment = false;
      });
  }

  /* -----  End of Actions  ------ */

  /* =============================
  =            Events            =
  ============================== */

  onNextBtnClick() {
    const paymentModel = this.getStepByName('payment').model;

    // if default payment - create project
    if (paymentModel.defaultPaymentMethod) {
      return this.createProject();
    }

    // if no default payment mehtod - add new one before creating project
    return this.addPaymentMethod();
  }

  /* -----  End of Events  ------ */

  /* =====================================
  =            Initialization            =
  ====================================== */

  $onInit() {
    // manage messages
    this.CucCloudMessage.unSubscribe('pci.projects.new');
    this.messages.handler = this.CucCloudMessage.subscribe('pci.projects.new', {
      onMessage: () => {
        this.messages.list = this.messages.handler.getMessages();
      },
    });

    if (this.paymentStatus === 'success') {
      return this.createProject();
    }

    if (this.paymentStatus) {
      this.CucCloudMessage.error(this.$translate.instant('pci_projects_new_add_payment_error_message'));
    }

    return true;
  }

  /* -----  End of Initialization  ------ */
}
