import Workflow from './Workflow.class';

import { getCriteria } from '../project.utils';

export default class {
  /* @ngInject */
  constructor(CucCloudMessage, OvhApiCloudProjectInstance) {
    this.CucCloudMessage = CucCloudMessage;
    this.OvhApiCloudProjectInstance = OvhApiCloudProjectInstance;
  }

  $onInit() {
    this.loadMessages();
    this.criteria = getCriteria('id', this.workflowId);
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe('pci.projects.project.workflow');
    this.messageHandler = this.CucCloudMessage.subscribe(
      'pci.projects.project.workflow',
      { onMessage: () => this.refreshMessages() },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  getInstance(workflow) {
    return this.OvhApiCloudProjectInstance.v6()
      .get({
        instanceId: workflow.instanceId,
        serviceName: this.projectId,
      })
      .$promise.then(
        (instance) =>
          new Workflow({ ...workflow, instanceName: instance.name }),
      );
  }
}
