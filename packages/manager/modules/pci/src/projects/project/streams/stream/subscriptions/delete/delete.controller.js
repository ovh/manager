import get from 'lodash/get';

export default class PciStreamsStreamSubscriptionsDeleteController {
  /* @ngInject */
  constructor(
    $translate,
    PciProjectStreamsStreamSubscriptionsService,
  ) {
    this.$translate = $translate;
    this.PciProjectStreamsStreamSubscriptionsService = PciProjectStreamsStreamSubscriptionsService;
  }

  $onInit() {
    this.isLoading = false;
  }

  deleteSubscription() {
    this.isLoading = true;
    return this.PciProjectStreamsStreamSubscriptionsService
      .delete(this.projectId, this.streamId, this.subscription.id)
      .then(() => this.goBack(this.$translate.instant(
        'pci_projects_project_streams_stream_subscriptions_delete_success_message',
        {
          subscription: this.subscription.name,
        },
      )))
      .catch(err => this.goBack(this.$translate.instant(
        'pci_projects_project_streams_stream_subscriptions_delete_error_delete',
        {
          message: get(err, 'data.message', null),
          subscription: this.subscription.name,
        },
      ), 'error'))
      .finally(() => {
        this.isLoading = false;
      });
  }
}
