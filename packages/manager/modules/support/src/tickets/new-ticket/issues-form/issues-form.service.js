export default class {
  /* @ngInject */
  constructor(
    $translate,
    OvhApiService,
    OvhApiSupport,
  ) {
    this.$translate = $translate;
    this.OvhApiService = OvhApiService;
    this.OvhApiSupport = OvhApiSupport;
  }

  getServices(route) {
    return this.OvhApiService.Aapi()
      .query({
        type: route,
        external: false,
      }).$promise;
  }

  getServiceTypesRaw() {
    return this.OvhApiSupport.v6()
      .getServiceTypes().$promise;
  }

  getServiceTypes() {
    return this
      .getServiceTypesRaw()
      .then(serviceTypes => [...serviceTypes]
        .map(serviceType => ({
          ...serviceType,
          label: this.$translate.instant(`ovhManagerSupport_new_serviceType_${serviceType.name}`),
        }))
        .sort((a, b) => a.label.localeCompare(b.label, 'en', { sensitivity: 'base' })));
  }
}
