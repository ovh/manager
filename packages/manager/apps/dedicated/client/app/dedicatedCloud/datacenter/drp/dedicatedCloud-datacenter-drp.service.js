import camelCase from 'lodash/camelCase';
import flatten from 'lodash/flatten';
import get from 'lodash/get';
import keys from 'lodash/keys';
import map from 'lodash/map';

import {
  DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS,
  DEDICATEDCLOUD_DATACENTER_DRP_ORDER_OPTIONS,
  DEDICATEDCLOUD_DATACENTER_DRP_STATUS,
  DEDICATEDCLOUD_DATACENTER_PCC_UNAVAILABLE_CODES,
} from './dedicatedCloud-datacenter-drp.constants';

export default class {
  /* @ngInject */
  constructor(
    $q,
    OvhApiDedicatedCloud,
    OvhApiMe,
    OvhApiOrder,
    ovhPaymentMethod,
  ) {
    this.$q = $q;
    this.OvhApiDedicatedCloud = OvhApiDedicatedCloud;
    this.OvhApiMe = OvhApiMe;
    this.OvhApiOrder = OvhApiOrder;
    this.ovhPaymentMethod = ovhPaymentMethod;
  }

  getPccIpAddresses(serviceName) {
    return this.OvhApiDedicatedCloud.Ip().v6().query({
      serviceName,
    }).$promise
      .then(ipAddresses => ipAddresses
        .map(ipAddress => this.OvhApiDedicatedCloud.Ip().v6()
          .get({
            serviceName,
            network: ipAddress,
          }).$promise));
  }

  getPccDrpPlan(serviceName) {
    return this.OvhApiDedicatedCloud.Datacenter().v6().query({
      serviceName,
    }).$promise
      .then(datacenters => this.$q.all(datacenters
        .map(datacenterId => this.getDrpState({
          serviceName,
          datacenterId,
        }))))
      .catch(error => (DEDICATEDCLOUD_DATACENTER_PCC_UNAVAILABLE_CODES.includes(error.status)
        ? this.$q.when([]) : this.$q.reject(error)));
  }

  getPccIpAddressesDetails(serviceName) {
    return this.OvhApiDedicatedCloud.Ip().v6().query({
      serviceName,
    }).$promise
      .then(ipAddresses => this.$q.all(ipAddresses
        .map(ipAddress => this.OvhApiDedicatedCloud.Ip().Details()
          .v6()
          .get({
            serviceName,
            network: ipAddress,
          }).$promise))
        .then(ipAddressesDetails => flatten(ipAddressesDetails)));
  }

  getDrpState(serviceInformations) {
    return this.OvhApiDedicatedCloud
      .Datacenter().Zerto().v6().state(serviceInformations, null).$promise
      .then(state => ({ ...state, ...serviceInformations }));
  }

  enableDrp(drpInformations, isLegacy) {
    const isOvhToOvhPlan = drpInformations
      .drpType === DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS.ovh;

    if (!isLegacy) {
      return isOvhToOvhPlan
        ? this.enableDrpOvh(drpInformations)
        : this.enableDrpOnPremise(drpInformations);
    }

    return isOvhToOvhPlan ? this.enableDrpOvhLegacy(drpInformations)
      : this.enableDrpOnPremiseLegacy(drpInformations);
  }

  /* ================================= */
  /*          PCC Legacy Ovh           */
  /* ================================= */

  enableDrpOvhLegacy({
    primaryPcc,
    primaryDatacenter,
    primaryEndpointIp,
    secondaryPcc,
    secondaryDatacenter,
    secondaryEndpointIp,
  }) {
    return this.OvhApiDedicatedCloud.Datacenter().Zerto().v6().enable({
      serviceName: primaryPcc.serviceName,
      datacenterId: primaryDatacenter.id,
    }, {
      primaryEndpointIp,
      secondaryServiceName: secondaryPcc.serviceName,
      secondaryDatacenterId: secondaryDatacenter.id,
      secondaryEndpointIp,
    }).$promise;
  }

  enableDrpOnPremiseLegacy({
    primaryPcc,
    primaryDatacenter,
    localVraNetwork,
    ovhEndpointIp,
    remoteVraNetwork,
  }) {
    return this.OvhApiDedicatedCloud.Datacenter().Zerto().Single().v6()
      .enable({
        serviceName: primaryPcc.serviceName,
        datacenterId: primaryDatacenter.id,
      }, {
        localVraNetwork,
        ovhEndpointIp,
        remoteVraNetwork,
      }).$promise;
  }

  /* ------ END PCC Legacy OVH ------- */

  /* ================================= */
  /*        Order ZERTO option         */
  /* ================================= */

  enableDrpOvh(drpInformations) {
    return this.orderZertoOption(
      drpInformations,
      DEDICATEDCLOUD_DATACENTER_DRP_ORDER_OPTIONS.zertoOption.ovh,
    );
  }

  createZertoOptionCart(drpInformations, zertoOption) {
    let zertoCartId;
    return this.OvhApiMe.v6().get().$promise
      .then(({ ovhSubsidiary }) => this.OvhApiOrder.Cart().v6().post({}, { ovhSubsidiary })
        .$promise)
      .then(({ cartId }) => {
        zertoCartId = cartId;
        return this.OvhApiOrder.Cart().v6().assign({ cartId }).$promise;
      })
      .then(() => this.OvhApiOrder.Cart().ServiceOption().v6().get({
        productName: DEDICATEDCLOUD_DATACENTER_DRP_ORDER_OPTIONS.productName,
        serviceName: drpInformations.primaryPcc.serviceName,
      }).$promise)
      .then((offers) => {
        const [firstOffer] = offers;
        const [firstPrice] = firstOffer.prices;

        return this.OvhApiOrder.Cart().ServiceOption().v6().post({
          productName: DEDICATEDCLOUD_DATACENTER_DRP_ORDER_OPTIONS.productName,
          serviceName: drpInformations.primaryPcc.serviceName,
        }, {
          cartId: zertoCartId,
          duration: DEDICATEDCLOUD_DATACENTER_DRP_ORDER_OPTIONS.duration,
          planCode: zertoOption,
          pricingMode: firstPrice.pricingMode,
          quantity: DEDICATEDCLOUD_DATACENTER_DRP_ORDER_OPTIONS.quantity,
        }).$promise;
      });
  }

  validateZertoOptionCart(cartId) {
    let autoPayWithPreferredPaymentMethod;
    return this.$q.all({
      availableAutomaticPaymentsMean:
        this.OvhApiMe.AvailableAutomaticPaymentMeans().v6().get().$promise,
      allPaymentMethods:
        this.ovhPaymentMethod.getAllPaymentMethods({ onlyValid: true, transform: true }),
    })
      .then(({ availableAutomaticPaymentsMean, allPaymentMethods }) => {
        const availablePaymentType = flatten(map(allPaymentMethods, 'paymentType'));
        autoPayWithPreferredPaymentMethod = availablePaymentType
          .some(({ value }) => get(availableAutomaticPaymentsMean, camelCase(value)));

        return this.OvhApiOrder.Cart().v6().checkout({
          cartId,
        }, {
          autoPayWithPreferredPaymentMethod,
          waiveRetractationPeriod: false,
        }).$promise;
      })
      .then(({ orderId, url }) => ({
        hasAutoPay: autoPayWithPreferredPaymentMethod,
        orderId,
        url,
        state: DEDICATEDCLOUD_DATACENTER_DRP_STATUS.toDo,
      }));
  }

  orderZertoOption(drpInformations, zertoOption) {
    let zertoCartId;
    return this.createZertoOptionCart(drpInformations, zertoOption)
      .then(({ cartId, itemId }) => {
        zertoCartId = cartId;
        return this.addCartZertoOptionConfiguration(
          cartId,
          itemId,
          this.constructor.getZertoConfiguration(drpInformations, zertoOption),
        );
      })
      .then(() => this.validateZertoOptionCart(zertoCartId));
  }

  addCartZertoOptionConfiguration(cartId, itemId, drpInformations) {
    const parametersToSet = keys(drpInformations);

    return this.$q.all(parametersToSet
      .map(parameter => this.OvhApiOrder.Cart().Item().Configuration().v6()
        .post({
          cartId,
          itemId,
          label: parameter,
          value: get(drpInformations, parameter),
        }).$promise));
  }

  getZertoOptionOrderStatus(orderId) {
    return this.OvhApiMe.Order().v6().getStatus({ orderId }).$promise;
  }

  /* ------- Order ZERTO option ------ */

  disableDrp(drpInformations) {
    return drpInformations.drpType === DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS.ovh
      ? this.disableDrpOvh(drpInformations)
      : this.disableDrpOnPremise(drpInformations);
  }

  disableDrpOvh({
    primaryPcc,
    primaryDatacenter,
    secondaryPcc,
    secondaryDatacenter,
  }) {
    return this.OvhApiDedicatedCloud.Datacenter().Zerto().v6()
      .disable({
        serviceName: primaryPcc.serviceName,
        datacenterId: primaryDatacenter.id,
      }, {
        secondaryServiceName: secondaryPcc.serviceName,
        secondaryDatacenterId: secondaryDatacenter.id,
      }).$promise;
  }

  disableDrpOnPremise({ primaryPcc, primaryDatacenter }) {
    return this.OvhApiDedicatedCloud.Datacenter().Zerto().Single().v6()
      .disable({
        serviceName: primaryPcc.serviceName,
        datacenterId: primaryDatacenter.id,
      }, null).$promise;
  }

  regenerateZsspPassword({ primaryPcc, primaryDatacenter }) {
    return this.OvhApiDedicatedCloud.Datacenter().Zerto().v6()
      .generateZsspPassword({
        serviceName: primaryPcc.serviceName,
        datacenterId: primaryDatacenter.id,
      }, null).$promise;
  }

  static getZertoConfiguration(drpInformations, zertoOption) {
    return zertoOption === DEDICATEDCLOUD_DATACENTER_DRP_ORDER_OPTIONS.zertoOption.ovh
      ? {
        datacenter_id: drpInformations.primaryDatacenter.id,
        primaryEndpointIp: drpInformations.primaryEndpointIp,
        secondaryEndpointIp: drpInformations.secondaryEndpointIp,
        secondaryServiceName: drpInformations.secondaryPcc.serviceName,
        secondaryDatacenterId: drpInformations.secondaryDatacenter.id,
      }
      : {
        datacenter_id: drpInformations.primaryDatacenter.id,
        ovhEndpointIp: drpInformations.ovhEndpointIp,
        localVraNetwork: drpInformations.localVraNetwork,
        remoteVraNetwork: drpInformations.remoteVraNetwork,
      };
  }
}
