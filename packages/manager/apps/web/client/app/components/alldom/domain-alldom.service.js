export default class {
  /* @ngInject */
  /**
   * Constructor
   * @param $http
   * @param $q
   * @param OvhHttp
   */
  constructor($http, $q, OvhHttp) {
    this.$http = $http;
    this.$q = $q;
    this.OvhHttp = OvhHttp;

    this.cache = {
      models: 'UNIVERS_WEB_ALL_DOM_MODELS',
      allDoms: 'UNIVERS_WEB_ALL_DOMS',
      allDom: 'UNIVERS_WEB_ALL_DOM',
      domains: 'UNIVERS_WEB_ALL_DOM_DOMAIN',
    };
  }

  /**
   * Get models
   */
  getModels() {
    return this.OvhHttp.get('/allDom.json', {
      rootPath: 'apiv6',
      cache: this.cache.models,
    });
  }

  /**
   * Obtain a list of available allDoms
   * @param {boolean} forceRefresh
   */
  getAllDoms(forceRefresh = false) {
    return this.OvhHttp.get('/allDom', {
      rootPath: 'apiv6',
      cache: this.cache.allDoms,
      clearCache: forceRefresh,
    });
  }

  /**
   * Obtain allDom
   * @param {string} serviceName
   * @param {boolean} forceRefresh
   */
  getAllDom(serviceName, forceRefresh = false) {
    return this.OvhHttp.get(`/allDom/${serviceName}`, {
      rootPath: 'apiv6',
      cache: this.cache.allDom,
      clearCache: forceRefresh,
    });
  }

  /**
   * Obtain domains
   * @param {string} serviceName
   * @param {boolean} forceRefresh
   */
  getDomains(serviceName, forceRefresh = false) {
    return this.OvhHttp.get(`/allDom/${serviceName}/domain`, {
      rootPath: 'apiv6',
      cache: this.cache.domains,
      clearCache: forceRefresh,
    });
  }

  /**
   * Obtain specific domain
   * @param {string} serviceName
   * @param {string} domain
   */
  getDomain(serviceName, domain = '') {
    return this.OvhHttp.get(`/allDom/${serviceName}/domain/${domain}`, {
      rootPath: 'apiv6',
    });
  }

  /**
   * Obtain serviceInfos
   * @param {string} serviceName
   */
  getServiceInfos(serviceName) {
    return this.OvhHttp.get(`/allDom/${serviceName}/serviceInfos`, {
      rootPath: 'apiv6',
    });
  }

  /**
   * Update serviceInfos
   * @param {string} serviceName
   * @param {object} data
   */
  updateServiceInfos(serviceName, data) {
    return this.OvhHttp.put(`/allDom/${serviceName}/serviceInfos`, {
      rootPath: 'apiv6',
      data,
    });
  }

  /**
   * Get domains of alldom pack and its serviceInfo
   * @param {string} serviceName
   */
  async getDomainsWithServiceInfo(serviceName) {
    const domains = await this.getDomains(serviceName);
    const promises = domains.map((domain) =>
      this.$http.get(`/domain/${domain}/serviceInfos`),
    );
    return this.$q.all(promises).then((serviceInfos) => {
      return domains.map((domain, index) => {
        return {
          name: domain,
          serviceInfo: serviceInfos[index].data,
        };
      });
    });
  }
}
