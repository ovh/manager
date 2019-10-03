import { ORDER } from '../../constant';

export default class {
  /* @ngInject */
  constructor(
    OvhApiXdsl,
    OvhContact,
    TucToast,
    TucToastError,
  ) {
    this.OvhApiXdsl = OvhApiXdsl;
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

    this.orderStep = ORDER.step.modemShipping;
  }

  changeStep(step) {
    this.orderStep = step;
    switch (this.orderStep) {
      case ORDER.step.modemShipping:
        this.quantity = 0;
        this.contactChoiceOptions = {
          filter: this.filterContacts,
        };
        break;
      case ORDER.step.summary:
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
      brand: this.order.brand.id,
      quantity: this.quantity,
      shippingContactId: this.order.contact.id,
    };
    if (this.order.shipping.mode === ORDER.shipping_mode.md) {
      params.mondialRelayId = this.order.shipping.relay.id;
    }
    return this.OvhApiXdsl.Spare()
      .v6()
      .getNewSpare(params).$promise;
  }

  submitOrder() {
    const params = {
      brand: this.order.brand.id,
      quantity: this.quantity,
      shippingContactId: this.order.contact.id,
    };
    if (this.order.shipping.mode === ORDER.shipping_mode.md) {
      params.mondialRelayId = this.order.shipping.relay.id;
    }
    this.isSubmiting = true;
    return this.OvhApiXdsl.Spare()
      .v6()
      .orderNewSpare(params)
      .$promise.then((order) => {
        this.order.success = true;
        this.order.orderURL = order.url;
        this.orderStep = ORDER.step.modemShipping;
      })
      .catch(err => this.TucToastError(err))
      .finally(() => {
        this.isSubmiting = false;
      });
  }

  isDisabled() {
    return (this.quantity === 0)
        || !this.order.brand
        || !this.order.contact
        || (this.order.shipping.mode === ORDER.shipping_mode.md
        && !this.order.shipping.relay);
  }
}
