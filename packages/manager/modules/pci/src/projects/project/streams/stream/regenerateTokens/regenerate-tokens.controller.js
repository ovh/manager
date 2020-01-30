import get from 'lodash/get';

export default class PciStreamsStreamDeleteController {
  /* @ngInject */
  constructor($translate, PciProjectStreamsTokensService) {
    this.$translate = $translate;
    this.PciProjectStreamsTokensService = PciProjectStreamsTokensService;
  }

  $onInit() {
    this.isLoading = false;
  }

  regenerateTokens() {
    this.isLoading = true;
    return this.PciProjectStreamsTokensService.regenerateTokens(
      this.projectId,
      this.stream,
    )
      .then(() =>
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_streams_stream_regenerate_tokens_success_message',
          ),
        ),
      )
      .catch((err) =>
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_streams_stream_regenerate_tokens_error_regenerate_tokens',
            {
              message: get(err, 'data.message', null),
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
