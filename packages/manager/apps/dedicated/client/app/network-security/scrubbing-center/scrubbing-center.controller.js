import { AbstractCursorDatagridController } from '@ovh-ux/manager-ng-apiv2-helper';
import isNaN from 'lodash/isNaN';
import { PERIODS, PERIOD_LIST } from './scrubbing-center.constant';
import { PAGE_SIZE } from '../network-security.constant';

export default class ScrubbingCenterController extends AbstractCursorDatagridController {
  /* @ngInject */
  constructor($translate, Alerter, networkSecurityService, ouiDatagridService) {
    super();
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.networkSecurityService = networkSecurityService;
    this.ouiDatagridService = ouiDatagridService;

    this.PERIODS = PERIODS;
    this.PERIOD_LIST = PERIOD_LIST;
    this.PAGE_SIZE = PAGE_SIZE;
  }

  $onInit() {
    this.datagridId = 'ScrubbingCenterController-Datagrid';
    this.errorMessage = '';
    this.periods = this.networkSecurityService.initPeriods(this.PERIODS);

    this.isValid = true;

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
  }

  createItemsPromise({ cursor }) {
    const params = {
      after: this.after,
    };
    if (this.selectedIp) {
      params.subnets = this.selectedIp;
    }
    const pageSize = this.PAGE_SIZE;
    return this.networkSecurityService
      .getEventsList({
        cursor,
        params,
        pageSize,
      })
      .catch(() => {
        this.Alerter.error(
          this.$translate.instant('network_security_dashboard_events_error'),
          'network_security_dashboard_alert',
        );
      });
  }

  getAllEvents() {
    this.after = '';
    switch (this.period.name) {
      case this.PERIOD_LIST.lastMonth:
        this.after = moment()
          .subtract(1, 'months')
          .toISOString();
        break;
      case this.PERIOD_LIST.lastWeek:
        this.after = moment()
          .subtract(7, 'days')
          .toISOString();
        break;
      case this.PERIOD_LIST.lastYear:
        this.after = moment()
          .subtract(1, 'years')
          .toISOString();
        break;
      default:
        this.after = moment()
          .subtract(1, 'days')
          .toISOString();
    }
    this.reloadItems(this.PAGE_SIZE).then(() => {
      this.ouiDatagridService.refresh(this.datagridId, true);
    });
  }

  selectService() {
    this.selectedIp = null;
    this.isEmpty = false;
    this.isServiceSelected = false;
    this.model = null;
    if (this.service) {
      this.pageSize = 10;
      this.page = 1;
      this.autocomplete = [];
      this.ipsList = [];
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
          this.isEmpty = !this.ipsList.length;
          this.selectedIp = this.ipsList;
          this.getAllEvents();
        });
    } else {
      this.getAllEvents();
    }
  }

  checkSelectedIp(value) {
    let isValid = true;
    if (!value) {
      return null;
    }

    if (value.indexOf('/') === -1 && !ipaddr.isValid(value)) {
      isValid = false;
    } else if (value.indexOf('/') > -1) {
      const ip = value.split('/');
      if (!ipaddr.isValid(ip[0]) || !isNaN(ip[1])) {
        isValid = false;
      }
    }

    this.isValid = isValid;

    if (isValid) {
      this.selectedIp = value;
      if (value.indexOf('/') === -1) {
        if (value.indexOf('.') > -1) {
          this.selectedIp = `${value}/32`;
        } else if (value.indexOf(':') > -1) {
          this.selectedIp = `${value}/128`;
        }
        this.model = this.selectedIp;
      }
    }
    return isValid ? this.getAllEvents() : null;
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
    this.isValid = true;
    this.selectedIp = null;
    this.getAllEvents();
  }
}
