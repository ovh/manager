import get from 'lodash/get';
import Stream from '../../stream.class';

export default class PciStreamsStreamBacklogRetentionController {
  /* @ngInject */
  constructor($translate, PciProjectStreamService) {
    this.$translate = $translate;
    this.PciProjectStreamService = PciProjectStreamService;
  }

  $onInit() {
    this.isLoading = false;
    this.minRetention = 1;

    this.editStream = new Stream(this.stream);

    this.backlogValue = this.editStream.getBacklogAsHours();
  }

  updateStream() {
    this.editStream.setBacklogFromHours(this.backlogValue);
    this.isLoading = true;
    return this.PciProjectStreamService.update(this.projectId, this.editStream)
      .then(() =>
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_streams_stream_backlog_retention_success_message',
          ),
        ),
      )
      .catch((err) =>
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_streams_stream_backlog_retention_error_backlog_retention',
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
