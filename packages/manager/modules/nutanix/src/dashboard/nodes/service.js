export default class NutanixNodeService {
  /* @ngInject */
  constructor($q, $http, $translate, NutanixService) {
    this.$q = $q;
    this.$http = $http;
    this.$translate = $translate;
    this.NutanixService = NutanixService;
  }

  updateDisplayName({ serviceId, displayName }) {
    return this.$http.put(`/service/${serviceId}`, {
      resource: {
        displayName,
      },
    });
  }

  getNodeDetails(nodes) {
    return this.$q
      .all(nodes.map((node) => this.NutanixService.getServer(node.server)))
      .then((res) => res);
  }
}
