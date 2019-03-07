import get from 'lodash/get';

export default class CloudProjectOpenstackUsersRcloneModalCtrl {
  /* @ngInject */
  constructor(
    $stateParams,
    $uibModalInstance,
    CloudProjectOpenstackUsersRcloneService,
    CucControllerHelper,
    openstackUser,
    PCI_URLS,
  ) {
    this.$stateParams = $stateParams;
    this.$uibModalInstance = $uibModalInstance;
    this.CloudProjectOpenstackUsersRcloneService = CloudProjectOpenstackUsersRcloneService;
    this.CucControllerHelper = CucControllerHelper;
    this.openstackUser = openstackUser;
    this.PCI_URLS = PCI_URLS;

    this.projectId = $stateParams.projectId;

    this.model = {
      region: {
        value: undefined,
        required: true,
      },
    };

    this.initLoaders();
  }

  $onInit() {
    this.regions.load()
      .then(() => {
        if (this.regions.data.length === 1) {
          this.model.region.value = this.regions.data[0].microRegion.code;
        }
      });
    this.rCloneFileGuide.load();
  }

  confirm() {
    return this.CloudProjectOpenstackUsersRcloneService
      .getRcloneFileInfo(this.projectId, this.openstackUser.id, this.model.region.value)
      .then((response) => {
        this.CucControllerHelper.constructor.downloadContent({
          fileContent: response.content,
          fileName: 'rclone.sh',
        });
      })
      .finally(() => this.$uibModalInstance.close());
  }

  cancel() {
    this.$uibModalInstance.dismiss();
  }

  isModalLoading() {
    return this.regions.loading || this.rCloneFileGuide.loading;
  }

  initLoaders() {
    this.regions = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () => this.CloudProjectOpenstackUsersRcloneService
        .getValidRcloneRegions(this.projectId)
        .catch(error => this.cancel(error)),
    });

    this.rCloneFileGuide = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () => this.CucControllerHelper.navigation.getConstant(get(this.PCI_URLS, 'guides.rCloneFile', ''))
        .catch(error => this.cancel(error)),
    });
  }
}
