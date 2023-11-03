import { PERIODS, PERIOD_LIST } from './scrubbing-center.constant';

export default class ScrubbingCenterController {
  /* @ngInject */
  constructor($http, $translate, Alerter, scrubbingCenterService) {
    this.$http = $http;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.scrubbingCenterService = scrubbingCenterService;
    this.PERIODS = PERIODS;
    this.PERIOD_LIST = PERIOD_LIST;
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
      .then(({ data }) => {
        this.services = data.sort(({ serviceName: a }, { serviceName: b }) =>
          a > b ? 1 : -1,
        );
      });
  }

  getAllEvents(service) {
    this.isLoading = true;
    this.events = [];
    let after = '';
    switch (this.period.name) {
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
    if (!service && this.service && !this.selectedIp) {
      params.subnets = this.autocomplete.map((el) => el.ipBlock);
    }
    if (!service && this.selectedIp) {
      params.subnets = this.selectedIp.ipBlock;
    }
    return this.scrubbingCenterService.getEvents(params).then(({ data }) => {
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
    if (this.service) {
      this.isLoading = true;
      this.pageSize = 10;
      this.page = 1;
      this.autocomplete = [];
      this.selectedIp = '';
      this.results = null;
      this.getIpsFromService();
    }
  }

  getIpsFromService() {
    const params = {
      pageNumber: this.page,
      pageSize: this.pageSize,
      serviceName: this.service.serviceName,
    };
    this.$http
      .get('/ips', {
        params,
        serviceType: 'aapi',
      })
      .then(({ data }) => {
        this.autocomplete = this.autocomplete.concat(data.data);
        if (this.autocomplete.length < data.count) {
          this.page += 1;
          this.getIpsFromService();
        } else {
          this.getAllEvents();
        }
      });
  }

  getIps(partial) {
    let ips = [];
    if (partial.length > 2) {
      this.loaderIp = true;

      // Filter loaded ips list with partial ip
      ips = this.autocomplete.filter((service) =>
        service.ipBlock.includes(partial),
      );
      delete this.loaderIp;
    }
    return ips;
  }

  checkSelectedIp(value) {
    if (!value) {
      return null;
    }

    return this.getAllEvents(value.ipBlock);
  }
}
