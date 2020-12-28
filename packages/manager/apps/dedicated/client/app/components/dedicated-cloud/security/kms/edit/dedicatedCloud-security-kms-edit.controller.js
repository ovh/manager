import get from 'lodash/get';
import includes from 'lodash/includes';
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
    this.editTaskId = null;
    this.kmsEditionTask = {
      name: null,
      state: null,
      progress: 0,
      description: null,
    };
    this.sslThumbprintRegex = VM_ENCRYPTION_KMS.regex.sslThumbprint;
    this.pollRequestPending = false;
  }

  editKms() {
    this.kmsEditionTask.name = this.$translate.instant(
      'dedicatedCloud_vm_encryption_edit_kms_editing',
    );
    this.kmsEditionTask.state = this.$translate.instant(
      'dedicatedCloud_vm_encryption_kms_pending_task_state',
    );
    return this.DedicatedCloud.editVMEncryptionKMS(
      this.serviceName,
      this.kmsToEdit,
    )
      .then(({ taskId }) => {
        this.editTaskId = taskId;
        this.pollEditionTask();
      })
      .catch((error) => {
        this.error = error;
      });
  }

  pollEditionTask() {
    if (
      this.editTaskId &&
      !this.pollRequestPending &&
      !this.isTaskFinishedOrCanceled()
    ) {
      this.pollRequestPending = true;
      this.DedicatedCloud.startVMEncryptionKMSPoller(
        this.serviceName,
        this.editTaskId,
      )
        .then((taskDetails) => {
          this.kmsEditionTask = taskDetails;
        })
        .catch(() => {
          this.stopEditionPoller();
        })
        .finally(() => {
          this.$timeout(() => {
            this.pollRequestPending = false;
          }, VM_ENCRYPTION_KMS.pollingDelay);
        });
    }
  }

  isFormValid() {
    return get(this.kmsEditForm, '$valid');
  }

  getTaskDetails() {
    return `${this.kmsEditionTask.progress} % ${
      this.kmsEditionTask.description
        ? `(${this.kmsEditionTask.description})`
        : ''
    }`;
  }

  isEditionStepValid() {
    this.pollEditionTask();

    return this.isTaskFinishedOrCanceled();
  }

  finishEdition() {
    this.stopEditionPoller();

    if (isEqual(this.kmsEditionTask.state, 'done')) {
      this.goBack(
        this.$translate.instant('dedicatedCloud_vm_encryption_kms_edited'),
      );
    } else {
      this.goBack();
    }
  }

  isTaskFinishedOrCanceled() {
    return includes(VM_ENCRYPTION_KMS.endStatus, this.kmsEditionTask.state);
  }

  stopEditionPoller() {
    return this.DedicatedCloud.stopVMEncryptionPoller(
      this.kmsEditionTask.taskId,
    );
  }
}
