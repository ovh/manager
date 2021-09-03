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
    this.trackDashboard('topics::delete', 'page');
  }

  cancel() {
    this.goBack();
  }

  deleteTopic() {
    this.trackDashboard('topics::delete_validate');
    this.processing = true;
    return this.DatabaseService.deleteTopic(
      this.projectId,
      this.database.engine,
      this.database.id,
      this.topic.id,
    )
      .then(() =>
        this.goBack({
          textHtml: this.$translate.instant(
            'pci_databases_topics_delete_topic_success_message',
          ),
        }),
      )
      .catch((err) =>
        this.goBack(
          this.$translate.instant(
            'pci_databases_topics_delete_topic_error_message',
            {
              message: get(err, 'data.message', null),
            },
          ),
          'error',
        ),
      );
  }
}
