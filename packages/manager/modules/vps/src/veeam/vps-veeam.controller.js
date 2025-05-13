import has from 'lodash/has';
import 'moment';

export default class {
  /* @ngInject */
  constructor(
    $scope,
    $stateParams,
    $translate,
    CucCloudMessage,
    CucControllerHelper,
    VpsService,
  ) {
    this.$scope = $scope;
    this.serviceName = $stateParams.serviceName;
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.CucControllerHelper = CucControllerHelper;
    this.serviceName = $stateParams.serviceName;
    this.VpsService = VpsService;

    this.loaders = {
      init: false,
      checkOrder: false,
      polling: false,
      veeamTab: false,
    };

    this.vps = {
      hasVeeam: false,
      canOrder: false,
    };
  }

  initLoaders() {
    this.veeam = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.VpsService.getVeeam(this.serviceName).then((data) => {
          if (has(data, 'accessInfos.restorePoint')) {
            return {
              ...data,
              accessInfos: {
                ...data.accessInfos,
                restorePointLabel: moment(data.accessInfos.restorePoint).format(
                  'LLL',
                ),
              },
            };
          }
          return data;
        }),
    });
    this.veeamTab = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () =>
        this.VpsService.getTabVeeam(this.serviceName, 'available', true).then(
          (data) =>
            data.map((date) => ({
              id: date,
              creationDate: moment(date)
                .utc()
                .format('LLL'),
            })),
        ),
    });
    this.vps = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () => this.VpsService.getSelectedVps(this.serviceName),
    });
  }

  load() {
    this.veeam.load().then(() => {
      if (this.veeam.data.state !== 'disabled') {
        this.veeamTab.load();
        this.loadRestorePoint();
      } else {
        this.vps.load();
      }
    });
  }

  $onInit() {
    this.initLoaders();
    this.load();
    this.$scope.$on('tasks.pending', (event, opt) => {
      if (opt === this.serviceName) {
        this.loaders.polling = true;
      }
    });
    this.$scope.$on('tasks.success', (event, opt) => {
      if (opt === this.serviceName) {
        this.loaders.polling = false;
        this.load();
      }
    });
  }

  loadRestorePoint() {
    this.veeamTab.loading = true;
    this.VpsService.getTabVeeam(this.serviceName, 'restoring', false)
      .then((data) => {
        if (data.length) {
          this.veeam.data.state = 'MOUNTING';
        }
      })
      .catch((err) => this.CucCloudMessage.error(err))
      .finally(() => {
        this.veeamTab.loading = false;
      });
  }

  isValidToSchedule() {
    return (
      this.vpsDetails.isValidVersionToRescheduleAutomatedBackup &&
      this.hasAutomatedBackupOption
    );
  }
}
