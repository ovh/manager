import _ from 'lodash';

export default class {
  /* @ngInject */
  constructor(
    $scope,
    $translate,
    OvhApiXdsl,
    OvhContact,
    TucToast,
    TucToastError,
  ) {
    this.$scope = $scope;
    this.$translate = $translate;
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
      filter: this.filterContact,
    };

    this.orderStep = 'modem_and_shipping';
  }

  changeStep(step) {
    this.orderStep = step;
    switch (this.orderStep) {
      case 'modem_and_shipping':
        this.quantity = 0;
        this.contactChoiceOptions = {
          filter: this.filterContact,
        };
        break;
      case 'summary':
        this.isStepLoading = true;
        this.order.isContractAccepted = false;
        this.fetchOrder().then((result) => {
          this.order.summary = result;
        }).catch(err => this.TucToastError(err))
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
    return this.OvhApiXdsl.Spare().v6().getNewSpare(params).$promise;
  }

  /* eslint-disable class-methods-use-this */
  filterContact(contacts) {
    return _.chain(contacts).groupBy((contact) => {
      // group contact to detect contact that are the same
      const contactCopy = {
        lastName: contact.lastName,
        firstName: contact.firstName,
      };
      if (contact.address) {
        contactCopy.address = {
          country: contact.address.country,
          line1: contact.address.line1,
          zip: contact.address.zip,
          city: contact.address.city,
        };
      }
      return JSON.stringify(contactCopy);
    }).map(groups => _.first(groups)).filter(contact => _.get(contact, 'address') && ['BE', 'FR', 'CH'].indexOf(contact.address.country) > -1)
      .value();
  }
  /* eslint-enable class-methods-use-this */

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
    return this.OvhApiXdsl.Spare().v6().orderNewSpare(params).$promise.then((order) => {
      this.order.success = true;
      this.order.orderURL = order.url;
      this.orderStep = 'modem_and_shipping';
    }).catch(err => this.TucToastError(err))
      .finally(() => {
        this.isSubmiting = false;
      });
  }
}
