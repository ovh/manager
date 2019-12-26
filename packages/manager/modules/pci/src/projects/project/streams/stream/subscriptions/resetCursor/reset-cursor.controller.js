import get from 'lodash/get';

export default class PciStreamsStreamSubscriptionsResetCursorController {
  /* @ngInject */
  constructor($translate, PciProjectStreamsStreamSubscriptionsService) {
    this.$translate = $translate;
    this.PciProjectStreamsStreamSubscriptionsService = PciProjectStreamsStreamSubscriptionsService;
  }

  $onInit() {
    this.isLoading = false;
  }

  resetCursor() {
    this.isLoading = true;
    return this.PciProjectStreamsStreamSubscriptionsService.resetCursor(
      this.projectId,
      this.streamId,
      this.subscription.id,
    )
      .then(() =>
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_streams_stream_subscriptions_reset_cursor_success_message',
            {
              subscription: this.subscription.name,
            },
          ),
        ),
      )
      .catch((err) =>
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_streams_stream_subscriptions_reset_cursor_error_reset_cursor',
            {
              message: get(err, 'data.message', null),
              subscription: this.subscription.name,
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
