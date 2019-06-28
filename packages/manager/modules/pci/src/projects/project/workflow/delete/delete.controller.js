import get from 'lodash/get';

import { DELETE_CONFIRMATION_INPUT } from './delete.constants';

export default class WorkflowDeleteCtrl {
  /* @ngInject */
  constructor(
    $translate,
    OvhApiCloudProjectRegionWorkflowBackup,
  ) {
    this.$translate = $translate;
    this.OvhApiCloudProjectRegionWorkflowBackup = OvhApiCloudProjectRegionWorkflowBackup;
    this.DELETE_CONFIRMATION_INPUT = DELETE_CONFIRMATION_INPUT;
  }

  $onInit() {
    this.isDeleting = false;
  }

  delete() {
    this.isDeleting = true;
    return this.OvhApiCloudProjectRegionWorkflowBackup.v6().delete({
      serviceName: this.projectId,
      regionName: this.instance.region,
      backupWorkflowId: this.workflowId,
    }).$promise
      .then(() => this.goToHomePage(
        this.$translate.instant('pci_workflow_delete_success', { workflowName: this.workflow.name }),
      ))
      .catch(error => this.goToHomePage(
        this.$translate.instant('pci_workflow_delete_error', {
          message: get(error, 'data.message'),
        }), 'error',
      ));
  }
}
