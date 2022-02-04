import { stringToDuration } from '../durationHelper.constants';
import Namespace from '../../../../../../../components/project/storages/databases/namespace.class';
import { FORM_RULES } from './add.constants';

export default class {
  /* @ngInject */
  constructor($translate, DatabaseService) {
    this.$translate = $translate;
    this.DatabaseService = DatabaseService;
    this.FORM_RULES = FORM_RULES;
  }

  $onInit() {
    this.trackDashboard('namespace::create', 'page');
    this.model = {
      type: 'aggregated',
      retention: {},
    };
  }

  prepareModel() {
    return new Namespace({
      name: this.model.name,
      resolution: stringToDuration(this.model.resolution),
      retention: {
        blockDataExpirationDuration: stringToDuration(
          this.model.retention.blockDataExpirationDuration,
        ),
        blockSizeDuration: stringToDuration(
          this.model.retention.blockSizeDuration,
        ),
        bufferFutureDuration: stringToDuration(
          this.model.retention.bufferFutureDuration,
        ),
        bufferPastDuration: stringToDuration(
          this.model.retention.bufferPastDuration,
        ),
        periodDuration: stringToDuration(this.model.retention.periodDuration),
      },
      snapshotEnabled: this.model.snapshotEnabled,
      type: this.model.type,
      writesToCommitLogEnabled: this.model.writesToCommitLogEnabled,
    });
  }

  add() {
    this.processing = true;
    this.trackDashboard('namespace::create_confirm');
    return this.DatabaseService.addNamespace(
      this.projectId,
      this.database.engine,
      this.database.id,
      this.prepareModel(),
    )
      .then(() => {
        this.trackDashboard('namespace::create_validated');
        return this.goBack({
          textHtml: this.$translate.instant(
            'pci_databases_namespaces_add_success_message',
          ),
        });
      })
      .catch((err) => {
        this.trackDashboard('namespaces::create_error');
        return this.goBack(
          this.$translate.instant(
            'pci_databases_namespaces_add_error_message',
            {
              message: err.data?.message || null,
            },
          ),
          'error',
        );
      });
  }
}
