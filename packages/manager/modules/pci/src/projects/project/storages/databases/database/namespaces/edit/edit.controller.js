import {
  stringToDuration,
  durationStringToString,
} from '../durationHelper.constants';
import Namespace from '../../../../../../../components/project/storages/databases/namespace.class';
import { FORM_RULES } from '../add/add.constants';

export default class {
  /* @ngInject */
  constructor($translate, DatabaseService) {
    this.$translate = $translate;
    this.DatabaseService = DatabaseService;
    this.FORM_RULES = FORM_RULES;
  }

  $onInit() {
    this.trackDashboard('namespace::modify', 'page');
    this.model = {
      name: this.namespace.name,
      resolution: durationStringToString(this.namespace.resolution),
      retention: {
        blockDataExpirationDuration: durationStringToString(
          this.namespace.retention.blockDataExpirationDuration,
        ),
        blockSizeDuration: durationStringToString(
          this.namespace.retention.blockSizeDuration,
        ),
        bufferFutureDuration: durationStringToString(
          this.namespace.retention.bufferFutureDuration,
        ),
        bufferPastDuration: durationStringToString(
          this.namespace.retention.bufferPastDuration,
        ),
        periodDuration: durationStringToString(
          this.namespace.retention.periodDuration,
        ),
      },
      snapshotEnabled: this.namespace.snapshotEnabled,
      type: this.namespace.type,
      writesToCommitLogEnabled: this.namespace.writesToCommitLogEnabled,
    };
  }

  prepareModel() {
    return new Namespace({
      resolution:
        this.namespace.type === 'unaggregated'
          ? null
          : stringToDuration(this.model.resolution),
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
      writesToCommitLogEnabled: this.model.writesToCommitLogEnabled,
    });
  }

  cancel() {
    this.trackDashboard('namespaces::actions_menu::modify_namespace_cancel');
    this.goBack();
  }

  edit() {
    this.processing = true;
    this.trackDashboard('namespace::modify_confirm');
    return this.DatabaseService.editNamespace(
      this.projectId,
      this.database.engine,
      this.database.id,
      this.namespace.id,
      this.prepareModel(),
    )
      .then(() => {
        this.trackDashboard('namespace::modify_validated');
        return this.goBack({
          textHtml: this.$translate.instant(
            'pci_databases_namespaces_edit_success_message',
          ),
        });
      })
      .catch((err) => {
        this.trackDashboard('namespaces::modify_error');
        return this.goBack(
          this.$translate.instant(
            'pci_databases_namespaces_edit_error_message',
            {
              message: err.data?.message || null,
            },
          ),
          'error',
        );
      });
  }
}
