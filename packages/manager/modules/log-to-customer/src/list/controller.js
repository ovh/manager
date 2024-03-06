import moment from 'moment';
import { RETENTION } from '../constants';

export default class LogToCustomerListCtrl {
  /* @ngInject */
  constructor($state, coreURLBuilder, LogToCustomerService, $translate, $q) {
    this.$state = $state;
    this.coreURLBuilder = coreURLBuilder;
    this.LogToCustomerService = LogToCustomerService;
    this.$translate = $translate;
    this.$q = $q;
  }

  $onInit() {
    this.loading = false;
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
        this.getStreamData();
      })
      .catch((error) => {
        this.errorMessage = error?.data?.message;
      });
  }

  getStreamData() {
    this.$q
      .all([this.getSubscribedStreams(), this.getLogAccountStreams()])
      .catch((error) => {
        this.errorMessage = error?.data?.message;
      })
      .finally(() => {
        this.loading = false;
      });
  }

  goBack() {
    this.$state.go('^');
  }

  getSubscribedStreams() {
    this.streamSubscriptions = {};
    return this.LogToCustomerService.icebergQuery(this.logSubscriptionUrl).then(
      (data) => {
        data.forEach((item) => {
          this.streamSubscriptions[item.streamId] = { ...item };
        });
      },
    );
  }

  createLogSubscription(streamId) {
    this.loading = streamId;
    this.resetErrorMessage();
    this.LogToCustomerService.post(this.logSubscriptionUrl, {
      streamId,
      kind: this.kind,
    })
      .then(({ data }) => {
        this.LogToCustomerService.pollOperation(
          this.selectedAccount.serviceName,
          data,
        ).then(() => this.getStreamData());
      })
      .catch(({ data }) => {
        this.errorMessage = data.message;
        this.loading = false;
      });
  }

  resetErrorMessage() {
    this.errorMessage = null;
  }

  deleteLogSubscription(streamId) {
    this.loading = streamId;
    this.resetErrorMessage();
    const { subscriptionId } = this.streamSubscriptions[streamId];

    this.LogToCustomerService.delete(
      `${this.logSubscriptionUrl}/${subscriptionId}`,
    )
      .then(({ data }) => {
        this.LogToCustomerService.pollOperation(
          this.selectedAccount.serviceName,
          data,
        ).then(() => this.getStreamData());
      })
      .catch(({ data }) => {
        this.errorMessage = data.message;
        this.loading = false;
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

    this.LDPHomePageLink = this.coreURLBuilder.buildURL(
      'dedicated',
      `#/dbaas/logs/${this.selectedAccount.serviceName}/home`,
    );

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
    window.open(
      this.coreURLBuilder.buildURL(
        'dedicated',
        `#/dbaas/logs/${this.selectedAccount.serviceName}/streams/add`,
      ),
      '_blank',
    );
  }
}
