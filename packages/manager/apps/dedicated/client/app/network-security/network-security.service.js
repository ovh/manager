import { API_PATH } from './network-security.constant';

export default class NetworkSecurityService {
  /* @ngInject */
  constructor($http, $translate, Apiv2Service) {
    this.$http = $http;
    this.$translate = $translate;
    this.Apiv2Service = Apiv2Service;
    this.API_PATH = API_PATH;
  }

  getTraffic(params) {
    return this.Apiv2Service.httpApiv2({
      method: 'get',
      url: `/engine/api/v2${this.API_PATH}/traffic`,
      params,
    });
  }

  getEvents(params) {
    return this.Apiv2Service.httpApiv2({
      method: 'get',
      url: `/engine/api/v2${this.API_PATH}/event`,
      params,
    });
  }

  initPeriods(periodsMap) {
    const periods = periodsMap.map((period) => ({
      name: period.key,
      label: this.$translate.instant(period.value),
    }));
    return periods;
  }

  initService() {
    return this.$http
      .get('/sws/products/services', {
        serviceType: 'aapi',
      })
      .then(({ data }) => {
        const services = data.sort(({ serviceName: a }, { serviceName: b }) =>
          a > b ? 1 : -1,
        );
        return services;
      });
  }

  getIpsFromService(page, pageSize, serviceName, list) {
    const params = {
      pageNumber: page,
      pageSize,
      serviceName,
    };
    return this.$http
      .get('/ips', {
        params,
        serviceType: 'aapi',
      })
      .then(({ data }) => {
        const newList = list.concat(data.data);
        if (newList.length < data.count) {
          return this.getIpsFromService(
            page + 1,
            pageSize,
            serviceName,
            newList,
          );
        }
        return newList;
      });
  }
}
