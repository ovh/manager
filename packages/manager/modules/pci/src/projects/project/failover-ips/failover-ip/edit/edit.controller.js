import find from 'lodash/find';

const MESSAGES_CONTAINER_NAME = 'pci.projects.project.failover-ips';

export default class FailoverIpEditController {
  /* @ngInject */
  constructor(
    $q,
    $state,
    $stateParams,
    $translate,
    CucCloudMessage,
    OvhApiCloudProject,
    OvhApiCloudProjectIpFailover,
  ) {
    this.$q = $q;
    this.$state = $state;
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.OvhApiCloudProject = OvhApiCloudProject;
    this.OvhApiCloudProjectIpFailover = OvhApiCloudProjectIpFailover;

    this.isLoading = false;
    this.projectId = $stateParams.projectId;
    this.serviceName = $stateParams.serviceName;

    this.ngInit();
  }

  ngInit() {
    this.isLoading = true;

    return this.$q.all([
      this.OvhApiCloudProject.Instance().v6().query({
        serviceName: this.projectId,
      })
        .$promise,
      this.OvhApiCloudProjectIpFailover.v6().get({
        serviceName: this.projectId,
        id: this.serviceName,
      })
        .$promise,
    ])
      .then(([instances, ip]) => {
        this.instances = instances;
        this.ip = ip;
      })
      .catch(({ data }) => {
        this.CucCloudMessage.error(
          this.$translate.instant('pci_projects_project_failover-ip_error', { error: data.message }),
          MESSAGES_CONTAINER_NAME,
        );
        this.goBack();
      })
      .finally(() => {
        if (this.ip && this.ip.routedTo) {
          this.instance = find(this.instances, { id: this.ip.routedTo });
        }

        this.isLoading = false;
      });
  }

  goBack() {
    this.$state.go('^');
  }

  edit() {
    this.isLoading = true;

    this
      .OvhApiCloudProjectIpFailover
      .v6()
      .attach({
        serviceName: this.projectId,
        id: this.ip.id,
      },
      {
        instanceId: this.instance.id,
      })
      .$promise
      .then(() => {
        this.CucCloudMessage.success(
          this.$translate.instant('pci_projects_project_failover-ip_edit', { ip: this.ip.ip }),
          MESSAGES_CONTAINER_NAME,
        );
      })
      .catch(({ data }) => {
        this.CucCloudMessage.error(
          this.$translate.instant('pci_projects_project_failover-ip_edit_error', { error: data.message }),
          MESSAGES_CONTAINER_NAME,
        );
      })
      .finally(() => {
        this.goBack();
        this.isLoading = false;
      });
  }
}
