import get from 'lodash/get';
import isEqual from 'lodash/isEqual';

import { Environment } from '@ovh-ux/manager-config';

import { VM_ENCRYPTION_KMS } from '../../dedicatedCloud-security.constants';
import config from '../../../../../config/config';

export default class {
  /* @ngInject */
  constructor($timeout, $translate, DedicatedCloud) {
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.DedicatedCloud = DedicatedCloud;

    this.serviceName = this.productId;

    this.regex = {
      ip: VM_ENCRYPTION_KMS.regex.ip,
      sslThumbprint: VM_ENCRYPTION_KMS.regex.sslThumbprint,
    };
  }

  $onInit() {
    this.creationTaskId = null;
    this.kms = {
      ip: null,
      description: null,
      sslThumbprint: null,
    };

    this.kmsCreationTask = {
      name: null,
      state: null,
      progress: 0,
      description: null,
    };

    this.pollRequestPending = false;
    const usedLanguage = Environment.getUserLocale();
    if (usedLanguage) {
      const frenchLanguages = ['fr_FR', 'fr_CA'];
      this.vmEncryptionGuide = frenchLanguages.includes(usedLanguage)
        ? config.constants.URLS.FR.guides.vmEncryption
        : config.constants.URLS.GB.guides.vmEncryption;
    }
  }

  isFormValid() {
    return get(this.newKmsForm, '$valid') && this.documentationRead;
  }

  createNewKms() {
    this.kmsCreationTask.name = this.$translate.instant(
      'dedicatedCloud_vm_encryption_add_kms_creating',
    );
    this.kmsCreationTask.state = this.$translate.instant(
      'dedicatedCloud_vm_encryption_kms_pending_task_state',
    );
    return this.DedicatedCloud.createVMEncryptionKMS(this.serviceName, this.kms)
      .then(({ taskId }) => {
        this.creationTaskId = taskId;
        this.pollCreationTask();
      })
      .catch((error) => {
        this.error = error;
      });
  }

  pollCreationTask() {
    if (
      this.creationTaskId &&
      !this.pollRequestPending &&
      !this.isTaskFinishedOrCanceled()
    ) {
      this.pollRequestPending = true;
      this.DedicatedCloud.startVMEncryptionKMSPoller(
        this.serviceName,
        this.creationTaskId,
      )
        .then((taskDetails) => {
          this.kmsCreationTask = taskDetails;
        })
        .catch(() => {
          this.stopCreationPoller();
        })
        .finally(() => {
          this.$timeout(() => {
            this.pollRequestPending = false;
          }, VM_ENCRYPTION_KMS.pollingDelay);
        });
    }
  }

  getTaskDetails() {
    if (isEqual(this.kmsCreationTask.state, 'canceled')) {
      return `${this.$translate.instant(
        'dedicatedCloud_vm_encryption_add_kms_creation_canceled',
      )} : ${this.kmsCreationTask.description}`;
    }

    return `${this.kmsCreationTask.progress} % ${
      this.kmsCreationTask.description
        ? `(${this.kmsCreationTask.description})`
        : ''
    }`;
  }

  isCreationStepValid() {
    this.pollCreationTask();

    return this.isTaskFinishedOrCanceled();
  }

  isTaskFinishedOrCanceled() {
    return VM_ENCRYPTION_KMS.endStatus.includes(this.kmsCreationTask.state);
  }

  isWaitingUserAction() {
    return (
      VM_ENCRYPTION_KMS.waitingStatus.includes(this.kmsCreationTask.state) &&
      isEqual(
        this.kmsCreationTask.description,
        VM_ENCRYPTION_KMS.creationTaskWaitingConfiguration,
      )
    );
  }

  finishCreation() {
    this.stopCreationPoller();

    if (isEqual(this.kmsCreationTask.state, 'done')) {
      this.goBack(
        this.$translate.instant('dedicatedCloud_vm_encryption_kms_added'),
      );
    } else {
      this.goBack();
    }
  }

  stopCreationPoller() {
    return this.DedicatedCloud.stopVMEncryptionPoller(
      this.kmsCreationTask.taskId,
    );
  }
}
