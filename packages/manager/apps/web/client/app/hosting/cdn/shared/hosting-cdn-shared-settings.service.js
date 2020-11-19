import includes from 'lodash/includes';
import find from 'lodash/find';

export default class HostingCdnSharedService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  /**
   * Get this object properties
   * @param {string} serviceName: The internal name of your hosting
   * @returns {*}:
   */
  getCDNProperties(serviceName) {
    return this.$http.get(`/hosting/web/${serviceName}/cdn`);
  }

  /**
   * List available options for a Shared CDN service
   * @param {string} serviceName: The internal name of your hosting
   * @returns {*}:
   */
  getSharedCDNAvailableOptions(serviceName) {
    return this.$http.get(`/hosting/web/${serviceName}/cdn/availableOptions`);
  }

  /**
   * List all domains for a Shared CDN service
   * @param {string} serviceName: The internal name of your hosting
   * @returns {*}:
   */
  getSharedCDNDomains(serviceName) {
    return this.$http.get(`/hosting/web/${serviceName}/cdn/domain`);
  }

  /**
   * Get details for a domain on a Shared CDN service
   * @param {string} serviceName: The internal name of your hosting
   * @param {string} domainName: Domain for which the details is required
   * @returns {*}
   */
  getSharedCDNDomainDetails(serviceName, domainName) {
    return this.$http.get(
      `/hosting/web/${serviceName}/cdn/domain/${domainName}`,
    );
  }

  /**
   * List all options for a domain
   * @param {string} serviceName: The internal name of your hosting
   * @param {string} domainName: Domain for which the details is required
   * @returns {*}
   */
  getCDNDomainsOptions(serviceName, domainName) {
    return this.$http.get(
      `/hosting/web/${serviceName}/cdn/domain/${domainName}/option`,
    );
  }

  /**
   * List all options for a domain
   * @param {string} serviceName: The internal name of your hosting
   * @param {string} domainName: Domain for which the details is required
   * @param {object} data: data to send
   * @returns {*}
   */
  addNewOptionToDomain(serviceName, domainName, data) {
    return this.$http.post(
      `/hosting/web/${serviceName}/cdn/domain/${domainName}/option`,
      data,
    );
  }

  /**
   * Reset an option to his default value
   * @param {string} serviceName: The internal name of your hosting
   * @param {string} domainName: Domain for which the details is required
   * @param {string} optionName: Option to reset to default
   * @returns {*}
   */
  resetCDNOptionToDefault(serviceName, domainName, optionName) {
    return this.$http.delete(
      `/hosting/web/${serviceName}/cdn/domain/${domainName}/option/${optionName}`,
    );
  }

  /**
   * Get details for an option on a domain
   * @param {string} serviceName: The internal name of your hosting
   * @param {string} domainName: Domain for which the details is required
   * @param {string} optionName: Option to reset to default
   * @returns {*}
   */
  getCDNDomainOptionDetails(serviceName, domainName, optionName) {
    return this.$http.get(
      `/hosting/web/${serviceName}/cdn/domain/${domainName}/option/${optionName}`,
    );
  }

  /**
   * Update an option on a domain
   * @param {string} serviceName: The internal name of your hosting
   * @param {string} domainName: Domain for which the details is required
   * @param {string} optionName: Option to reset to default
   * @param {object} data: data to send
   * @returns {*}
   */
  updateCDNDomainOption(serviceName, domainName, optionName, data) {
    return this.$http.put(
      `/hosting/web/${serviceName}/cdn/domain/${domainName}/option/${optionName}`,
      data,
    );
  }

  /**
   * Update an option on a domain
   * @param {string} serviceName: The internal name of your hosting
   * @param {string} domainName: Domain for which the details is required
   * @param {string} optionName: Option to reset to default
   * @returns {*}
   */
  deleteCDNDomainOption(serviceName, domainName, optionName) {
    return this.$http.delete(
      `/hosting/web/${serviceName}/cdn/domain/${domainName}/option/${optionName}`,
    );
  }

  /**
   * Flush cache content on CDN for a domain
   * @param {string} serviceName: The internal name of your hosting
   * @param {string} domainName: Domain for which the details is required
   * @returns {*}
   */
  flushCDNDomainCache(serviceName, domainName) {
    return this.$http.post(
      `/hosting/web/${serviceName}/cdn/domain/${domainName}/purge`,
    );
  }

  /**
   * Applied CDN settings to prod
   * @param {string} serviceName: The internal name of your hosting
   * @param {string} domainName: Domain for which the details is required
   * @returns {*}
   */
  appliedCdnSettings(serviceName, domainName) {
    return this.$http.post(
      `/hosting/web/${serviceName}/cdn/domain/${domainName}/refresh`,
    );
  }

  /**
   * List all operations for a Shared CDN service
   * @param {string} serviceName: The internal name of your hosting
   * @returns {*}
   */
  getCDNServiceOperations(serviceName) {
    return this.$http.get(`/hosting/web/${serviceName}/cdn/operation`);
  }

  /**
   * Get details for a Shared CDN operation
   * @param {string} serviceName: The internal name of your hosting
   * @param {string} id: Id of the operation
   * @returns {*}
   */
  getSharedCDNServiceOperationDetails(serviceName, id) {
    return this.$http.get(`/hosting/web/${serviceName}/cdn/operation/${id}`);
  }

  /**
   * Enable/disable domain
   * @param {string} serviceName
   * @param {string} domain
   */
  enableDisableCDNDomain(serviceName, domain) {
    return this.$http.put(
      `/hosting/web/${serviceName}/attachedDomain/${domain}`,
    );
  }

  /**
   * Return service details
   * @param {string} serviceName: The internal name of your hosting
   * @returns {*}: promise
   */
  getServiceInfo(serviceName) {
    return this.$http.get(`/hosting/web/${serviceName}/serviceInfos`);
  }

  /**
   * Return service description
   * @param {number} serviceInfoId: get from serviceInfo
   * @returns {*}: promise
   */
  getServiceOptions(serviceInfoId) {
    return this.$http.get(`/services/${serviceInfoId}/options`);
  }

  /**
   * Return list of offers
   * @param serviceOptionsId: get from serviceOptions
   * @returns {*}: promise
   */
  getCatalogAddonsPlan(serviceOptionsId) {
    return this.$http.get(`/services/${serviceOptionsId}/upgrade`);
  }

  /**
   * simulate an upgrade to shared CDN (CDNv2)
   * @param {number} serviceId: get from serviceOptions
   * @param {string} planCode: get from serviceOptions
   * @param {object} price: contains info for simulate the order
   * @returns {*}: promise
   */
  simulateUpgradeToSharedCDN(serviceId, planCode, price) {
    return this.$http.post(
      `/services/${serviceId}/upgrade/${planCode}/simulate`,
      {
        duration: price.duration,
        pricingMode: price.pricingMode,
        quantity: price.minimumQuantity,
      },
    );
  }

  /**
   * confirm the upgrade to new Shared CDN (CDNv2)
   * @param {boolean} autoPayWithPreferredPaymentMethod:
   * @param {object} serviceOption: get from serviceOptions
   * @param {number} serviceId: get from serviceOptions
   * @returns {*}: promise
   */
  upgradeToSharedCDN(
    autoPayWithPreferredPaymentMethod,
    serviceOption,
    serviceId,
  ) {
    const price = find(serviceOption.prices, ({ capacities }) =>
      includes(capacities, 'renew'),
    );
    return this.$http.post(
      `/services/${serviceId}/upgrade/${serviceOption.planCode}/execute`,
      {
        autoPayWithPreferredPaymentMethod,
        duration: price.duration,
        pricingMode: price.pricingMode,
        quantity: price.minimumQuantity,
      },
    );
  }

  /**
   * Get order status
   * @param orderId
   * @returns {*}
   */
  getOrderStatus(orderId) {
    return this.$http
      .get(`/me/order/${orderId}/status`)
      .then(({ data }) => data);
  }
}
