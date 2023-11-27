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

    // Set default period to "Last year"
    this.period = this.periods[this.periods.length - 1];
    this.networkSecurityService.initService().then((data) => {
      this.services = data;
      return data;
    });

    const ip = this.getIp();
    this.selectedIp = ip;
    if (!ip) {
      this.getAllEvents();
    }
    this.isServiceSelected = false;
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
      this.ipsList = [];
      this.selectedIp = '';
      this.ipsList = null;
      this.ipSelected = null;
      this.results = null;
      this.isServiceSelected = true;
      this.networkSecurityService
        .getIpsFromService(
          this.page,
          this.pageSize,
          this.service.serviceName,
          this.autocomplete,
        )
        .then((data) => {
          this.ipsList = data.map(({ ipBlock }) => ipBlock);
          this.selectedIp = this.ipsList;
          this.getAllEvents();
        });
    } else {
      this.isServiceSelected = false;
    }
  }

  checkSelectedIp(value) {
    if (!value) {
      return null;
    }

    this.selectedIp = value;
    return this.getAllEvents();
  }

  static displayAction(row) {
    const twoWeeksDate = new Date();
    twoWeeksDate.setDate(twoWeeksDate.getDate() - 14);
    let result = false;
    if (row.endedAt > twoWeeksDate.toISOString()) {
      result = true;
    }
    return result;
  }

  onSelectIp() {
    this.selectedIp = this.ipSelected;
    this.getAllEvents();
  }

  onReset() {
    this.selectedIp = null;
    this.getAllEvents();
  }
}
