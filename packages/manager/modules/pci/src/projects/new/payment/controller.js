const getPaymentMethodTimeoutLimit = 30000;
export default class PciProjectNewPaymentCtrl {
  /* @ngInject */
  constructor(
    $timeout,
    $translate,
    $q,
    $window,
    coreConfig,
    coreURLBuilder,
    CucCloudMessage,
    pciProjectNew,
    ovhPaymentMethod,
    OVH_PAYMENT_METHOD_INTEGRATION_TYPE,
  ) {
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.$q = $q;
    this.$window = $window;
    this.CucCloudMessage = CucCloudMessage;
    this.pciProjectNew = pciProjectNew;
    this.ovhPaymentMethod = ovhPaymentMethod;
    this.OVH_PAYMENT_METHOD_INTEGRATION_TYPE = OVH_PAYMENT_METHOD_INTEGRATION_TYPE;
    this.coreConfig = coreConfig;

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
        if (paymentMethod.isValid()) {
          return this.$q.when();
        }

        return currentTime >= getPaymentMethodTimeoutLimit
          ? this.$q.reject()
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
    return (this.defaultPaymentMethod?.isLegacy()
      ? this.$q.when()
      : this.pollCheckDefaultPaymentMethod(paymentMethodId)
    )
      .then(() => {
        this.manageProjectCreation();
      })
      .catch(() => {
        this.hasCheckingError = true;
      })
      .finally(() => {
        this.isCheckingPaymentMethod = false;
      });
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
          return null;
        }

        return this.pciProjectNew.finalizeCart(this.cart);
      })
      .then((order) => {
        if (!order) {
          return this.onAskCreditPayment();
        }

        return this.onCartFinalized(order);
      })
      .catch(() => {
        this.CucCloudMessage.error(
          this.$translate.instant('pci_project_new_payment_checkout_error'),
          'pci.projects.new.payment',
        );

        this.componentInitialParams = null;
        this.hasComponentRedirectCallback = false;
      })
      .finally(() => {
        this.globalLoading.finalize = false;
      });
  }

  /* -----  End of Helpers  ------ */

  /* =============================
  =            Events            =
  ============================== */

  initComponentInitialParams() {
    this.componentInitialParams = {
      locale: this.coreConfig.getUser().language,
      paymentMethod: this.model.paymentMethod,
      setAsDefault: true,
    };
  }

  onPaymentFormSubmit() {
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
            });
          }

          this.model.challenge.setError(status);

          return null;
        })
        .finally(() => {
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
          ? this.manageProjectCreation()
          : null;
      },
    );
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
    const paymentMethodId =
      paymentMethodIdParam || this.defaultPaymentMethod?.paymentMethodId;
    return this.checkPaymentMethodAndCreateProject(paymentMethodId);
  }

  onIntegrationSubmitError() {
    this.CucCloudMessage.error(
      this.$translate.instant('pci_project_new_payment_create_error'),
      'pci.projects.new.payment',
    );

    this.componentInitialParams = null;
    this.hasComponentRedirectCallback = false;
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

    // check if addPayment status is in URL
    // and no paymentMethod needs to be added
    // and there is a default payment method.
    // In this case it means that a payment method has been added
    // and that the APIs eligibility AND payment are sync.
    // In other case, for example: when eligibility requires a payment method
    // and there is a paymentStatus in URL, the onIntegrationSubmitSuccess will be triggered
    // automatically.
    if (
      !this.eligibility.isAddPaymentMethodRequired() &&
      this.defaultPaymentMethod &&
      this.paymentStatus === 'success'
    ) {
      return this.checkPaymentMethodAndCreateProject(
        this.defaultPaymentMethod.paymentMethodId,
      );
    }

    return null;
  }

  /* -----  End of Hooks  ------ */
}
