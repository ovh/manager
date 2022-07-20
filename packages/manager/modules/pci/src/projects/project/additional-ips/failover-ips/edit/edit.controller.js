import find from 'lodash/find';

const MESSAGES_CONTAINER_NAME = 'pci.projects.project.additional-ips';

export default class AdditionalIpsFailoverIpsEditController {
  /* @ngInject */
  constructor($translate, CucCloudMessage, OvhApiCloudProjectIpFailover) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.OvhApiCloudProjectIpFailover = OvhApiCloudProjectIpFailover;

    this.isLoading = false;
  }

  $onInit() {
    this.instance = this.ip ? this.ip.instance : null;

    if (!this.instance && this.ip && this.ip.routedTo) {
      this.instance = find(this.instances, { id: this.ip.routedTo });
    }
  }

  onCancelClick() {
    this.trackClick('failover-ips::edit::cancel');
    return this.goBack();
  }

  edit() {
    this.trackClick('failover-ips::edit::confirm');
    this.isLoading = true;

    return this.OvhApiCloudProjectIpFailover.v6()
      .attach(
        {
          serviceName: this.projectId,
          id: this.ip.id,
        },
        {
          instanceId: this.instance.id,
        },
      )
      .$promise.then(() => {
        this.ip.routedTo = this.instance.id;
        this.ip.instance = this.instance;
        this.CucCloudMessage.success(
          this.$translate.instant(
            'pci_additional_ips_failoverips_edit_success',
            {
              ip: this.ip.ip,
            },
          ),
          MESSAGES_CONTAINER_NAME,
        );
      })
      .catch(({ data }) => {
        this.CucCloudMessage.error(
          this.$translate.instant('pci_additional_ips_failoverips_edit_error', {
            error: data.message,
          }),
          MESSAGES_CONTAINER_NAME,
        );
      })
      .finally(() => {
        this.goBack();
        this.isLoading = false;
      });
  }
}
