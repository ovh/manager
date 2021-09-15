import get from 'lodash/get';
import capitalize from 'lodash/capitalize';

export default class {
  /* @ngInject */
  constructor($translate, DatabaseService) {
    this.$translate = $translate;
    this.capitalize = capitalize;
    this.DatabaseService = DatabaseService;
  }

  $onInit() {
    this.trackDashboard('topics::add', 'page');
    this.model = {
      name: '',
      replication: 3,
      partitions: 1,
      retentionBytes: -1,
      retentionHours: -1,
      minInsyncReplicas: 2,
      cleanupPolicy: 'default',
      status: 'READY',
    };
  }

  cancel() {
    this.goBack();
  }

  addTopic() {
    this.processing = true;
    this.trackDashboard('topics::add_validate');
    return this.DatabaseService.addTopic(
      this.projectId,
      this.database.engine,
      this.database.id,
      this.model,
    )
      .then(() =>
        this.goBack({
          textHtml: this.$translate.instant(
            'pci_databases_topics_create_topic_success_message',
          ),
        }),
      )
      .catch((err) =>
        this.goBack(
          this.$translate.instant(
            'pci_databases_topics_create_topic_error_message',
            {
              message: get(err, 'data.message', null),
            },
          ),
          'error',
        ),
      );
  }
}
