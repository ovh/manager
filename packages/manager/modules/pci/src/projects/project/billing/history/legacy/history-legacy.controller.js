import find from 'lodash/find';
import map from 'lodash/map';
import 'moment';

const MESSAGES_CONTAINER_NAME = 'pci.projects.project.billing.history';

export default class {
  /* @ngInject */
  constructor(
    $q,
    $state,
    $stateParams,
    $translate,
    coreURLBuilder,
    CloudProjectBilling,
    CucCloudMessage,
    OvhApiCloudProjectUsageCurrent,
    OvhApiCloudProjectUsageHistory,
  ) {
    this.$q = $q;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.CloudProjectBilling = CloudProjectBilling;
    this.CucCloudMessage = CucCloudMessage;
    this.OvhApiCloudProjectUsageCurrent = OvhApiCloudProjectUsageCurrent;
    this.OvhApiCloudProjectUsageHistory = OvhApiCloudProjectUsageHistory;

    // Messages Management
    this.messages = null;
    this.messageHandler = this.CucCloudMessage.subscribe(
      MESSAGES_CONTAINER_NAME,
      {
        onMessage: () => this.refreshMessage(),
      },
    );
    // End - Messages Management

    this.firstDayCurrentMonth = moment().startOf('month');
    this.billingUrl = coreURLBuilder.buildURL('dedicated', '#/billing/history');

    this.loading = true;
  }

  $onInit() {
    const monthBilling = moment.utc({
      y: this.validParams.year,
      M: this.validParams.month - 1,
      d: 1,
    });
    this.data = {
      monthBilling,
      previousMonth: moment.utc(monthBilling).subtract(1, 'month'),
      details: null,
    };

    this.year = this.validParams.year;
    this.month = this.validParams.month;

    return this.initConsumptionHistory()
      .catch((err) => {
        this.CucCloudMessage.error(
          [
            this.$translate.instant('cpb_error_message'),
            (err.data && err.data.message) || '',
          ].join(' '),
          MESSAGES_CONTAINER_NAME,
        );
        return this.$q.reject(err);
      })
      .finally(() => {
        this.loading = false;
      });
  }

  refreshMessage() {
    this.messages = this.messageHandler.getMessages();
  }

  initConsumptionHistory() {
    return this.OvhApiCloudProjectUsageHistory.v6()
      .query({
        serviceName: this.$stateParams.projectId,
        from: this.data.previousMonth.format(),
        to: this.data.monthBilling.format(),
      })
      .$promise.then((historyPeriods) =>
        this.getConsumptionDetails(historyPeriods),
      )
      .then((details) => {
        this.data.details = details;
      });
  }

  getHourlyBillingDateInfo() {
    const prev = moment(this.data.monthBilling).subtract(1, 'month');
    return {
      month: prev.format('MMMM'),
      year: prev.year(),
    };
  }

  getConsumptionDetails(periods) {
    const detailPromises = map(
      periods,
      (period) =>
        this.OvhApiCloudProjectUsageHistory.v6().get({
          serviceName: this.$stateParams.projectId,
          usageId: period.id,
        }).$promise,
    );

    return this.$q
      .all(detailPromises)
      .then((periodDetails) => {
        let monthlyDetails;

        if (moment.utc().isSame(this.data.monthBilling, 'month')) {
          monthlyDetails = this.OvhApiCloudProjectUsageCurrent.v6().get({
            serviceName: this.$stateParams.projectId,
          }).$promise;
        } else {
          monthlyDetails = find(periodDetails, (detail) =>
            moment
              .utc(detail.period.from)
              .isSame(this.data.monthBilling, 'month'),
          );
        }

        const hourlyDetails = find(periodDetails, (detail) =>
          moment
            .utc(detail.period.from)
            .isSame(this.data.previousMonth, 'month'),
        );

        return {
          hourly: hourlyDetails,
          monthly: monthlyDetails,
        };
      })
      .then((details) =>
        this.$q
          .all(details)
          .then((allDetails) =>
            this.CloudProjectBilling.getConsumptionDetails(
              allDetails.hourly,
              allDetails.monthly,
            ),
          ),
      );
  }

  previousMonth() {
    const lastMonth = this.data.monthBilling.subtract(1, 'month');
    return this.$state.go(this.$state.current.name, {
      year: lastMonth.year(),
      month: lastMonth.month() + 1, // because moment indexes month from 0 to 11
    });
  }

  nextMonth() {
    const nextMonthDate = this.data.monthBilling.add(1, 'month');
    return this.$state.go(this.$state.current.name, {
      year: nextMonthDate.year(),
      month: nextMonthDate.month() + 1, // because moment indexes month from 0 to 11
    });
  }

  isLimitReached() {
    return this.data.monthBilling.isSameOrAfter(
      this.firstDayCurrentMonth,
      'day',
    );
  }

  getBillingDateInfo() {
    const date = this.data.monthBilling.clone();
    if (date.isValid()) {
      return {
        month: date.format('MMMM'),
        lastMonth: date.subtract(1, 'month').format('MMMM'),
        year: date.year(),
      };
    }
    return null;
  }
}
