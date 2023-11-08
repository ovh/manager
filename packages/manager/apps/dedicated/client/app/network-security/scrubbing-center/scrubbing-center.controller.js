import { PERIODS, PERIOD_LIST } from './scrubbing-center.constant';
import { PAGE_SIZE } from '../network-security.constant';

export default class ScrubbingCenterController {
  /* @ngInject */
  constructor($translate, Alerter, networkSecurityService) {
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.networkSecurityService = networkSecurityService;

    this.PERIODS = PERIODS;
    this.PERIOD_LIST = PERIOD_LIST;
    this.PAGE_SIZE = PAGE_SIZE;
  }

  $onInit() {
    this.errorMessage = '';
    this.periods = this.networkSecurityService.initPeriods(this.PERIODS);
    [this.period] = this.periods;
    this.networkSecurityService.initService().then((data) => {
      this.services = data;
      return data;
    });

    const ip = this.getIp();
    this.selectedIp = ip;
    if (!ip) {
      this.getAllEvents();
    }
    this.isLoading = false;
  }

  getEventsList(cursor, after, subnets, pageSize) {
    this.isLoading = true;
    const params = {
      after,
      subnets,
    };
    return this.networkSecurityService
      .getEventsList({
        cursor,
        params,
        pageSize,
      })
      .then((response) => {
        if (response.data) {
          this.events = this.events.concat(response.data);
        }
        if (response.cursor.next) {
          this.getEventsList(response.cursor.next, after, subnets, pageSize);
        }
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  getAllEvents() {
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
    this.getEventsList(null, after, this.selectedIp, this.PAGE_SIZE);
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
          this.getAllEvents('selectService');
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

    this.selectedIp = value.ipBlock ? value.ipBlock : value;
    return this.getAllEvents('selectIp');
  }
}
