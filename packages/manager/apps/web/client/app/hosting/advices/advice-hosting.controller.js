export default class HostingAdvicesCtrl {
  /* @ngInject */
  constructor(OvhHttp) {
    this.OvhHttp = OvhHttp;
  }

  $onInit() {
    this.loading = true;
    this.adviceGroups = [];
    this.loadAdvices()
      .then((adviceGroups) => {
        this.adviceGroups = adviceGroups;
      })
      .finally(() => {
        this.loading = false;
      });
  }

  loadAdvices() {
    return this.OvhHttp.get('/advices/hosting-web/{serviceName}', {
      rootPath: '2api',
      urlParams: {
        serviceName: this.hosting.serviceName,
      },
    })
      .then((res) => res.data.adviceGroups)
      .catch(() => []); // do not show any advices on error
  }
}
