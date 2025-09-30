const STATISTICS_FILTER = {
  TODAY: 'today',
  LAST: 'last',
  TEN_LAST: 'ten_last',
  ALL: 'all',
};

const RELOAD_CREDITS_HIT_NAME = 'report::credit-account';
export default class {
  /* @ngInject */
  constructor(
    $translate,
    atInternet,
    OvhApiSms,
    SmsService,
    TucSmsMediator,
    TucToastError,
  ) {
    this.$translate = $translate;
    this.api = {
      sms: {
        senders: OvhApiSms.Senders().v6(),
        outgoing: OvhApiSms.Outgoing().v6(),
        incoming: OvhApiSms.Incoming().v6(),
        jobs: OvhApiSms.Jobs().v6(),
      },
    };
    this.atInternet = atInternet;
    this.smsService = SmsService;
    this.TucSmsMediator = TucSmsMediator;
    this.TucToastError = TucToastError;
  }

  $onInit() {
    this.DASHBOARD_TRACKING_PREFIX = `sms::service::${
      this.isSmppAccount ? 'dashboard-smpp' : 'dashboard'
    }`;
    this.atInternet.trackPage({
      name: this.DASHBOARD_TRACKING_PREFIX,
    });
    this.actions = [
      ...(!this.isSmppAccount
        ? [
            {
              name: 'compose_message',
              sref: 'sms.service.sms.compose',
              text: this.$translate.instant('sms_actions_send_sms'),
              hit: 'sms::service::dashboard::compose',
            },
          ]
        : []),
      ...(!this.isSmppAccount
        ? [
            {
              name: 'create_campaign',
              sref: 'sms.service.batches.create',
              text: this.$translate.instant('sms_actions_create_campaign'),
              hit: 'sms::service::dashboard::add-campaign',
            },
          ]
        : []),
      ...(!this.isSmppAccount
        ? [
            {
              name: 'campaign_history',
              sref: 'sms.service.batches.history',
              text: this.$translate.instant('sms_actions_campaign_history'),
              hit: 'sms::service::dashboard::historic-campaigns',
            },
          ]
        : []),
      ...(!this.isSmppAccount
        ? [
            {
              name: 'manage_recipient_new',
              sref: 'sms.service.receivers',
              text: this.$translate.instant('sms_actions_create_contact'),
              hit: 'sms::service::dashboard::add-receivers',
            },
          ]
        : []),
      {
        name: 'manage_senders',
        sref: 'sms.service.senders.add',
        text: this.$translate.instant('sms_actions_create_sender'),
        hit: `${this.DASHBOARD_TRACKING_PREFIX}::add-senders`,
      },
      ...(!this.isSmppAccount
        ? [
            {
              name: 'manage_soapi_users',
              sref: 'sms.service.users',
              text: this.$translate.instant('sms_actions_create_api_user'),
              hit: 'sms::service::dashboard::add-user',
            },
          ]
        : []),
      ...(!this.isSmppAccount
        ? [
            {
              name: 'manage_blacklisted_senders',
              sref: 'sms.service.receivers',
              text: this.$translate.instant('sms_actions_clean_contact_list'),
              hit: 'sms::service::dashboard::clean-receivers',
            },
          ]
        : []),
      ...(this.isSmppAccount
        ? [
            {
              name: 'option_smpp_parameter',
              sref: 'sms.service.options.smppParameter',
              text: this.$translate.instant('sms_actions_smpp_parameter'),
              hit: 'sms::service::dashboard-smpp::configure-smpp',
            },
          ]
        : []),
      {
        name: 'recredit_options',
        sref: 'sms.service.order',
        text: this.$translate.instant('sms_actions_credit_account'),
        hit: `${this.DASHBOARD_TRACKING_PREFIX}::credit-account`,
      },
      {
        name: 'credit_transfer',
        sref: 'sms.service.dashboard.creditTransfer',
        text: this.$translate.instant('sms_actions_credit_transfer'),
        hit: `${this.DASHBOARD_TRACKING_PREFIX}::transfer-credit`,
      },
      ...(this.smsFeatureAvailability.isFeatureAvailable('sms:time2chat')
        ? [
            {
              name: 'order_time2chat',
              sref: 'sms.service.senders.orderTime2Chat',
              text: this.$translate.instant('sms_actions_order_time2chat'),
              hit: `${this.DASHBOARD_TRACKING_PREFIX}::order-time2chat`,
            },
          ]
        : []),
    ];

    this.statisticsFilters = Object.values(STATISTICS_FILTER).map((value) => ({
      label: this.$translate.instant(`sms_statistics_campaign_filter_${value}`),
      value,
    }));

    [this.statisticFilter] = this.statisticsFilters;

    if (this.isSmppAccount) {
      this.smppLoading = true;
      this.smsService
        .getSmppSettings(this.serviceName)
        .then((result) => {
          this.smppSettings = result;
        })
        .finally(() => {
          this.smppLoading = false;
        });
    }
    return this.getStatistics();
  }

  getTrackName() {
    return `${this.DASHBOARD_TRACKING_PREFIX}::${RELOAD_CREDITS_HIT_NAME}`;
  }

  getStatistics() {
    const filteredBatches = this.filterBatches();

    return this.requestBatchesStatistics(filteredBatches);
  }

  filterBatches() {
    const { value: filter } = this.statisticFilter;
    let filteredBatches;

    switch (filter) {
      case STATISTICS_FILTER.TODAY:
        filteredBatches = this.batches.filter((batch) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const batchDate = new Date(batch.startedAt);
          batchDate.setHours(0, 0, 0, 0);

          return batchDate - today === 0;
        });
        break;
      case STATISTICS_FILTER.LAST:
        filteredBatches = this.batches.slice(0, 1);
        break;
      case STATISTICS_FILTER.TEN_LAST:
        filteredBatches = this.batches.slice(0, 10);
        break;
      case STATISTICS_FILTER.ALL:
        filteredBatches = this.batches;
        break;
      default:
        filteredBatches = this.batches.slice(0, 1);
        break;
    }

    return filteredBatches;
  }

  requestBatchesStatistics(batches) {
    this.loadingStats = true;
    return this.getBatchesStatistics(batches)
      .then((statistics) => {
        this.statistics = statistics.reduce(
          (acc, batchStatistics) => ({
            batchesCount: acc.batchesCount + 1,
            delivered: acc.delivered + batchStatistics.delivered,
            sent: acc.sent + batchStatistics.sent,
            stoplisted: acc.stoplisted + batchStatistics.stoplisted,
          }),
          {
            batchesCount: 0,
            delivered: 0,
            sent: 0,
            stoplisted: 0,
          },
        );

        Object.assign(this.statistics, {
          credits: Math.round(this.statistics.credits * 100) / 100,
          deliveredPercentage: `(${Math.round(
            (this.statistics.delivered / (this.statistics.sent || 1)) *
              100 *
              100,
          ) / 100}%)`,
          stoplistedPercentage: `(${Math.round(
            (this.statistics.stoplisted / (this.statistics.sent || 1)) *
              100 *
              100,
          ) / 100}%)`,
        });
        return statistics;
      })
      .finally(() => {
        this.loadingStats = false;
      });
  }

  onGoToCreditTransfer() {
    this.trackClick(
      `${this.DASHBOARD_TRACKING_PREFIX}::report::transfer-credit`,
    );
    return this.goToCreditTransfer();
  }

  onGoToCreditOrder() {
    this.trackClick(
      `${this.DASHBOARD_TRACKING_PREFIX}::report::credit-account`,
    );
    return this.goToCreditOrder();
  }

  onGoToOrderTime2Chat() {
    this.trackClick(
      `${this.DASHBOARD_TRACKING_PREFIX}::report::order-time2chat`,
    );
    return this.goToOrderTime2Chat();
  }
}
