import clone from 'lodash/clone';
import assignIn from 'lodash/assignIn';
import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';
import isNull from 'lodash/isNull';
import map from 'lodash/map';
import result from 'lodash/result';

export default class CucProductsService {
  /* @ngInject */
  constructor(
    $q,
    OvhApiProducts,
    OvhApiLicense,
    OvhApiIp,
  ) {
    this.$q = $q;
    this.OvhApiProducts = OvhApiProducts;
    this.OvhApiLicense = OvhApiLicense;
    this.OvhApiIp = OvhApiIp;

    this.products = {};
    this.productsDeferred = null;
  }

  getProducts(force) {
    if (!isEmpty(this.products)) {
      return this.$q.when(this.products);
    }

    if (!isNull(this.productsDeferred) && !force) {
      return this.productsDeferred.promise;
    }

    this.productsDeferred = this.$q.defer();

    this.$q.all({
      cloudProducts: this.OvhApiProducts.Aapi().get({ universe: 'cloud' }).$promise,
      licenses: this.OvhApiLicense.Aapi().get({ count: 1, offset: 0 }).$promise,
      ips: this.OvhApiIp.v6().query().$promise,
    })
      .then((products) => {
        this.products = this.constructor.mergeLicenseIntoProducts(
          products.licenses,
          products.cloudProducts,
        );
        this.products = this.constructor.mergeIpsIntoProducts(products.ips, this.products);
        this.productsDeferred.resolve(this.products);
      });

    return this.productsDeferred.promise;
  }

  static mergeIpsIntoProducts(ips, allProducts) {
    const allProductsMerged = clone(allProducts);
    allProductsMerged.results.push({
      name: 'IP',
      services: map(ips, (ip) => ({
        displayName: ip,
        serviceName: ip,
      })),
    });
    return allProductsMerged;
  }

  static mergeLicenseIntoProducts(licenses, allProducts) {
    const allProductsMerged = clone(allProducts);
    allProductsMerged.errors.push(...licenses.list.messages);
    allProductsMerged.results.push({
      name: 'LICENSE',
      services: map(licenses.list.results, (license) => assignIn(license, {
        displayName: license.id,
        serviceName: license.id,
      })),
    });
    return allProductsMerged;
  }

  getProductsOfType(type) {
    return result(find(this.products, (service) => service.name === type), 'services');
  }

  getDisplayName(type, serviceName) {
    const services = this.getProductsOfType(type);
    return result(find(services, (service) => service.serviceName === serviceName), 'displayName');
  }
}
