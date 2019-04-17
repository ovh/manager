const MESSAGES_CONTAINER_NAME = 'pci.projects.project.failover-ips';

export default class FailoverIpController {
  /* @ngInject */
  constructor($translate, CucCloudMessage, OvhApiCloudProjectIpFailover, projectId) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.OvhApiCloudProjectIpFailover = OvhApiCloudProjectIpFailover;
    this.projectId = projectId;

    this.messageHandler = CucCloudMessage.subscribe(MESSAGES_CONTAINER_NAME, {
      onMessage: () => this.refreshMessage(),
    });
  }

  loadPartialData({ offset, pageSize }) {
    return this.OvhApiCloudProjectIpFailover
      .v6()
      .query({
        serviceName: this.projectId,
      })
      .$promise
      .then(data => ({
        data: data.slice(offset - 1, offset + pageSize - 1),
        meta: {
          totalCount: data.length,
          currentOffset: offset,
          pageCount: Math.ceil(data.length / pageSize),
          pageSize,
        },
      }))
      .catch(({ data }) => {
        this.CucCloudMessage.error(
          this.$translate.instant('pci_projects_project_failoverip_error', { error: data.message }),
          MESSAGES_CONTAINER_NAME,
        );
      });
  }

  refreshMessage() {
    this.messages = this.messageHandler.getMessages();
  }
}
