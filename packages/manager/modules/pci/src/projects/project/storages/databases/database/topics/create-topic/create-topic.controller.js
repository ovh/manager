import get from 'lodash/get';
import capitalize from 'lodash/capitalize';
import { TOPICS_DEFAULT_VALUES } from './create-topic.constants';

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
      replication: TOPICS_DEFAULT_VALUES.replication,
      partitions: TOPICS_DEFAULT_VALUES.partitions,
      retentionBytes: TOPICS_DEFAULT_VALUES.retentionBytes,
      retentionHours: TOPICS_DEFAULT_VALUES.retentionHours,
      minInsyncReplicas: TOPICS_DEFAULT_VALUES.minInsyncReplicas,
      cleanupPolicy: TOPICS_DEFAULT_VALUES.cleanupPolicy,
      status: TOPICS_DEFAULT_VALUES.status,
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
