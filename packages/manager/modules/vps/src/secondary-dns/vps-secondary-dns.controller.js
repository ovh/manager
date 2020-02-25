import map from 'lodash/map';

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
            ...data.list,
            results: map(data.list.results, (secondaryDns) => ({
              ...secondaryDns,
              creationDateLabel: moment(secondaryDns.creationDate).format('LL'),
            })),
          },
        };
        return data.list.results;
      })
      .catch((err) => this.CucCloudMessage.error(err));
  }
}
