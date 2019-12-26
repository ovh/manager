import get from 'lodash/get';
import Stream from '../../stream.class';

export default class PciStreamsStreamReplayRetentionController {
  /* @ngInject */
  constructor($translate, PciProjectStreamService) {
    this.$translate = $translate;
    this.PciProjectStreamService = PciProjectStreamService;
  }

  $onInit() {
    this.isLoading = false;
    this.minRetention = 1;

    this.editStream = new Stream(this.stream);
    this.replayValue = this.editStream.getRetentionAsHours();
  }

  updateStream() {
    this.editStream.setRetentionFromHours(this.replayValue);
    this.isLoading = true;
    return this.PciProjectStreamService.update(this.projectId, this.editStream)
      .then(() =>
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_streams_stream_replay_retention_success_message',
          ),
        ),
      )
      .catch((err) =>
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_streams_stream_replay_retention_error_replay_retention',
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
