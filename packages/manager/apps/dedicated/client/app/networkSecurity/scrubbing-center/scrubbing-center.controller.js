import { PERIODS, PERIOD_LIST, API_PATH } from './scrubbing-center.constant';

export default class ScrubbingCenterController {
  /* @ngInject */
  constructor($http, $translate, Alerter, Apiv2Service, OvhHttp) {
    this.$http = $http;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.Apiv2Service = Apiv2Service;
    this.OvhHttp = OvhHttp;
    this.PERIODS = PERIODS;
    this.PERIOD_LIST = PERIOD_LIST;
    this.API_PATH = API_PATH;
  }

  $onInit() {
    this.errorMessage = '';
    this.pageSize = 10;
    this.initPeriods();
    this.initService();
    this.getAllEvents();
  }

  initPeriods() {
    this.periods = this.PERIODS.map((period) => ({
      name: period.key,
      label: this.$translate.instant(period.value),
    }));
    [this.period] = this.periods;
  }

  initService() {
    return this.$http
      .get('/sws/products/services', {
        serviceType: 'aapi',
      })
      .then((data) => {
        const services = data.data;
        this.services = services.sort(
          ({ serviceName: a }, { serviceName: b }) => (a > b ? 1 : -1),
        );
      });
  }

  getAllEvents(service) {
    this.isLoading = true;
    this.events = [];
    let after = '';
    switch (this.period.name) {
      case this.PERIOD_LIST.last24h:
        after = moment()
          .subtract(1, 'days')
          .toISOString();
        break;
      case this.PERIOD_LIST.lastMonth:
        after = moment()
          .subtract(1, 'months')
          .toISOString();
        break;
      case this.PERIOD_LIST.lastWeek:
        after = moment()
          .subtract(7, 'days')
          .toISOString();
        break;
      case this.PERIOD_LIST.lastYear:
        after = moment()
          .subtract(1, 'years')
          .toISOString();
        break;
      default:
        after = moment()
          .subtract(1, 'days')
          .toISOString();
    }
    const params = {
      after,
    };
    if (service) {
      params.subnets = service;
    }
    return this.Apiv2Service.httpApiv2({
      method: 'get',
      url: `/engine/api/v2${this.API_PATH}/event`,
      params,
    }).then(({ data }) => {
      if (data.events) {
        this.events = data.events;
      } else {
        this.Alerter.error(
          this.$translate.instant('network_security_dashboard_events_error'),
          'network_security_error',
        );
      }
      this.isLoading = false;
      return data;
    });
  }

  selectService() {
    return this.getAllEvents(this.service.serviceName);
  }

  getIps(partial) {
    let ips = [];
    const partialIp = partial.replace(/^[\d\s,]*/, '');
    if (partialIp.length > 2) {
      this.loaderIp = true;

      // Filter loaded ips list with partial ip
      ips = this.services.filter((service) =>
        service.serviceName.includes(partialIp),
      );
      delete this.loaderIp;
    }
    return ips;
  }

  checkSelectedIp(value) {
    return this.getAllEvents(value);
  }
}
