import get from 'lodash/get';

export default class PciStreamsStreamDeleteController {
  /* @ngInject */
  constructor(
    $translate,
    PciProjectStreamService,
  ) {
    this.$translate = $translate;
    this.PciProjectStreamService = PciProjectStreamService;
  }

  $onInit() {
    this.isLoading = false;
  }

  deleteStream() {
    this.isLoading = true;
    return this.PciProjectStreamService
      .delete(this.projectId, this.stream)
      .then(() => this.goBack(this.$translate.instant(
        'pci_projects_project_streams_stream_delete_success_message',
        {
          stream: this.stream.name,
        },
      )))
      .catch(err => this.goBack(this.$translate.instant(
        'pci_projects_project_streams_stream_delete_error_delete',
        {
          message: get(err, 'data.message', null),
          stream: this.stream.name,
        },
      ), 'error'))
      .finally(() => {
        this.isLoading = false;
      });
  }
}
