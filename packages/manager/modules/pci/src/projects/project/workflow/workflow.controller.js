import set from 'lodash/set';

export default class {
  /* @ngInject */
  constructor(
    CucCloudMessage,
    OvhApiCloudProjectInstance,
  ) {
    this.CucCloudMessage = CucCloudMessage;
    this.OvhApiCloudProjectInstance = OvhApiCloudProjectInstance;
  }

  $onInit() {
    this.loadMessages();
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe('pci.projects.project.workflow');
    this.messageHandler = this.CucCloudMessage.subscribe('pci.projects.project.workflow', { onMessage: () => this.refreshMessages() });
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  getInstance(workflow) {
    return this.OvhApiCloudProjectInstance.v6().get({
      serviceName: this.projectId,
      instanceId: workflow.instanceId,
    }).$promise
      .then((instance) => {
        set(workflow, 'instanceName', instance.name);
        return workflow;
      });
  }
}
