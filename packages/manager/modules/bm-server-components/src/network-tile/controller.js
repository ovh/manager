import isFunction from 'lodash/isFunction';

export default class BmServerComponentsNetworkTileController {
  /* @ngInject */
  constructor($http, $q, atInternet, coreURLBuilder) {
    this.$http = $http;
    this.$q = $q;
    this.atInternet = atInternet;
    this.coreURLBuilder = coreURLBuilder;
  }

  $onInit() {
    this.manageIpUrl = this.coreURLBuilder.buildURL(
      'dedicated',
      '#/ip?serviceName=:serviceName',
      {
        serviceName: this.server.name,
      },
    );
    this.vrackInfos = [];
    this.loading = true;
    this.loadVrackInfos()
      .then((res) => {
        this.vrackInfos = res;
      })
      .finally(() => {
        this.loading = false;
      });
  }

  loadVrackInfos() {
    return this.getVrack(this.server.name)
      .then((results) => {
        const promises = results.map((vrack) =>
          this.$http.get(`/vrack/${vrack}`).then(({ data }) => ({
            serviceName: vrack,
            ...data,
          })),
        );
        return this.$q.all(promises);
      })
      .catch((error) => {
        return this.handleError(error);
      });
  }

  getVrack(serviceName) {
    return this.$http
      .get(`/dedicated/server/${serviceName}/vrack`)
      .then((results) => results.data)
      .catch((error) => {
        if (error.status === 404 || error.status === 460) {
          return [];
        }
        return this.$q.reject(error);
      });
  }

  getVrackUrl(vrackId) {
    return this.coreURLBuilder.buildURL('dedicated', '#/vrack/:serviceName', {
      serviceName: vrackId,
    });
  }

  handleError(error) {
    if (isFunction(this.onError)) {
      this.onError({ error });
    }
  }

  trackClick(trackText) {
    if (this.trackingPrefix) {
      this.atInternet.trackClick({
        name: `${this.trackingPrefix}::${trackText}`,
        type: 'action',
      });
    }
  }
}
