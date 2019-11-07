import get from 'lodash/get';
import set from 'lodash/set';

export default class IpLoadBalancerSslCertificateService {
  /* @ngInject */
  constructor($q, OvhApiIpLoadBalancing, OvhApiMe, OvhApiOrder, CucServiceHelper) {
    this.$q = $q;
    this.OvhApiIpLoadBalancing = OvhApiIpLoadBalancing;
    this.Ssl = OvhApiIpLoadBalancing.Ssl().v6();
    this.User = OvhApiMe;
    this.OvhApiOrder = OvhApiOrder;
    this.CucServiceHelper = CucServiceHelper;
  }

  getCertificates(serviceName) {
    return this.Ssl.query({ serviceName })
      .$promise
      .then(sslIds => this.$q.all(sslIds.map(sslId => this.getCertificate(serviceName, sslId))))
      .catch(this.CucServiceHelper.errorHandler('iplb_ssl_list_error'));
  }

  getCertificate(serviceName, sslId) {
    return this.Ssl.get({ serviceName, sslId })
      .$promise;
  }

  create(serviceName, ssl) {
    return this.Ssl.post({ serviceName }, ssl)
      .$promise
      .then(() => this.CucServiceHelper.successHandler('iplb_ssl_add_success')())
      .catch(this.CucServiceHelper.errorHandler('iplb_ssl_add_error'));
  }

  update(serviceName, sslId, ssl) {
    return this.Ssl.put({
      serviceName,
      sslId,
    }, ssl)
      .$promise
      .then(() => this.CucServiceHelper.successHandler('iplb_ssl_update_success')())
      .catch(this.CucServiceHelper.errorHandler('iplb_ssl_update_error'));
  }

  delete(serviceName, sslId) {
    return this.Ssl.delete({
      serviceName,
      sslId,
    })
      .$promise
      .then(() => this.CucServiceHelper.successHandler('iplb_ssl_delete_success')())
      .catch(this.CucServiceHelper.errorHandler('iplb_ssl_delete_error'));
  }

  getCertificateProducts(serviceName) {
    return this.OvhApiOrder.Cart().ServiceOption().v6().get({
      productName: 'ipLoadbalancing',
      serviceName,
    })
      .$promise
      .then(options => options.filter(option => option.family === 'ssl'))
      .then(options => options.map((option) => {
        // Keep only 1 year prices
        set(option, 'prices', option.prices.filter(price => price.interval === 12));
        return option;
      }))
      .catch(this.CucServiceHelper.errorHandler('iplb_ssl_order_loading_error'));
  }

  /**
     * Order a paid certificate
     * @param  String serviceName       the service name
     * @param  Object options           order parameters
     * @param  Object configuration     item configuration
     * @return Object                   the result of the order
     *
     * options must contains:
     *
     *  - duration
     *  - planCode
     *  - pricingMode
     *  - quantity
     */
  orderPaidCertificate(serviceName, orderOptions, configuration) {
    let cartId;
    return this.User.v6().get().$promise
      .then(me => this.OvhApiOrder.Cart().v6()
        .post({}, { ovhSubsidiary: me.ovhSubsidiary }).$promise)
      .then((cart) => {
        cartId = get(cart, 'cartId');
        return this.OvhApiOrder.Cart().v6().assign({ cartId }).$promise;
      })
      .then(() => this.OvhApiOrder.Cart().ServiceOption().v6().post({
        productName: 'ipLoadbalancing',
        serviceName,
      }, Object.assign({}, orderOptions, {
        cartId,
      })).$promise)
      .then((item) => {
        // Apply item configuration
        const promises = Object.keys(configuration)
          .map(label => this.configureCartItem(cartId, item.itemId, label, configuration[label]));
        return this.$q.all(promises);
      })
      .then(() => this.OvhApiOrder.Cart().v6().checkout({ cartId }, {}).$promise)
      .catch((err) => {
        if (cartId) {
          this.OvhApiOrder.Cart().v6().delete({ cartId });
        }

        this.CucServiceHelper.errorHandler('iplb_ssl_order_error')(err);
      });
  }

  configureCartItem(cartId, itemId, label, value) {
    return this.OvhApiOrder.Cart().Item().Configuration().v6()
      .post({
        cartId,
        itemId,
      }, {
        label,
        value,
      }).$promise;
  }

  orderFreeCertificate(serviceName, fqdn) {
    return this.OvhApiIpLoadBalancing.v6().freeCertificate({ serviceName }, { fqdn }).$promise
      .then(() => this.CucServiceHelper.successHandler('iplb_ssl_order_success')())
      .then(() => this.Ssl.resetQueryCache())
      .catch(this.CucServiceHelper.errorHandler('iplb_ssl_order_error'));
  }
}
