angular.module('managerApp').controller('KubernetesNodesAddCtrl', class KubernetesNodesAddCtrl {
  constructor(
    $q, $state, $stateParams, $translate, $uibModalInstance,
    CloudFlavorService, Kubernetes, OvhApiMe, OvhCloudPriceHelper, projectId,
    CLOUD_FLAVORTYPE_CATEGORY, KUBERNETES,
  ) {
    this.$q = $q;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.$uibModalInstance = $uibModalInstance;
    this.CloudFlavorService = CloudFlavorService;
    this.Kubernetes = Kubernetes;
    this.OvhApiMe = OvhApiMe;
    this.OvhCloudPriceHelper = OvhCloudPriceHelper;
    this.projectId = projectId;
    this.CLOUD_FLAVORTYPE_CATEGORY = CLOUD_FLAVORTYPE_CATEGORY;
    this.KUBERNETES = KUBERNETES;
  }

  $onInit() {
    this.loading = true;
    this.serviceName = this.$stateParams.serviceName;

    this.getPublicCloudProject()
      .then(() => this.$q.all({
        quotas: this.getProjectQuota(),
        prices: this.getPrices(),
      }))
      .then(({ quotas, prices }) => this.getFlavors(quotas, prices))
      .catch(error => this.$uibModalInstance.dismiss(this.$translate.instant('kube_nodes_add_flavor_error', { message: _.get(error, 'data.message', '') })))
      .finally(() => { this.loading = false; });
  }

  getPublicCloudProject() {
    return this.Kubernetes.getAssociatedPublicCloudProjects(this.serviceName)
      .then((project) => { this.project = project; });
  }

  getProjectQuota() {
    return this.Kubernetes.getProjectQuota(this.project.projectId);
  }

  getFlavors(quotas, prices) {
    return this.Kubernetes.getFlavors(this.projectId)
      .then((flavors) => {
        /**
        * @type {{id: string, familyName: string, flavors: Object[]}}
        */
        this.flavorFamilies = this.CLOUD_FLAVORTYPE_CATEGORY
          .filter(type => _.includes(this.KUBERNETES.flavorTypes, type.id))
          .map(category => (
            {
              id: category.id,
              familyName: this.$translate.instant(`kube_nodes_add_flavor_family_${category.id}`),
              flavors: flavors
                .filter(flavor => _.includes(category.types, flavor.type) && flavor.osType !== 'windows')
                .map(flavor => ({
                  name: flavor.name,
                  displayedName: this.Kubernetes.formatFlavor(flavor),
                  quotaOverflow: this.getQuotaOverflow(flavor, quotas),
                  price: _.get(_.get(prices, flavor.planCodes.hourly), 'price.text'),
                })),
            }));
        return flavors;
      });
  }

  getSubsidiary() {
    return this.OvhApiMe.v6().get().then(({ subsidiary }) => { this.subsidiary = subsidiary; });
  }

  getPrices() {
    return this.OvhCloudPriceHelper.getPrices(this.project.projectId);
  }

  getQuotaOverflow(flavor, quotas) {
    // addOverQuotaInfos adds 'disabled' key to flavor parameter
    const testedFlavor = _.clone(flavor);
    this.CloudFlavorService.constructor.addOverQuotaInfos(testedFlavor, quotas);
    return _.get(testedFlavor, 'disabled');
  }

  onFlavorFamilyChange(selectedFamily) {
    this.selectedFlavor = null;
    this.flavors = _.find(this.flavorFamilies, family => family.id === selectedFamily.id).flavors;
  }

  addNode() {
    this.loading = true;
    return this.Kubernetes.addNode(this.serviceName, this.nodeName, this.selectedFlavor.name)
      .then(() => this.$uibModalInstance.close())
      .catch(error => this.$uibModalInstance.dismiss(this.$translate.instant('kube_nodes_add_error', { message: _.get(error, 'data.message', '') })))
      .finally(() => { this.loading = false; });
  }

  instanceIsValid() {
    return !this.selectedFlavor.quotaOverflow;
  }

  dismiss(error) {
    this.$uibModalInstance.dismiss(error);
  }

  goToProjectQuota() {
    this.$uibModalInstance.close();
    this.$state.go('iaas.pci-project.compute.quota', { projectId: this.project.projectId });
  }
});
