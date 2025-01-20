import assign from 'lodash/assign';
import get from 'lodash/get';

import filterContact from './order.service';

export default class TelecomTelephonyLinePhoneOrderCtrl {
  /* @ngInject */
  constructor(
    $q,
    $scope,
    $translate,
    TucIpAddress,
    TelephonyMediator,
    OvhApiTelephony,
    OvhApiOrder,
    TucToast,
    TucToastError,
  ) {
    this.$q = $q;
    this.$scope = $scope;
    this.$translate = $translate;
    this.TucIpAddress = TucIpAddress;
    this.TelephonyMediator = TelephonyMediator;
    this.OvhApiOrder = OvhApiOrder;
    this.OvhApiTelephony = OvhApiTelephony;
    this.TucToast = TucToast;
    this.TucToastError = TucToastError;
  }

  $onInit() {
    this.orderStep = 'hardware';

    this.order = {
      contact: null,
      phone: null,
      summary: null,
      rmas: [],
      shipping: {
        mode: null,
        relay: null,
        options: {
          shippingPrice: 0,
        },
      },
      retract: true,
      isContractsAccepted: false,
      url: null,
      success: false,
      orderURL: null,
    };

    this.contactChoiceOptions = {
      filter: filterContact,
    };

    this.macAddress = null;
    this.line = null;
    this.phone = null;
    this.phoneOffers = null;
    this.hasPendingOfferTasks = false;

    this.isLoading = true;
    this.TelephonyMediator.getGroup(this.billingAccount)
      .then((group) => {
        this.line = group.getLine(this.serviceName);
      })
      .then(() =>
        this.OvhApiTelephony.Line()
          .v6()
          .get({
            billingAccount: this.line.billingAccount,
            serviceName: this.line.serviceName,
          })
          .$promise.then((result) => {
            assign(
              this.line,
              { getPublicOffer: result.getPublicOffer },
              {
                isAttachedToOtherLinesPhone: result.isAttachedToOtherLinesPhone,
              },
            );
          }),
      )
      .then(() => this.line.hasPendingOfferTasks())
      .then((hasPendingOfferTasks) => {
        this.hasPendingOfferTasks = hasPendingOfferTasks;
        return this.line.getPhone();
      })
      .then((phone) => {
        this.phone = phone;
        if (phone) {
          return phone.getRMAs().then((rmas) => {
            this.rmas = rmas;
          });
        }
        this.rmas = [];
        return phone;
      })
      .catch((err) => new this.TucToastError(err))
      .finally(() => {
        this.isLoading = false;
      });

    this.$scope.$watch('$ctrl.orderStep', (step) => {
      if (step === 'summary') {
        this.isStepLoading = true;
        this.order.isContractsAccepted = false;
        const params = {
          serviceName: this.serviceName,
          hardware: this.order.phone,
          retractation: this.order.retract,
          shippingContactId: this.order.contact.id,
        };
        if (get(this.order, 'shipping.mode') === 'mondialRelay') {
          params.mondialRelayId = this.order.shipping.relay.id;
        }
        this.isFetchingOrder = true;
        return this.OvhApiOrder.Telephony()
          .v6()
          .getHardware(params)
          .$promise.then((result) => {
            this.order.summary = result;
          })
          .catch((err) => new this.TucToastError(err))
          .finally(() => {
            this.isStepLoading = false;
            this.isFetchingOrder = false;
          });
      }
      return null;
    });

    /* Event to go to shipping view */
    this.$scope.$on('phoneSelected', (event, phone) => {
      this.orderStep = 'shipping';
      this.order.phone = phone;
    });

    /* Event to go back to phone view from shipping view */
    this.$scope.$on('hardwareFromShipping', () => {
      this.orderStep = 'hardware';
    });

    /* Event to go to summary view from shipping view */
    this.$scope.$on('summaryFromShipping', (event, order) => {
      this.orderStep = 'summary';
      this.order = order;
    });

    /* Event to go back to shipping view from summary view */
    this.$scope.$on('shippingFromSummary', (event, order) => {
      this.orderStep = 'shipping';
      this.order = order;
    });

    /* Event to submit order from summary view */
    this.$scope.$on('submitOrder', (event, order) => {
      this.order = order;
      this.submitOrder();
    });

    /* Event to return phone */
    this.$scope.$on('returnPhone', () => {
      this.orderStep = 'returnOnly';
    });
  }

  submitPhoneReturn() {
    this.isSubmiting = true;
    return this.OvhApiTelephony.Line()
      .Phone()
      .RMA()
      .v6()
      .post(
        {
          billingAccount: this.billingAccount,
          serviceName: this.serviceName,
        },
        {
          type: 'restitution but keep the service enable', // nice enum ...
        },
      )
      .$promise.then(() => this.phone.getRMAs())
      .then((rmas) => {
        this.rmas = rmas;
        this.returnSuccess = true;
        this.orderStep = 'hardware'; // reset form
      })
      .catch((err) => new this.TucToastError(err))
      .finally(() => {
        this.isSubmiting = false;
      });
  }

  submitOrder() {
    if (this.phone) {
      return this.submitRma();
    }
    const params = {
      hardware: this.order.phone,
      retractation: this.order.retract,
    };

    if (get(this.order, 'shipping.mode') === 'mondialRelay') {
      params.mondialRelayId = this.order.shipping.relay.id;
    }

    params.shippingContactId = this.order.contact.id;
    this.isSubmiting = true;
    return this.OvhApiOrder.Telephony()
      .v6()
      .orderHardware(
        {
          serviceName: this.serviceName,
        },
        params,
      )
      .$promise.then((order) => {
        this.order.success = true;
        this.order.orderURL = order.url;
        this.orderStep = 'hardware'; // reset form
      })
      .catch((err) => new this.TucToastError(err))
      .finally(() => {
        this.isSubmiting = false;
      });
  }

  submitRma() {
    const params = {
      newMerchandise: this.order.phone,
      type:
        'change to another phone/equipment (restitution first and shipping then)', // nice enum ...
    };

    if (get(this.order, 'shipping.mode') === 'mondialRelay') {
      params.mondialRelayId = this.order.shipping.relay.id;
    } else {
      params.shippingContactId = this.order.contact.id;
    }

    this.isSubmiting = true;
    return this.OvhApiTelephony.Line()
      .Phone()
      .RMA()
      .v6()
      .post(
        {
          billingAccount: this.billingAccount,
          serviceName: this.serviceName,
        },
        params,
      )
      .$promise.then(() => this.phone.getRMAs())
      .then((rmas) => {
        this.rmas = rmas;
        this.order.success = true;
        this.orderStep = 'hardware'; // reset form
      })
      .catch((err) => new this.TucToastError(err))
      .finally(() => {
        this.isSubmiting = false;
      });
  }
}
