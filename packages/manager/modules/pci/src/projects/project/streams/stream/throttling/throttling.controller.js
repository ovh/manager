import get from 'lodash/get';
import Stream from '../../stream.class';

export default class PciStreamsStreamThrottlingController {
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

    this.editStream = new Stream({
      ...this.stream,
    });
  }

  updateStream() {
    this.isLoading = true;
    return this.PciProjectStreamService
      .update(this.projectId, this.editStream)
      .then(() => this.goBack(this.$translate.instant(
        'pci_projects_project_streams_stream_throttling_success_message',
      )))
      .catch(err => this.goBack(this.$translate.instant(
        'pci_projects_project_streams_stream_throttling_error_throttling',
        {
          message: get(err, 'data.message', null),
        },
      ), 'error'))
      .finally(() => {
        this.isLoading = false;
      });
  }
}
