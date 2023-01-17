import find from 'lodash/find';

const MESSAGES_CONTAINER_NAME = 'pci.projects.project.additional-ips';

export default class AdditionalIpsFloatingIpsEditController {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    PciProjectAdditionalIpService,
    CucCloudMessage,
    PciProjectsProjectInstanceService,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.PciProjectAdditionalIpService = PciProjectAdditionalIpService;
    this.CucCloudMessage = CucCloudMessage;
    this.PciProjectsProjectInstanceService = PciProjectsProjectInstanceService;
  }

  $onInit() {
    this.gateway = null;
    this.loadInstances();
  }

  static getPrivateNetworkIdFromGateway(privateNetworks, gatewayId) {
    const { id: privateNetworkId } = privateNetworks.find((privateNetwork) =>
      privateNetwork.regions?.find(
        ({ openstackId }) => openstackId === gatewayId,
      ),
    );
    return privateNetworkId;
  }

  loadInstances() {
    this.isLoading = true;
    this.$q
      .all({
        instances: this.PciProjectsProjectInstanceService.getAllInstanceDetails(
          this.projectId,
        ),
        privateNetworks: this.PciProjectAdditionalIpService.getPrivateNetworks(
          this.projectId,
        ),
        associatedInstances: this.PciProjectAdditionalIpService.getAssociatedInstance(
          this.projectId,
          this.ip.region,
        ),
      })
      .then(({ instances, privateNetworks, associatedInstances }) => {
        const associatedInstance = associatedInstances?.map(
          ({ associatedEntity }) => {
            return associatedEntity?.id ? associatedEntity?.id : null;
          },
        );
        this.instances = instances.filter(
          (instance) =>
            !instance.ipAddresses.some(
              (ipAddress) => ipAddress.type !== 'private',
            ),
        );
        this.instances = associatedInstance
          ? this.instances.filter(
              (instance) => !associatedInstance.includes(instance.id),
            )
          : this.instances;
        this.privateNetworks = privateNetworks;
        if (!this.ip?.associatedEntity?.gatewayId) {
          this.instances = this.instances.filter(
            (instance) => instance.region === this.ip.region,
          );
          this.setDefaultInstance();
          this.privateNetwork = this.instance?.ipAddresses[0];
          this.privateNetworks = [this.privateNetwork];
          this.isLoading = false;
        } else {
          this.loadInstanceToEdit();
        }
      });
  }

  loadInstanceToEdit() {
    this.isLoading = true;
    this.PciProjectAdditionalIpService.getGatewayDetails(
      this.projectId,
      this.ip.region,
      this.ip.associatedEntity.gatewayId,
    ).then((gateway) => {
      const privateNetworkId = AdditionalIpsFloatingIpsEditController.getPrivateNetworkIdFromGateway(
        this.privateNetworks,
        gateway.interfaces[0]?.networkId,
      );
      // instance must be attached to private network only and must be present in the same private network as Floating IP
      this.instances = this.instances.filter((instance) =>
        instance.ipAddresses.find(
          (ipAddress) => ipAddress.networkId === privateNetworkId,
        ),
      );
      if (this.instances.length > 0) {
        this.setDefaultInstance();
        this.loadPrivateNetworks(this.instance);
        this.setDefaultPrivateNetwork();
      } else {
        this.instance = null;
      }
      this.isLoading = false;
    });
  }

  setDefaultInstance() {
    [this.instance] = this.instances ? this.instances : null;

    if (!this.instance && this.ip && this.ip.routedTo) {
      this.instance = find(this.instances, { id: this.ip.routedTo });
    }
  }

  setDefaultPrivateNetwork() {
    const [firstInstance] = this.instances;
    this.privateNetwork = this.privateNetworks?.find(
      (privateNetwork) =>
        privateNetwork.ip === firstInstance?.ipAddresses[0]?.ip,
    );
  }

  loadPrivateNetworks(instance) {
    this.privateNetworks = instance?.ipAddresses.filter(
      (ipAddress) => ipAddress.type === 'private',
    );
    [this.privateNetwork] = this.privateNetworks ? this.privateNetworks : [];
  }

  onCancelClick() {
    this.trackClick('floating-ips::edit::cancel');
    return this.goBack();
  }

  edit() {
    this.trackClick('floating-ips::edit::confirm');
    this.isLoading = true;
    return this.PciProjectAdditionalIpService.updateInstanceForFloatingIp(
      this.projectId,
      this.ip,
      this.instance.id,
      this.serviceName,
      this.privateNetwork?.ip,
      this.gateway,
    )
      .then(() => {
        this.ip.routedTo = this.instance.id;
        this.ip.instance = this.instance;
        this.CucCloudMessage.success(
          this.$translate.instant(
            'pci_additional_ips_floatingips_edit_success',
            {
              ip: this.ip.ip,
            },
          ),
          MESSAGES_CONTAINER_NAME,
        );
      })
      .catch(({ data }) => {
        this.CucCloudMessage.error(
          this.$translate.instant('pci_additional_ips_floatingips_edit_error', {
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
