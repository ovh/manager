export default class InstanceAdvicesCtrl {
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
    return this.OvhHttp.get('/advices/instance/{serviceName}', {
      rootPath: '2api',
      urlParams: {
        serviceName: this.instanceId,
      },
    })
      .then((res) => res.data.adviceGroups)
      .catch(() => []); // do not show any advices on error
  }
}
