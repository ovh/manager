import startCase from 'lodash/startCase';
import datagridToIcebergFilter from '../../logs-iceberg.utils';
import { TRACKING_HITS } from './subscriptions.constants';

export default class LogsStreamsSubscriptionsCtrl {
  /* @ngInject */
  constructor(
    $stateParams,
    $translate,
    ouiDatagridService,
    CucCloudMessage,
    CucControllerHelper,
    LogsHelperService,
    LogsStreamsService,
    LogsStreamsSubscriptionsService,
  ) {
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.ouiDatagridService = ouiDatagridService;
    this.CucCloudMessage = CucCloudMessage;
    this.CucControllerHelper = CucControllerHelper;
    this.LogsHelperService = LogsHelperService;
    this.LogsStreamsService = LogsStreamsService;
    this.LogsStreamsSubscriptionsService = LogsStreamsSubscriptionsService;

    this.serviceName = this.$stateParams.serviceName;
    this.streamId = this.$stateParams.streamId;
    this.TRACKING_HITS = TRACKING_HITS;
  }

  $onInit() {
    this.stream = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.LogsStreamsService.getStream(this.serviceName, this.streamId),
    });
    this.stream.load();
  }

  getResourceName(subscription) {
    const key = `streams_subscriptions_resource_products_${subscription.resource.type}`;
    const translated = this.$translate.instant(key);
    if (translated === key) {
      return startCase(
        subscription.resource.type.replace('-', ' ').toLowerCase(),
      );
    }
    return translated;
  }

  /**
   * Retrieve subscription list, according to pagination/sort/filter
   *
   * @param offset int element offset to retrieve results from
   * @param pageSize int Number of results to retrieve
   * @param sort Object Sort object from ovh-ui datagrid
   * @param criteria Object Criteria object from ovh-ui datagrid
   * @return {*|Promise<any>}
   */
  loadSubscriptions({ offset, pageSize = 1, sort, criteria }) {
    const filters = criteria.map((criterion) => {
      const name = criterion.property || 'resource.name';
      return datagridToIcebergFilter(name, criterion.operator, criterion.value);
    });
    const pageOffset = Math.ceil(offset / pageSize);
    return this.LogsStreamsSubscriptionsService.getPaginatedStreamSubscriptions(
      this.serviceName,
      this.streamId,
      pageOffset,
      pageSize,
      { name: sort.property, dir: sort.dir === -1 ? 'DESC' : 'ASC' },
      filters,
    );
  }

  /**
   * Display a modal to confirm subscription deletion
   *
   * @param subscription Object Subscription object from API
   * @return {*|Promise<any>}
   */
  showSubscriptionDeleteConfirm(subscription) {
    this.CucCloudMessage.flushChildMessage();
    return this.CucControllerHelper.modal
      .showDeleteModal({
        titleText: this.$translate.instant(
          'streams_subscriptions_delete_modal_title',
        ),
        textHtml: this.$translate.instant(
          'streams_subscriptions_delete_modal_content',
          {
            resourceName: `<strong>${subscription.resource.name}</strong>`,
          },
        ),
      })
      .then(() => this.removeSubscription(subscription));
  }

  /**
   * Delete a subscription on API
   * Update datagrid accordingly
   *
   * @param subscription Object Subscription object from API
   */
  removeSubscription(subscription) {
    this.trackClick(this.TRACKING_HITS.DELETE);
    this.CucCloudMessage.flushChildMessage();
    this.deleteSubscriptionLoading = true;
    this.LogsStreamsSubscriptionsService.deleteSubscription(
      this.serviceName,
      this.streamId,
      subscription,
    )
      .then((operation) =>
        this.LogsHelperService.handleOperation(
          this.serviceName,
          operation.data,
          'streams_subscriptions_delete_success',
          { resourceName: subscription.resource.name },
        ),
      )
      .catch((err) => {
        this.LogsHelperService.handleError(
          'streams_subscriptions_delete_error',
          err,
          { resourceName: subscription.resource.name },
        );
      })
      .finally(() => {
        this.deleteSubscriptionLoading = false;
        this.ouiDatagridService.refresh('subscriptions-datagrid', true);
        this.CucControllerHelper.scrollPageToTop();
      });
  }
}
