import find from 'lodash/find';
import {
  ORDER_CHECK_PAYMENT_TIMEOUT_OVER,
  ORDER_FOLLOW_UP_HISTORY_STATUS_ENUM,
  ORDER_FOLLOW_UP_STATUS_ENUM,
  ORDER_FOLLOW_UP_STEP_ENUM,
} from '../../projects.constant';

import PciVoucher from '../components/voucher/voucher.class';

const getPaymentMethodTimeoutLimit = 30000;
const ANTI_FRAUD = {
  CASE_FRAUD_REFUSED: '(error 906)',
  POLLING_INTERVAL: 2000,
};

export default class PciProjectNewPaymentCtrl {
  /* @ngInject */
  constructor(
    $timeout,
    $translate,
    $q,
    $window,
    $state,
    $location,
    coreConfig,
    coreURLBuilder,
    CucCloudMessage,
    atInternet,
    pciProjectNew,
    PciProjectsService,
    ovhPaymentMethod,
    OVH_PAYMENT_METHOD_INTEGRATION_TYPE,
  ) {
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.$q = $q;
    this.$window = $window;
    this.$state = $state;
    this.$location = $location;
    this.coreConfig = coreConfig;
    this.coreURLBuilder = coreURLBuilder;
    this.CucCloudMessage = CucCloudMessage;
    this.atInternet = atInternet;
    this.pciProjectNew = pciProjectNew;
    this.PciProjectsService = PciProjectsService;
    this.ovhPaymentMethod = ovhPaymentMethod;
    this.OVH_PAYMENT_METHOD_INTEGRATION_TYPE = OVH_PAYMENT_METHOD_INTEGRATION_TYPE;

    // other attributes
    [
      this.paymentMethodUrl,
      this.paymentMethodAddUrl,
    ] = coreURLBuilder.buildURLs([
      { application: 'dedicated', path: '#/billing/payment/method' },
      { application: 'dedicated', path: '#/billing/payment/method/add' },
    ]);
    this.integrationSubmitFn = null;

    this.message = {
      handler: null,
      list: null,
    };

    this.onIntegrationSubmit = PciProjectNewPaymentCtrl.onIntegrationSubmit;
  }

  /* ==============================
  =            Helpers            =
  =============================== */

  refreshMessages() {
    this.message.list = this.message.handler.getMessages();
  }

  pollCheckDefaultPaymentMethod(paymentMethodId, currentTime = 0) {
    return this.$timeout(() => {
      return this.getPaymentMethod(paymentMethodId).then((paymentMethod) => {
        if (paymentMethod.status === 'VALID') {
          return this.$q.when();
        }

        return currentTime >= getPaymentMethodTimeoutLimit
          ? this.$q.reject({ status: ORDER_CHECK_PAYMENT_TIMEOUT_OVER })
          : this.pollCheckDefaultPaymentMethod(
              paymentMethodId,
              currentTime + 1000,
            );
      });
    }, 1000);
  }

  checkPaymentMethodAndCreateProject(paymentMethodId) {
    if (!paymentMethodId) {
      return this.$q.reject();
    }

    this.isCheckingPaymentMethod = true;
    return this.pollCheckDefaultPaymentMethod(paymentMethodId)
      .then(() => this.createProject())
      .catch((error) => {
        if (error?.status === ORDER_CHECK_PAYMENT_TIMEOUT_OVER) {
          this.hasCheckingError = true;
          this.trackProjectCreationError(
            'payment',
            'pci_project_new_payment_check_error',
          );
          this.trackProjectCreationError(
            'payment',
            'pci_project_new_payment_check_payment_method_status',
          );
          if (this.model.paymentMethod.isHandleByComponent())
            this.$state.go(
              this.viewOptions.stateName,
              { skipCallback: true },
              { inherit: false },
            );
        }
      })
      .finally(() => {
        this.isCheckingPaymentMethod = false;
      });
  }

  displayCucCloudMessage(type, suffix) {
    this.CucCloudMessage[type](
      this.$translate.instant(
        `pci_project_new_payment_check_anti_fraud_case_${suffix}`,
      ),
      'pci.projects.new.payment',
    );

    this.trackProjectCreationError(
      'payment',
      `pci_project_new_payment_check_anti_fraud_case_${suffix}`,
    );
  }

  displayAntiFraudMessage(validatingStep, order) {
    const {
      FRAUD_DOCS_REQUESTED,
      FRAUD_MANUAL_REVIEW,
    } = ORDER_FOLLOW_UP_HISTORY_STATUS_ENUM;

    (validatingStep?.history || []).forEach(({ label }) => {
      if ([FRAUD_MANUAL_REVIEW, FRAUD_DOCS_REQUESTED].includes(label)) {
        this.trackPage('antifraud-verification');
        this.orderBillingUrl = this.buildOrderBillingUrl(order);
        this.needToCheckCustomerInformations = true;
        this.displayCucCloudMessage('warning', label.toLowerCase());
      }
    });
  }

  static validatingStepIsDoing(validatingStep) {
    return validatingStep.status === ORDER_FOLLOW_UP_STATUS_ENUM.DOING;
  }

  static isAntiFraudCases(validatingStep) {
    const {
      FRAUD_DOCS_REQUESTED,
      FRAUD_MANUAL_REVIEW,
    } = ORDER_FOLLOW_UP_HISTORY_STATUS_ENUM;

    return !!validatingStep.history.find(({ label }) =>
      [FRAUD_MANUAL_REVIEW, FRAUD_DOCS_REQUESTED].includes(label),
    );
  }

  buildOrderBillingUrl({ orderId }) {
    return this.coreURLBuilder.buildURL(
      'dedicated',
      '#/billing/orders/:orderId',
      {
        orderId,
      },
    );
  }

  stopAntiFraudChecker() {
    if (this.followUpPolling) {
      this.$timeout.cancel(this.followUpPolling);
      this.followUpPolling = null;
    }
  }

  startAntiFraudChecker(resolve, order) {
    this.followUpPolling = this.$timeout(() => {
      this.PciProjectsService.getOrderFollowUp(order.orderId)
        .then((followUp) =>
          find(followUp, {
            step: ORDER_FOLLOW_UP_STEP_ENUM.VALIDATING,
          }),
        )
        .then((validatingStep) => {
          if (PciProjectNewPaymentCtrl.validatingStepIsDoing(validatingStep)) {
            if (PciProjectNewPaymentCtrl.isAntiFraudCases(validatingStep)) {
              this.needToCheckCustomerInformations = true;
              this.displayAntiFraudMessage(validatingStep, order);
              return this.stopAntiFraudChecker();
            }

            return true;
          }

          return resolve(order);
        })
        .finally(() => {
          if (this.followUpPolling) {
            this.startAntiFraudChecker(resolve, order);
          }
        });
    }, ANTI_FRAUD.POLLING_INTERVAL);
  }

  initFreeTrialVoucher() {
    if (this.freeTrialEligibility?.voucher) {
      const { voucher, value } = this.freeTrialEligibility;
      this.model.voucher = new PciVoucher({
        value,
        valid: true,
        paymentMethodRequired: true,
        credit: voucher.credit,
      });
    }
    return null;
  }

  manageProjectCreation() {
    // reset message
    this.CucCloudMessage.flushMessages('pci.projects.new.payment');

    let infraConfigPromise = Promise.resolve(true);
    let creditPromise = Promise.resolve(true);

    if (!this.cart.projectItem.infrastructureConfiguration) {
      infraConfigPromise = this.pciProjectNew.setCartProjectItemInfrastructure(
        this.cart,
      );
    }

    if (
      this.model.paymentMethod &&
      this.model.paymentMethod.paymentType === 'CREDIT' &&
      this.model.credit &&
      !this.cart.creditOption
    ) {
      creditPromise = this.pciProjectNew.setCartProjectItemCredit(
        this.cart,
        this.model.credit.value,
      );
    }

    this.globalLoading.finalize = true;

    return this.$q
      .all([infraConfigPromise, creditPromise])
      .then(() => this.pciProjectNew.checkoutCart(this.cart))
      .then(({ prices }) => {
        // after GET /order/cart/{cartId}/checkout we know if a credit needs to be paid
        // with the total not equal to 0
        if (prices.withTax.value !== 0) {
          return this.onAskCreditPayment();
        }
        return this.pciProjectNew.finalizeCart(this.cart);
      })
      .then((order) => {
        if (order?.orderId) {
          return this.$q((resolve) =>
            this.startAntiFraudChecker(resolve, order),
          ).then(() => this.onCartFinalized(order));
        }

        return null;
      })
      .catch(({ data }) => {
        if (data.message.includes(ANTI_FRAUD.CASE_FRAUD_REFUSED)) {
          this.trackPage('antifraud-error');
          this.CucCloudMessage.error(
            this.$translate.instant(
              'pci_project_new_payment_check_anti_fraud_case_fraud_refused',
            ),
            'pci.projects.new.payment',
          );

          this.trackProjectCreationError(
            'payment',
            'pci_project_new_payment_check_anti_fraud_case_fraud_refused',
          );
        }

        this.CucCloudMessage.error(
          this.$translate.instant('pci_project_new_payment_checkout_error'),
          'pci.projects.new.payment',
        );

        this.trackProjectCreationError(
          'payment',
          'pci_project_new_payment_checkout_error',
        );

        this.componentInitialParams = null;
        this.hasComponentRedirectCallback = false;
      })
      .finally(() => {
        this.globalLoading.finalize = false;
      });
  }

  isInvalidPaymentMethod() {
    const { finalize, setDefaultPaymentMethod } = this.globalLoading;
    const {
      defaultPaymentMethod,
      isVoucherValidating,
      isVoucherRequirePaymentMethod,
      challenge,
      paymentMethod,
    } = this.model;

    return (
      finalize ||
      isVoucherValidating ||
      (isVoucherRequirePaymentMethod && !this.defaultPaymentMethod) ||
      (this.eligibility.isChallengePaymentMethodRequired() &&
        !challenge.isValid(this.defaultPaymentMethod.paymentType)) ||
      (!paymentMethod && this.eligibility.isAddPaymentMethodRequired()) ||
      (!this.defaultPaymentMethod &&
        !defaultPaymentMethod &&
        this.eligibility.isDefaultPaymentMethodChoiceRequired()) ||
      challenge.checking ||
      (finalize && this.eligibility.isAddPaymentMethodRequired()) ||
      setDefaultPaymentMethod
    );
  }

  canProceedToCreateProject() {
    return (
      this.defaultPaymentMethod ||
      !this.model.paymentMethod ||
      (this.eligibility.isDefaultPaymentMethodChoiceRequired() &&
        !this.model.paymentMethod &&
        !this.isCheckingPaymentMethod)
    );
  }

  getInprogressValidationPaymentMethod() {
    return this.ovhPaymentMethod
      .getAllPaymentMethods()
      .then((paymentMethods) => {
        return paymentMethods
          .reverse()
          .find(
            ({ integration, paymentType, status }) =>
              integration === 'REDIRECT' &&
              paymentType === 'CREDIT_CARD' &&
              status === 'CREATED',
          );
      });
  }

  /* -----  End of Helpers  ------ */

  /* =============================
  =            Events            =
  ============================== */

  initComponentInitialParams() {
    this.atInternet.trackClick({
      name: `${this.viewOptions.trackingPrefix}continue`,
      type: 'action',
    });
    this.componentInitialParams = {
      locale: this.coreConfig.getUser().language,
      paymentMethod: this.model.paymentMethod,
      setAsDefault: true,
    };
    this.model.reloadHandleByComponent = true;
  }

  trackOnPaymentFormSubmit(tag) {
    this.sendTrack(tag);
    return this.onPaymentFormSubmit();
  }

  onPaymentFormSubmit() {
    this.globalLoading.finalize = true;
    this.atInternet.trackClick({
      name: `${this.viewOptions.trackingPrefix}continue`,
      type: 'action',
    });
    let challengePromise = Promise.resolve(true);
    let defaultPaymentMethodPromise = Promise.resolve(true);
    let setDefaultPaymentMethodInError = false;

    // call integration submit function if some
    if (
      this.eligibility.isAddPaymentMethodRequired() &&
      this.model.paymentMethod.paymentType !== 'CREDIT' &&
      this.integrationSubmitFn
    ) {
      return this.integrationSubmitFn();
    }

    if (this.eligibility.isChallengePaymentMethodRequired()) {
      this.model.challenge.checking = true;

      challengePromise = this.ovhPaymentMethod
        .challengePaymentMethod(
          this.defaultPaymentMethod,
          this.model.challenge.value,
        )
        .then(() => {
          this.model.challenge.resetError();
        })
        .catch(({ status }) => {
          if (status === 404) {
            return this.reloadPayment().then(() => {
              this.CucCloudMessage.error(
                this.$translate.instant(
                  'pci_project_new_payment_challenge_error_payment_method_deactivated',
                ),
                'pci.projects.new.payment',
              );
              this.trackProjectCreationError(
                'payment',
                'pci_project_new_payment_challenge_error_payment_method_deactivated',
              );
            });
          }

          this.model.challenge.setError(status);

          this.trackProjectCreationError(
            'payment',
            `pci_project_new_payment_challenge_error_${this.model.challenge.error.toLowerCase()}`,
          );

          return null;
        })
        .finally(() => {
          this.globalLoading.finalize = false;
          this.model.challenge.checking = false;
        });
    }

    if (
      this.eligibility.isDefaultPaymentMethodChoiceRequired() &&
      this.model.defaultPaymentMethod
    ) {
      this.globalLoading.setDefaultPaymentMethod = true;

      defaultPaymentMethodPromise = this.ovhPaymentMethod
        .setPaymentMethodAsDefault(this.model.defaultPaymentMethod)
        .catch(() => {
          this.CucCloudMessage.error(
            this.$translate.instant(
              'pci_project_new_payment_set_default_payment_method_error',
            ),
            'pci.projects.new.payment',
          );
          this.trackProjectCreationError(
            'payment',
            'pci_project_new_payment_set_default_payment_method_error',
          );

          setDefaultPaymentMethodInError = true;

          return null;
        })
        .finally(() => {
          this.globalLoading.setDefaultPaymentMethod = false;
        });
    }

    return Promise.all([challengePromise, defaultPaymentMethodPromise]).then(
      () => {
        return !this.model.challenge.error && !setDefaultPaymentMethodInError
          ? this.createProject()
          : null;
      },
    );
  }

  createProject() {
    if (this.viewOptions.onSubmit) {
      return this.viewOptions.onSubmit();
    }
    return this.manageProjectCreation();
  }

  /* -----  End of Events  ------ */

  /* ================================
  =            Callbacks            =
  ================================= */

  onIntegrationInitialized(integrationSubmitFn) {
    this.integrationSubmitFn = integrationSubmitFn;
  }

  static onIntegrationSubmit(additionalParams = {}) {
    return {
      default: true,
      register: true,
      ...additionalParams,
    };
  }

  onIntegrationSubmitSuccess(paymentMethodIdParam) {
    const paypalPaymentMethodId = paymentMethodIdParam?.paymentMethodId;
    const hiPayPaymentMethodId = this.callback?.paymentMethodId;
    const adyenPaymentMethodId = Number.isInteger(paymentMethodIdParam)
      ? paymentMethodIdParam
      : null;
    const paymentMethodId =
      paypalPaymentMethodId ||
      hiPayPaymentMethodId ||
      adyenPaymentMethodId ||
      this.defaultPaymentMethod?.paymentMethodId;
    const canProceedToValidation = !!(
      !this?.isCheckingPaymentMethod && paymentMethodId
    );

    return canProceedToValidation
      ? this.checkPaymentMethodAndCreateProject(paymentMethodId)
      : null;
  }

  onIntegrationSubmitError() {
    const errorMessage = this.$translate.instant(
      'pci_project_new_payment_create_error',
    );
    this.CucCloudMessage.error(errorMessage, 'pci.projects.new.payment');
    this.trackProjectCreationError(
      'payment',
      'pci_project_new_payment_create_error',
    );
    this.componentInitialParams = null;
    this.hasComponentRedirectCallback = false;
    if (this.model.paymentMethod.isHandleByComponent()) {
      const reload = this.$state.current.name === this.viewOptions.stateName;
      this.$state
        .go(
          this.viewOptions.stateName,
          { skipCallback: true, showError: true },
          reload ? { reload: true } : { inherit: false },
        )
        .then(() => {
          if (reload) {
            this.CucCloudMessage.error(
              errorMessage,
              'pci.projects.new.payment',
            );
          }
        });
    }
  }

  /* -----  End of Callbacks  ------ */

  /* ============================
  =            Hooks            =
  ============================= */

  $onInit() {
    this.message.handler = this.CucCloudMessage.subscribe(
      'pci.projects.new.payment',
      {
        onMessage: () => this.refreshMessages(),
      },
    );
    this.initFreeTrialVoucher();

    return null;
  }

  $onDestroy() {
    this.stopAntiFraudChecker();
  }

  /* -----  End of Hooks  ------ */
}
