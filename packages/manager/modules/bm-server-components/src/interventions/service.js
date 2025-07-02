export default class BMServerIntervention {
  /* @ngInject */
  constructor(icebergUtils) {
    this.icebergUtils = icebergUtils;
  }

  fetchInterventions(serviceName, params) {
    return this.icebergUtils.icebergQuery(
      `/dedicated/server/${serviceName}/intervention`,
      params,
    );
  }
}
