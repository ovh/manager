import { DATA_PLATFORM_GUIDE } from '../constants';

export default class LogToCustomerTileCtrl {
  /* @ngInject */
  constructor(
    LogToCustomerService,
    coreConfig,
    coreURLBuilder,
    $q,
    $translate,
    Alerter,
  ) {
    this.LogToCustomerService = LogToCustomerService;
    this.user = coreConfig.getUser();
    this.coreURLBuilder = coreURLBuilder;
    this.$q = $q;
    this.$translate = $translate;
    this.Alerter = Alerter;
  }

  $onInit() {
    this.dbaasLogsURL = this.coreURLBuilder.buildURL(
      'dedicated',
      '#/dbaas/logs',
    );

    this.links = {
      logPlatformGuide:
        DATA_PLATFORM_GUIDE[this.user.ovhSubsidiary] ||
        DATA_PLATFORM_GUIDE.DEFAULT,
      createStream: this.dbaasLogsURL,
      createAccount: `${this.dbaasLogsURL}/order`,
    };

    this.hasAtLeastOneDataStream = false;
    this.loadStreams();
  }

  loadStreams() {
    this.loading = true;
    this.streamSubscriptions = [];

    return this.$q
      .all([this.getDataStreams(), this.getSubscribedStreams()])
      .catch(({ data }) => {
        this.alertError(data.message);
      })
      .finally(() => {
        this.loading = false;
      });
  }

  alertError(message = '') {
    this.Alerter.error(this.$translate.instant('error_message', { message }));
  }

  async getSubscribedStreams() {
    try {
      const data = await this.LogToCustomerService.icebergQuery(
        this.logSubscriptionUrl,
        { kind: this.kind },
      );

      const streamPromises = data.map(async (subscription) => {
        const [account, stream, url] = await this.$q.all([
          this.LogToCustomerService.getLogAccount(subscription.serviceName),
          this.LogToCustomerService.getSream(
            subscription.serviceName,
            subscription.streamId,
          ),
          this.LogToCustomerService.getStreamUrl(
            subscription.serviceName,
            subscription.streamId,
          ),
        ]);

        return {
          ...subscription,
          isLoading: false,
          userName: account.username,
          displayName: account.displayName || account.serviceName,
          streamName: stream.title,
          streamUrl: url,
        };
      });

      this.streamSubscriptions = await this.$q.all(streamPromises);
    } catch (error) {
      this.alertError(error.message);
    }
  }

  getDataStreams() {
    return this.LogToCustomerService.getDataStreams().then(
      ({ streams, streamCount }) => {
        this.logAccountStreams = streams;
        this.hasAtLeastOneDataStream = streamCount > 0;
      },
    );
  }

  deleteLogSubscription(subscription) {
    this.trackClick(this.trackingHits.STOP_TRANSFER);

    // eslint-disable-next-line no-param-reassign
    subscription.isLoading = true;

    this.LogToCustomerService.delete(
      `${this.logSubscriptionUrl}/${subscription.subscriptionId}`,
    )
      .then(({ data }) => {
        return this.LogToCustomerService.pollOperation(
          subscription.serviceName,
          data,
        ).then(() => {
          this.Alerter.success(
            this.$translate.instant('logs_list_unsubscription_success'),
          );
          return this.loadStreams();
        });
      })
      .catch(({ data }) => {
        this.alertError(data.message);
      })
      .finally(() => {
        // eslint-disable-next-line no-param-reassign
        subscription.isLoading = false;
      });
  }

  goToStreamListingPage(preventTracking = false) {
    if (!preventTracking) {
      this.trackClick(this.trackingHits.TRANSFER);
    }
    this.goToListingPage({ kind: this.kind });
  }
}
