import get from 'lodash/get';

export default class PciStreamsStreamSubscriptionsAddController {
  /* @ngInject */
  constructor($translate, PciProjectStreamsStreamSubscriptionsService) {
    this.$translate = $translate;
    this.PciProjectStreamsStreamSubscriptionsService = PciProjectStreamsStreamSubscriptionsService;
  }

  $onInit() {
    this.isLoading = false;
    this.name = '';
  }

  createSubscription() {
    this.isLoading = true;
    return this.PciProjectStreamsStreamSubscriptionsService.add(
      this.projectId,
      this.streamId,
      this.name,
    )
      .then(() =>
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_streams_stream_subscriptions_add_success_message',
            {
              subscription: this.name,
            },
          ),
        ),
      )
      .catch((err) =>
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_streams_stream_subscriptions_add_error_add',
            {
              message: get(err, 'data.message', null),
              subscription: this.name,
            },
          ),
          'error',
        ),
      )
      .finally(() => {
        this.isLoading = false;
      });
  }
}
