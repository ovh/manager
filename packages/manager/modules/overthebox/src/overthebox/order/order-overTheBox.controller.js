import head from 'lodash/head';

export default class OrderOverTheBoxCtrl {
  /* @ngInject */
  constructor(
    $translate,
    $q,
    $scope,
    OvhApiOrderOverTheBoxNew,
    OvhApiPriceOverTheBoxOffer,
    OvhApiOverTheBox,
    TucToastError,
    OvhApiMePaymentMean,
  ) {
    this.$translate = $translate;
    this.$q = $q;
    this.$scope = $scope;
    this.OvhApiOrderOverTheBoxNew = OvhApiOrderOverTheBoxNew;
    this.OvhApiPriceOverTheBoxOffer = OvhApiPriceOverTheBoxOffer;
    this.OvhApiOverTheBox = OvhApiOverTheBox;
    this.TucToastError = TucToastError;
    this.OvhApiMePaymentMean = OvhApiMePaymentMean;
  }

  $onInit() {
    this.loaders = {
      durations: false,
      order: false,
      orders: false,
      create: false,
      checking: false,
    };

    this.durations = [];
    this.offers = [];
    this.devices = [];
    this.hasDefaultPaymentMeans = false;

    // when true, the customer is proposed to attach a device before ordering a new service
    this.proposeLinkDevice = false;

    this.orderModel = {
      offer: null,
      duration: null,
      deviceId: null,
      voucher: null,
    };

    this.states = {
      order: false,
      orderDone: false,
    };

    this.checkPaymentMeans();
    this.checkDevices();

    this.$scope.$watchCollection(
      () => this.orderModel,
      () => {
        if (
          !this.loaders.order &&
          this.orderModel.offer &&
          this.orderModel.duration
        ) {
          this.getOrder();
        }
      },
    );
  }

  checkPaymentMeans() {
    this.paymentMeansChecking = false;
    return this.OvhApiMePaymentMean.v6()
      .getDefaultPaymentMean()
      .then((defaultPaymentMean) => {
        this.hasDefaultPaymentMeans = !!defaultPaymentMean;
      })
      .finally(() => {
        this.paymentMeansChecking = false;
      });
  }

  checkDevices() {
    this.loaders.checking = true;
    return this.$q
      .all([
        this.OvhApiOverTheBox.v6()
          .checkDevices()
          .$promise.then((devices) => {
            this.devices = devices;
            return devices;
          })
          .catch((error) => {
            this.error.checking = error.data;
            return new this.TucToastError(error);
          }),
        this.OvhApiOverTheBox.Aapi()
          .getServices()
          .$promise.then((services) => {
            this.services = services;
            this.unlinkedServices = services.filter(
              (service) => !service.device,
            );
            return this.unlinkedServices;
          })
          .catch((err) => new this.TucToastError(err)),
      ])
      .then(() => {
        this.orphanDevices = this.devices.filter((device) => {
          let found = false;
          this.services.forEach((service) => {
            found = service.device.deviceId === device.deviceId ? true : found;
          });
          return !found;
        });
        this.proposeLinkDevice =
          this.devices.length > 0 && this.unlinkedServices.length > 0
            ? {
                service: this.unlinkedServices[0],
                devices:
                  this.orphanDevices.length === 1
                    ? this.orphanDevices[0]
                    : null,
              }
            : null;
      })
      .finally(() => {
        this.loaders.checking = false;
      });
  }

  startOrder() {
    return this.getOrderOffers().then((offers) => {
      if (offers.length === 1) {
        this.orderModel.offer = head(offers);
        this.getOrderDurations().finally(() => {
          this.states.order = true;
        });

        return offers;
      }
      this.states.order = true;
      return offers;
    });
  }

  getOrderOffers() {
    return this.OvhApiOverTheBox.v6()
      .availableOffers()
      .$promise.then((offers) => {
        this.offers = offers;

        return offers;
      })
      .catch((error) => {
        // eslint-disable-next-line no-new
        new this.TucToastError(null, 'order_overTheBox_offers_error');
        return this.$q.reject(error);
      });
  }

  getOrderDurations() {
    this.loaders.durations = true;

    return this.OvhApiOrderOverTheBoxNew.v6()
      .query({
        deviceId: this.orderModel.deviceId,
        offer: this.orderModel.offer,
        voucher: this.orderModel.voucher,
      })
      .$promise.then((durations) => {
        this.durations = durations;
        if (durations.length === 1) {
          this.orderModel.duration = head(this.durations);
        }
        if (this.devices.length === 1) {
          this.orderModel.deviceId = head(this.devices).deviceId;
        }

        return durations;
      })
      .catch((error) => new this.TucToastError(error))
      .finally(() => {
        this.loaders.durations = false;
      });
  }

  getOrder() {
    this.loaders.order = true;
    return this.OvhApiOrderOverTheBoxNew.v6()
      .get({
        duration: this.orderModel.duration,
        deviceId: this.orderModel.deviceId,
        offer: this.orderModel.offer || 'summit',
        voucher: this.orderModel.voucher,
      })
      .$promise.then((informations) => {
        this.orderInformations = informations;

        return informations;
      })
      .catch((error) => new this.TucToastError(error))
      .finally(() => {
        this.loaders.order = false;
      });
  }

  order() {
    this.loaders.create = true;
    return this.OvhApiOrderOverTheBoxNew.v6()
      .save(
        {
          duration: this.orderModel.duration,
        },
        {
          deviceId: this.orderModel.deviceId,
          offer: this.orderModel.offer,
          voucher: this.orderModel.voucher,
        },
      )
      .$promise.then((success) => {
        this.bcUrl = success.url;
        this.states.order = false;
        this.states.orderDone = true;

        return success;
      })
      .catch((error) => new this.TucToastError(error))
      .finally(() => {
        this.loaders.create = false;
      });
  }
}
