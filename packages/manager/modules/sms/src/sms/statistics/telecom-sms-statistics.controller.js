import 'moment';

import {
  SMS_STATISTICS_GRANULARITY,
  SMS_STATISTICS_TIME_FILTERS,
} from './telecom-sms-statistics.constants';

export default class SmsStatisticsController {
  /* @ngInject */
  constructor(
    SmsStatisticsService,
    $translate,
    atInternet,
    TucToastError,
    $q,
    ChartFactory,
  ) {
    this.SmsStatisticsService = SmsStatisticsService;
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.TucToastError = TucToastError;
    this.$q = $q;
    this.ChartFactory = ChartFactory;
    this.SMS_STATISTICS_TIME_FILTERS = SMS_STATISTICS_TIME_FILTERS;
  }

  $onInit() {
    this.loading = true;
    this.timeFilter = this.SMS_STATISTICS_TIME_FILTERS.today; // today, last_7_days, last_30_days, year_to_date, custom

    this.statistics = SmsStatisticsController.getEmptyStatistics();

    const { from, to } = this.getTimeFilterDates();
    this.monthlyPerformance = this.initializeChartData(from, to, this.timeFilter);

    // Initialize custom date range to today
    const today = new Date();
    this.customDateRange = [today, today];
    this.calendarModel = null;

    this.atInternet.trackPage({
      name: 'sms::service::statistics',
    });

    this.loadStatistics();
  }

  getGranularity(startDate, endDate, timeFilter) {
    let granularity = SMS_STATISTICS_GRANULARITY.month; // default

    if (timeFilter === this.SMS_STATISTICS_TIME_FILTERS.today) {
      granularity = SMS_STATISTICS_GRANULARITY.hour;
    } else if (
      timeFilter === this.SMS_STATISTICS_TIME_FILTERS.last_7_days ||
      timeFilter === this.SMS_STATISTICS_TIME_FILTERS.last_30_days
    ) {
      granularity = SMS_STATISTICS_GRANULARITY.day;
    } else if (timeFilter === this.SMS_STATISTICS_TIME_FILTERS.year_to_date) {
      granularity = SMS_STATISTICS_GRANULARITY.month;
    } else if (timeFilter === this.SMS_STATISTICS_TIME_FILTERS.custom) {
      const diffMs = endDate - startDate;
      const diffDays = diffMs / (1000 * 60 * 60 * 24);
      if (diffDays <= 1) {
        granularity = SMS_STATISTICS_GRANULARITY.hour;
      } else if (diffDays <= 90) {
        granularity = SMS_STATISTICS_GRANULARITY.day;
      } else {
        granularity = SMS_STATISTICS_GRANULARITY.month;
      }
    }

    return granularity;
  }

  static getChartKey(date, granularity) {
    if (granularity === SMS_STATISTICS_GRANULARITY.hour) {
      return date.getHours().toString();
    }
    if (granularity === SMS_STATISTICS_GRANULARITY.day) {
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      return `${year}-${month}-${day}`;
    }
    return `${date.getFullYear()}-${date.getMonth()}`;
  }

  static isSmsDelivered(sms) {
    return sms?.deliveryReceipt === 1;
  }

  initializeChartData(from, to, timeFilter) {
    const startDate = from ? new Date(from) : new Date(new Date().getFullYear(), 0, 1);
    const endDate = to ? new Date(to) : new Date(new Date().getFullYear(), 11, 31);

    const granularity = this.getGranularity(startDate, endDate, timeFilter);

    return SmsStatisticsController.generateChartDataByGranularity(startDate, endDate, granularity);
  }

  static generateChartDataByGranularity(startDate, endDate, granularity) {
    const range = [];

    if (granularity === SMS_STATISTICS_GRANULARITY.hour) {
      // By hour for today (0-23)
      for (let h = 0; h < 24; h += 1) {
        range.push({
          key: h.toString(),
          month: `${h}h`,
          sent: 0,
          delivered: 0,
        });
      }
    } else if (granularity === SMS_STATISTICS_GRANULARITY.day) {
      // By day
      const cursor = new Date(startDate);
      const last = new Date(endDate);

      while (cursor <= last) {
        const day = cursor.getDate();
        const month = cursor.getMonth() + 1;
        const year = cursor.getFullYear();
        const key = `${year}-${month}-${day}`;
        const label = `${day}/${month}`;

        range.push({
          key,
          month: label,
          sent: 0,
          delivered: 0,
        });

        cursor.setDate(cursor.getDate() + 1);
      }
    } else {
      // By month
      const months = moment.months();
      const cursor = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
      const last = new Date(endDate.getFullYear(), endDate.getMonth(), 1);

      const includeYear = cursor.getFullYear() !== last.getFullYear();

      while (cursor <= last) {
        const monthIndex = cursor.getMonth();
        const year = cursor.getFullYear();
        const label = includeYear ? `${months[monthIndex]} ${year}` : months[monthIndex];

        range.push({
          key: `${year}-${monthIndex}`,
          month: label,
          sent: 0,
          delivered: 0,
        });

        cursor.setMonth(cursor.getMonth() + 1);
      }
    }

    return range;
  }

  static initializeMonthlyData(from, to) {
    const startDate = from ? new Date(from) : new Date(new Date().getFullYear(), 0, 1);
    const endDate = to ? new Date(to) : new Date(new Date().getFullYear(), 11, 31);
    return SmsStatisticsController.generateChartDataByGranularity(
      startDate,
      endDate,
      SMS_STATISTICS_GRANULARITY.month,
    );
  }

  onCustomDateRangeChange(selectedDates, dateStr) {
    if (dateStr) {
      this.calendarModel = dateStr;
    }

    if (Array.isArray(selectedDates) && selectedDates.length > 0) {
      this.customDateRange = selectedDates.length === 2
        ? selectedDates
        : [selectedDates[0], selectedDates[0]];
    }
  }

  loadStatistics() {
    this.loading = true;
    this.statistics = SmsStatisticsController.getEmptyStatistics();
    const { from, to } = this.getTimeFilterDates();
    this.monthlyPerformance = this.initializeChartData(from, to, this.timeFilter);

    return this.$q
      .all([
        this.loadOutgoingStatistics(),
        this.loadIncomingStatistics(),
        this.loadBatchesStatistics(),
      ])
      .then(() => {
        this.updateChart();
      })
      .catch(({ data }) => {
        this.TucToastError(this.$translate.instant(
          'sms_statistics_error_loading_data',
          { error: data?.data?.message },
        ),
        );
      }).finally(() => {
        this.loading = false;
      });
  }

  getTimeFilterDates() {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (this.timeFilter) {
      case this.SMS_STATISTICS_TIME_FILTERS.today:
        return {
          from: startOfToday,
          to: now,
        };
      case this.SMS_STATISTICS_TIME_FILTERS.last_7_days:
        return {
          from: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
          to: now,
        };
      case this.SMS_STATISTICS_TIME_FILTERS.last_30_days:
        return {
          from: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
          to: now,
        };
      case this.SMS_STATISTICS_TIME_FILTERS.custom:
        // For the custom period, use the selected dates
        // and add 23:59:59 to the end date to include the entire day
        if (this.customDateRange) {
          let startDate = null;
          let endDate = null;

          // Support for array format [startDate, endDate]
          if (Array.isArray(this.customDateRange) && this.customDateRange.length === 2) {
            [startDate, endDate] = this.customDateRange;
          } else if (typeof this.calendarModel === 'string') {
            const matches = this.calendarModel.match(/\d{4}-\d{2}-\d{2}/g);
            if (matches && matches.length >= 2) {
              [startDate, endDate] = matches;
            }
          }

          // Convert dates to Date objects if they are strings
          if (startDate && endDate) {
            const fromDate = new Date(startDate);
            const toDate = new Date(endDate);

            // Check that dates are valid
            if (!Number.isNaN(fromDate.getTime()) && !Number.isNaN(toDate.getTime())) {
              // Normalize dates: start at 00:00:00, end at 23:59:59
              fromDate.setHours(0, 0, 0, 0);
              toDate.setHours(23, 59, 59, 999);
              return {
                from: fromDate,
                to: toDate,
              };
            }
          }
        }
        // Fallback if no dates selected
        return {
          from: startOfToday,
          to: now,
        };
      case this.SMS_STATISTICS_TIME_FILTERS.year_to_date:
      default:
        return {
          from: startOfYear,
          to: now,
        };
    }
  }

  static getEmptyStatistics() {
    return {
      outgoing: {
        total: 0,
        delivered: 0,
        // SMS sent via campaign
        campaign: {
          total: 0,
          delivered: 0,
        },
        // SMS sent outside of campaigns (individual)
        individual: {
          total: 0,
          delivered: 0,
        },
      },
      incoming: {
        total: 0,
      },
      credits: {
        remaining: 0,
      },
      batches: {
        total: 0,
        completed: 0,
        pending: 0,
        failed: 0,
        stoplisted: 0,
      },
    };
  }

  loadOutgoingStatistics() {
    const { from, to } = this.getTimeFilterDates();
    const granularity = this.getGranularity(from, to, this.timeFilter);

    return this.SmsStatisticsService.getOutgoingSms(
      this.serviceName,
      from,
      to,
    )
      .then((outgoingSms) => {
        this.statistics.outgoing.total = outgoingSms.length;

        // Separate campaign and individual SMS
        // An SMS is a campaign SMS if it has a batchID
        const {
          campaignTotal,
          individualTotal,
          campaignDelivered,
          individualDelivered,
        } = outgoingSms.reduce(
          (acc, sms) => {
            const isDelivered = SmsStatisticsController.isSmsDelivered(sms);
            if (sms.batchID) {
              acc.campaignTotal += 1;
              if (isDelivered) {
                acc.campaignDelivered += 1;
              }
            } else {
              acc.individualTotal += 1;
              if (isDelivered) {
                acc.individualDelivered += 1;
              }
            }
            return acc;
          },
          {
            campaignTotal: 0,
            individualTotal: 0,
            campaignDelivered: 0,
            individualDelivered: 0,
          },
        );

        Object.assign(this.statistics.outgoing.campaign, {
          total: campaignTotal,
          delivered: campaignDelivered,
        });
        Object.assign(this.statistics.outgoing.individual, {
          total: individualTotal,
          delivered: individualDelivered,
        });

        // Calculate totals
        this.statistics.outgoing.delivered = campaignDelivered + individualDelivered;
        const indexByKey = this.monthlyPerformance.reduce((acc, item, index) => {
          acc[item.key] = index;
          return acc;
        }, {});

        // Build data based on granularity
        outgoingSms.forEach((sms) => {
          const date = new Date(sms.creationDatetime);
          const key = SmsStatisticsController.getChartKey(date, granularity);
          const index = indexByKey[key];

          if (index !== undefined) {
            this.monthlyPerformance[index].sent += 1;
            if (SmsStatisticsController.isSmsDelivered(sms)) {
              this.monthlyPerformance[index].delivered += 1;
            }
          }
        });
      });
  }

  loadIncomingStatistics() {
    const { from, to } = this.getTimeFilterDates();

    return this.SmsStatisticsService.getIncomingSms(
      this.serviceName,
      from,
      to,
    )
      .then((incomingSms) => {
        this.statistics.incoming.total = incomingSms.length;
        return incomingSms;
      })
  }

  loadBatchesStatistics() {
    if (this.batches && this.batches.length > 0) {
      const { from, to } = this.getTimeFilterDates();

      // Filter batches by period
      const filteredBatches = this.batches.filter((batch) => {
        const batchDate = new Date(batch.creationDatetime || batch.createdAt);
        return batchDate >= from && batchDate <= to;
      });

      this.statistics.batches.total = filteredBatches.length;

      filteredBatches.forEach((batch) => {
        switch (batch.status) {
          case 'COMPLETED':
            this.statistics.batches.completed += 1;
            break;
          case 'PENDING':
          case 'INSERTING':
          case 'INSERTED':
            this.statistics.batches.pending += 1;
            break;
          case 'FAILED':
          case 'CANCELED':
            this.statistics.batches.failed += 1;
            break;
          default:
            break;
        }
      });

      // Load detailed batch statistics
      const promises = filteredBatches.map((batch) =>
        this.SmsStatisticsService.getBatchStatistics(
          this.serviceName,
          batch.id,
        )
          .then((stats) => {
            this.statistics.batches.stoplisted += stats.stoplisted || 0;
          })
      );

      return Promise.all(promises).catch(({ data }) => {
        this.TucToastError(this.$translate.instant(
          'sms_statistics_error_loading_data',
          { error: data?.data?.message },
        ),
        );
      })
    }

    return Promise.resolve();
  }

  getOutgoingSuccessRate() {
    return this.statistics.outgoing.total === 0
      ? 0
      : (
        (this.statistics.outgoing.delivered / this.statistics.outgoing.total) *
        100
      ).toFixed(1);
  }

  getBatchesCompletionRate() {
    return this.statistics.batches.total === 0
      ? 0
      : (
        (this.statistics.batches.completed / this.statistics.batches.total) *
        100
      ).toFixed(1);
  }

  getMaxMonthValue() {
    // Return the maximum value across all months for the progress bar scale
    const maxSent = Math.max(...this.monthlyPerformance.map((d) => d.sent), 1);
    const maxDelivered = Math.max(
      ...this.monthlyPerformance.map((d) => d.delivered),
      1,
    );
    return Math.max(maxSent, maxDelivered);
  }

  updateChart() {
    this.chart = new this.ChartFactory({
      type: 'bar',
      data: {
        labels: this.monthlyPerformance.map((d) => d.month),
        datasets: [
          {
            label: this.$translate.instant('sms_statistics_sent_label'),
            backgroundColor: 'rgba(52, 144, 220, 0.7)',
            borderColor: 'rgb(52, 144, 220)',
            borderWidth: 1,
            data: this.monthlyPerformance.map((d) => d.sent),
          },
          {
            label: this.$translate.instant('sms_statistics_delivered_label'),
            backgroundColor: 'rgba(28, 200, 140, 0.7)',
            borderColor: 'rgb(28, 200, 140)',
            borderWidth: 1,
            data: this.monthlyPerformance.map((d) => d.delivered),
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            display: true,
          },
          tooltip: {
            mode: 'index',
            intersect: false,
          },
        },
        scales: {
          y: {
            type: 'linear',
            display: true,
            beginAtZero: true,
            title: {
              display: true,
            },
            grid: {
              drawBorder: true,
              display: true,
            },
            ticks: {
              stepSize: 1,
              suggestedMax: this.getMaxMonthValue() + 1,
            },
          },
        },
      },
    });
  }
}
