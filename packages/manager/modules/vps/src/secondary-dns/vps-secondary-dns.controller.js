import 'moment';

export default class {
  /* @ngInject */
  constructor($stateParams, CucCloudMessage, VpsService) {
    this.serviceName = $stateParams.serviceName;
    this.CucCloudMessage = CucCloudMessage;
    this.VpsService = VpsService;

    this.loaders = {
      init: true,
    };
    this.secondaryDns = [undefined];
  }

  $onInit() {
    this.refreshSecondaryDnsList();
  }

  refreshSecondaryDnsList() {
    this.loaders.init = true;
    this.loadSecondaryDns().finally(() => {
      this.loaders.init = false;
    });
  }

  loadSecondaryDns() {
    return this.VpsService.getTabSecondaryDns(this.serviceName)
      .then((data) => {
        this.secondaryDns = {
          ...data,
          list: {
            ...data,
            results: data.map((secondaryDns) => ({
              ...secondaryDns,
              creationDateLabel: moment(secondaryDns.creationDate).format('LL'),
            })),
          },
        };
        return data;
      })
      .catch((err) => this.CucCloudMessage.error(err));
  }
}
