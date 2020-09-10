import isEqual from 'lodash/isEqual';
import { VM_ENCRYPTION_KMS } from '../../dedicatedCloud-security.constants';

export default class {
  /* @ngInject */
  constructor($timeout, $translate, DedicatedCloud) {
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.DedicatedCloud = DedicatedCloud;
    this.serviceName = this.productId;
  }

  $onInit() {
    this.deletionTaskId = null;
    this.kmsDeletionTask = {
      name: null,
      state: null,
      progress: 0,
      description: null,
    };

    this.pollRequestPending = false;
  }

  deleteKms() {
    this.kmsDeletionTask.name = this.$translate.instant(
      'dedicatedCloud_vm_encryption_delete_kms_deleting',
    );
    this.kmsDeletionTask.state = this.$translate.instant(
      'dedicatedCloud_vm_encryption_kms_pending_task_state',
    );
    return this.DedicatedCloud.deleteVMEncryptionKMS(
      this.serviceName,
      this.kmsToDelete.kmsId,
    )
      .then(({ taskId }) => {
        this.deletionTaskId = taskId;
        this.pollDeletionTask();
      })
      .catch((error) => {
        this.error = error;
      });
  }

  pollDeletionTask() {
    if (
      this.deletionTaskId &&
      !this.pollRequestPending &&
      !this.isTaskFinishedOrCanceled()
    ) {
      this.pollRequestPending = true;
      this.DedicatedCloud.startVMEncryptionKMSPoller(
        this.serviceName,
        this.deletionTaskId,
      )
        .then((taskDetails) => {
          this.kmsDeletionTask = taskDetails;
        })
        .catch(() => {
          this.stopDeletionPoller();
        })
        .finally(() => {
          this.$timeout(() => {
            this.pollRequestPending = false;
          }, VM_ENCRYPTION_KMS.pollingDelay);
        });
    }
  }

  getTaskDetails() {
    return `${this.kmsDeletionTask.progress} % ${
      this.kmsDeletionTask.description
        ? `(${this.kmsDeletionTask.description})`
        : ''
    }`;
  }

  isDeletionStepValid() {
    this.pollDeletionTask();

    return this.isTaskFinishedOrCanceled();
  }

  finishDeletion() {
    this.stopDeletionPoller();

    if (isEqual(this.kmsDeletionTask.state, 'done')) {
      this.goBack(
        this.$translate.instant('dedicatedCloud_vm_encryption_kms_deleted'),
      );
    } else {
      this.goBack();
    }
  }

  isTaskFinishedOrCanceled() {
    return VM_ENCRYPTION_KMS.endStatus.includes(this.kmsDeletionTask.state);
  }

  stopDeletionPoller() {
    return this.DedicatedCloud.stopVMEncryptionPoller(
      this.kmsDeletionTask.taskId,
    );
  }
}
