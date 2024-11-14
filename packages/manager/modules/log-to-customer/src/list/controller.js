import moment from 'moment';
import { RETENTION } from '../constants';

export default class LogToCustomerListCtrl {
  /* @ngInject */
  constructor(
    $state,
    coreURLBuilder,
    LogToCustomerService,
    $translate,
    $q,
    Alerter,
  ) {
    this.$state = $state;
    this.coreURLBuilder = coreURLBuilder;
    this.LogToCustomerService = LogToCustomerService;
    this.$translate = $translate;
    this.$q = $q;
    this.Alerter = Alerter;
  }

  $onInit() {
    this.streamLoading = {};
    this.accountList = [];
    this.streams = [];
    this.streamSubscriptions = {};
    this.LDPHomePageLink = null;
    this.selectedAccount = null;

    this.LogToCustomerService.icebergQuery('/dbaas/logs')
      .then((data) => {
        this.accountList = data.map((item) => {
          return {
            ...item,
            formattedName: item.displayName || item.serviceName,
          };
        });

        this.selectedAccount =
          this.accountList.length > 0 ? this.accountList[0] : null;
        this.buildLDPHomePageLink();
        this.getStreamData();
      })
      .catch((error) => {
        this.alertError(error?.data?.message);
      });
  }

  alertError(message = '') {
    this.Alerter.error(this.$translate.instant('error_message', { message }));
  }

  buildLDPHomePageLink() {
    this.LDPHomePageLink = this.coreURLBuilder.buildURL(
      'dedicated',
      `#/dbaas/logs/${this.selectedAccount.serviceName}/home`,
    );
  }

  getStreamData() {
    return this.$q
      .all([this.getSubscribedStreams(), this.getLogAccountStreams()])
      .catch((error) => {
        this.alertError(error?.data?.message);
      });
  }

  getSubscribedStreams() {
    this.streamSubscriptions = {};
    return this.LogToCustomerService.icebergQuery(
      this.logSubscriptionApiData.url,
      this.logSubscriptionApiData.params,
    ).then((data) => {
      data.forEach((item) => {
        this.streamSubscriptions[item.streamId] = { ...item };
      });
    });
  }

  createLogSubscription(id) {
    this.trackClick(this.trackingHits.SUBSCRIBE);
    this.streamLoading[id] = true;
    this.LogToCustomerService.post(this.logSubscriptionApiData.url, {
      ...this.logSubscriptionApiData.params,
      streamId: id,
    })
      .then(({ data }) => {
        return this.LogToCustomerService.pollOperation(
          this.selectedAccount.serviceName,
          data,
        ).then(() => {
          this.Alerter.success(
            this.$translate.instant('logs_list_subscription_success'),
          );
          return this.getStreamData();
        });
      })
      .catch(({ data }) => {
        this.alertError(data.message);
      })
      .finally(() => {
        this.streamLoading[id] = false;
      });
  }

  deleteLogSubscription(streamId) {
    this.trackClick(this.trackingHits.UNSUBSCRIBE);
    this.streamLoading[streamId] = true;
    const { subscriptionId } = this.streamSubscriptions[streamId];

    this.LogToCustomerService.delete(
      `${this.logSubscriptionApiData.url}/${subscriptionId}`,
    )
      .then(({ data }) => {
        return this.LogToCustomerService.pollOperation(
          this.selectedAccount.serviceName,
          data,
        ).then(() => {
          this.Alerter.success(
            this.$translate.instant('logs_list_unsubscription_success'),
          );
          return this.getStreamData();
        });
      })
      .catch(({ data }) => {
        this.alertError(data.message);
      })
      .finally(() => {
        this.streamLoading[streamId] = false;
      });
  }

  getSubscriptionLink(streamId) {
    return this.coreURLBuilder.buildURL(
      'dedicated',
      `#/dbaas/logs/${this.selectedAccount.serviceName}/streams/${streamId}/subscriptions`,
    );
  }

  $onDestroy() {
    this.LogToCustomerService.stopOperationPolling();
  }

  onSelectedLogAccountChange() {
    this.LogToCustomerService.stopOperationPolling();

    this.buildLDPHomePageLink();
    this.getLogAccountStreams();
  }

  retentionInfo(duration) {
    if (duration) {
      if (duration === RETENTION.FORTY_FIVE_DAYS) {
        // moment convert 45 days to a month and we need to be accurate here
        return this.$translate.instant('streams_45_days');
      }
      return moment.duration(duration).humanize();
    }
    return this.$translate.instant('streams_disk_full');
  }

  getLogAccountStreams() {
    return this.LogToCustomerService.getIcebergStreamData(
      this.selectedAccount.serviceName,
    ).then((data) => {
      this.streams = data;
    });
  }

  getRetentionDetails(stream) {
    return this.LogToCustomerService.getRetention(
      this.selectedAccount.serviceName,
      stream.clusterId,
      stream.retentionId,
    );
  }

  goToAddDataStream() {
    this.trackClick(this.trackingHits.ADD_DATA_STREAM);

    window.open(
      this.coreURLBuilder.buildURL(
        'dedicated',
        `#/dbaas/logs/${this.selectedAccount.serviceName}/streams/add`,
      ),
      '_blank',
    );
  }
}
