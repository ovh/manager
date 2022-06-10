import get from 'lodash/get';

export default class {
  /* @ngInject */
  constructor(
    $translate,
    CucCloudMessage,
    OvhApiCloudProject,
    OvhApiVrack,
    PciPrivateNetworksVrackAdd,
  ) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.OvhApiCloudProject = OvhApiCloudProject;
    this.OvhApiVrack = OvhApiVrack;
    this.PciPrivateNetworksVrackAdd = PciPrivateNetworksVrackAdd;
  }

  $onInit() {
    this.isLoading = true;
    this.shouldCreateNewVrack = true;

    return this.getVracks()
      .catch((error) => {
        this.CucCloudMessage.error(
          this.$translate.instant(
            'pci_projects_project_network_private_vrack_create_init_error',
            {
              message: get(error, 'data.message', ''),
            },
          ),
          this.messageContainer,
        );
        this.goBack();
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  getVracks() {
    return this.OvhApiVrack.Aapi()
      .query()
      .$promise.then((vracks) => {
        this.vracks = vracks.map((vrack) => ({
          ...vrack,
          displayName: vrack.name || vrack.id,
        }));
      });
  }

  createVrack() {
    this.isLoading = true;
    return (this.shouldCreateNewVrack
      ? this.createNewVrack()
      : this.associateVrack()
    )
      .catch((error) => {
        this.CucCloudMessage.error(
          this.$translate.instant(
            'pci_projects_project_network_private_vrack_create_error',
            {
              message: get(error, 'data.message', ''),
            },
          ),
          this.messageContainer,
        );
        this.goBack();
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  createNewVrack() {
    return this.OvhApiCloudProject.v6()
      .createVrack({
        serviceName: this.projectId,
      })
      .$promise.then(({ id }) => this.onCreationSuccess(id));
  }

  associateVrack() {
    return this.PciPrivateNetworksVrackAdd.associateVrack(
      this.vrack.id,
      this.projectId,
    ).then(() => this.onAssociationSuccess());
  }
}
