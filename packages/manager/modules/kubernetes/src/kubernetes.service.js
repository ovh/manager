angular.module('managerApp').service('Kubernetes', class Kubernetes {
  constructor(
    $q, $translate,
    OvhApiCloudProject, OvhApiCloudProjectFlavor, OvhApiCloudProjectInstance,
    OvhApiKube, OvhApiCloudProjectQuota, SidebarMenu,
    KUBERNETES,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.OvhApiCloudProject = OvhApiCloudProject;
    this.OvhApiCloudProjectFlavor = OvhApiCloudProjectFlavor;
    this.OvhApiCloudProjectInstance = OvhApiCloudProjectInstance;
    this.OvhApiKube = OvhApiKube;
    this.OvhApiCloudProjectQuota = OvhApiCloudProjectQuota;
    this.SidebarMenu = SidebarMenu;
    this.KUBERNETES = KUBERNETES;
    this.initializeUpgradePolicies();
  }

  getKubernetesCluster(serviceName) {
    return this.OvhApiKube.v6().get({ serviceName }).$promise;
  }

  getKubernetesServiceInfos(serviceName) {
    return this.OvhApiKube.v6().getServiceInfos({ serviceName }).$promise;
  }

  getKubernetesConfig(serviceName) {
    return this.OvhApiKube.v6().getKubeConfig({ serviceName }).$promise;
  }

  getAssociatedPublicCloudProjects(serviceName) {
    return this.OvhApiKube.PublicCloud().Project().v6().query({ serviceName }).$promise;
  }

  getProject(projectId) {
    return this.OvhApiCloudProject.v6().get({ serviceName: projectId }).$promise;
  }

  getProjectQuota(serviceName) {
    return this.OvhApiCloudProjectQuota
      .v6()
      .query({ serviceName })
      .$promise;
  }

  getNodes(serviceName) {
    return this.OvhApiKube.PublicCloud().Node().v6().query({ serviceName }).$promise;
  }

  addNode(serviceName, name, flavorName) {
    return this.OvhApiKube.PublicCloud().Node().v6().save(
      { serviceName },
      { name, flavorName },
    ).$promise;
  }

  changeMenuTitle(serviceName, name) {
    const menuItem = this.SidebarMenu.getItemById(serviceName);
    if (menuItem) {
      menuItem.title = name;
    }
  }

  deleteNode(serviceName, nodeId) {
    return this.OvhApiKube.PublicCloud().Node().v6().delete({ serviceName, nodeId }).$promise;
  }

  isProcessing(status) {
    return this.KUBERNETES.processingStatus.includes(status);
  }

  resetNodesCache() {
    this.OvhApiKube.PublicCloud().Node().v6().resetCache();
    this.OvhApiKube.PublicCloud().Node().v6().resetQueryCache();
  }

  getFlavors(serviceName) {
    // Region is constant for now
    return this.OvhApiCloudProjectFlavor
      .v6()
      .query({ serviceName, region: this.KUBERNETES.region })
      .$promise;
  }

  getFlavorDetails(serviceName, flavorId) {
    return this.OvhApiCloudProjectFlavor.get({ serviceName, flavorId }).$promise;
  }

  formatFlavor(flavor) {
    return this.$translate.instant('kube_flavor', {
      name: flavor.name.toUpperCase(),
      cpuNumber: flavor.vcpus,
      ramCapacity: flavor.ram / 1000,
      diskCapacity: flavor.disk,
    });
  }

  resetCluster(serviceName, { workerNodesPolicy, version }) {
    return this.OvhApiKube.v6().reset({ serviceName }, {
      workerNodesPolicy,
      version,
    }).$promise;
  }

  resetClusterCache() {
    this.OvhApiKube.v6().resetCache();
  }

  updateKubernetes(serviceName, kubernetes) {
    return this.OvhApiKube.v6().update({ serviceName }, { name: kubernetes.name }).$promise
      .then((res) => {
        this.changeMenuTitle(serviceName, kubernetes.name);
        return res;
      });
  }

  updateKubernetesUpgradePolicy(serviceName, upgradePolicy) {
    return this.OvhApiKube.v6().updatePolicy(
      { serviceName },
      { updatePolicy: upgradePolicy },
    ).$promise;
  }

  getUpgradePolicies() {
    return this.upgradePolicies;
  }

  initializeUpgradePolicies() {
    const upgradePolicyEnum = _.indexBy(this.KUBERNETES.upgradePolicies);
    this.upgradePolicies = [
      {
        value: upgradePolicyEnum.ALWAYS_UPDATE,
        localizationKey: 'kube_service_upgrade_policy_ALWAYS_UPDATE',
        localizationDescriptionKey: 'kube_service_upgrade_policy_description_ALWAYS_UPDATE',
      },
      {
        value: upgradePolicyEnum.MINIMAL_DOWNTIME,
        localizationKey: 'kube_service_upgrade_policy_MINIMAL_DOWNTIME',
        localizationDescriptionKey: 'kube_service_upgrade_policy_description_MINIMAL_DOWNTIME',
      },
      {
        value: upgradePolicyEnum.NEVER_UPDATE,
        localizationKey: 'kube_service_upgrade_policy_NEVER_UPDATE',
        localizationDescriptionKey: 'kube_service_upgrade_policy_description_NEVER_UPDATE',
      },
    ];
  }

  getSchema() {
    return this.OvhApiKube.v6().getSchema().$promise;
  }

  updateKubernetesVersion(serviceName) {
    return this.OvhApiKube.v6().updateVersion({ serviceName }, {}).$promise
      .then((res) => {
        this.resetClusterCache();
        return res;
      });
  }
});
