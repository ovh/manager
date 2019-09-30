export default class {
  /* @ngInject */
  constructor(
    $scope,
    $translate,
    OvhApiTelephony,
    OvhContact,
    TucToast,
    TucToastError,
  ) {
    this.$scope = $scope;
    this.$translate = $translate;
    this.OvhApiTelephony = OvhApiTelephony;
    this.OvhContact = OvhContact;
    this.orderStep = null;
    this.TucToast = TucToast;
    this.TucToastError = TucToastError;
  }

  $onInit() {
    this.quantity = 0;
    this.order = {
      contact: null,
      shipping: {
        mode: null,
        relay: null,
        options: {
          forceContactSelect: true,
          payForRelay: true,
        },
      },
      summary: null,
      retract: true,
      isContractAccepted: null,
      url: null,
      success: false,
      orderURL: null,
      brand: null,
    };

    this.contactChoiceOptions = {
      filter: this.filterContacts,
    };

    this.orderStep = 'phone_and_shipping';
  }

  changeStep(step) {
    this.orderStep = step;
    switch (this.orderStep) {
      case 'phone_and_shipping':
        this.quantity = 0;
        this.contactChoiceOptions = {
          filter: this.filterContacts,
        };
        break;
      case 'summary':
        this.isStepLoading = true;
        this.order.isContractAccepted = false;
        this.fetchOrder()
          .then((result) => {
            this.order.summary = result;
          })
          .catch(err => this.TucToastError(err))
          .finally(() => {
            this.isStepLoading = false;
          });
        break;
      default:
        break;
    }
  }

  fetchOrder() {
    const params = {
      brand: this.order.brand,
      quantity: this.quantity,
      shippingContactId: this.order.contact.id,
    };
    if (this.order.shipping.mode !== 'transporter') {
      params.mondialRelayId = this.order.shipping.relay.id;
    }
    return this.OvhApiTelephony.Spare()
      .v6()
      .getNewSpare(params).$promise;
  }

  submitOrder() {
    const params = {
      brand: this.order.brand,
      quantity: this.quantity,
      shippingContactId: this.order.contact.id,
    };
    if (this.order.shipping.mode !== 'transporter') {
      params.mondialRelayId = this.order.shipping.relay.id;
    }
    this.isSubmiting = true;
    return this.OvhApiTelephony.Spare()
      .v6()
      .orderNewSpare(params)
      .$promise.then((order) => {
        this.order.success = true;
        this.order.orderURL = order.url;
        this.orderStep = 'phone_and_shipping';
      })
      .catch(err => this.TucToastError(err))
      .finally(() => {
        this.isSubmiting = false;
      });
  }
}
