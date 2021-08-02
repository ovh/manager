import { GUIDES, ANTHOS_DOCS_NAME } from './anthos.constants';

export default class AnthosTenantsService {
  /* @ngInject */
  constructor($http, $translate, ovhDocUrl) {
    this.$http = $http;
    this.$translate = $translate;
    this.ovhDocUrl = ovhDocUrl;
    this.initGuides();
  }

  initGuides() {
    this.guides = {};
    this.guides.title = this.$translate.instant('anthos_tenants_guides');
    this.guides.list = [
      {
        name: this.$translate.instant('anthos_tenants_guides_all'),
        url: this.ovhDocUrl.getDocUrl(ANTHOS_DOCS_NAME),
        external: true,
      },
    ];
  }

  getGuides(subsidiary) {
    return {
      ...this.guides,
      footer: {
        name: this.$translate.instant('anthos_tenants_guides_footer'),
        url: GUIDES[subsidiary] || GUIDES.DEFAULT,
        external: true,
      },
    };
  }

  getTenants() {
    return this.$http.get('/dedicated/anthos/tenants').then(({ data }) => data);
  }

  getTenantDetails(serviceName) {
    return this.$http
      .get(`/dedicated/anthos/tenants/${serviceName}`)
      .then(({ data }) => data);
  }
}
