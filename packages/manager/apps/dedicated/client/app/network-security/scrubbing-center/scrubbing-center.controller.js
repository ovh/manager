import { PERIODS, PERIOD_LIST } from './scrubbing-center.constant';

export default class ScrubbingCenterController {
  /* @ngInject */
  constructor($translate, Alerter, networkSecurityService) {
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.networkSecurityService = networkSecurityService;
    this.PERIODS = PERIODS;
    this.PERIOD_LIST = PERIOD_LIST;
  }

  $onInit() {
    this.errorMessage = '';
    this.pageSize = 10;
    this.periods = this.networkSecurityService.initPeriods(this.PERIODS);
    [this.period] = this.periods;
    this.networkSecurityService.initService().then((data) => {
      this.services = data;
      return data;
    });

    this.getAllEvents();
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
    return this.networkSecurityService.getEvents(params).then(({ data }) => {
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
      this.pageSize = 10;
      this.page = 1;
      this.autocomplete = [];
      this.selectedIp = '';
      this.results = null;
      this.networkSecurityService
        .getIpsFromService(
          this.page,
          this.pageSize,
          this.service.serviceName,
          this.autocomplete,
        )
        .then((data) => {
          this.autocomplete = data;
          this.getAllEvents();
        });
    }
  }

  getIps(partial) {
    if (!this.autocomplete) {
      return null;
    }
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
