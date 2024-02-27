import { DATASTORES_REQUIRED } from './dedicatedCloud-vmware-vdc-add.constants';

export default class VmwareVdcAddService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  canDeployNsxtEdges(serviceName) {
    return this.$http
      .get(
        `/dedicatedCloud/${serviceName}/canDeployNsxtEdgesOnGlobalDatastores`,
      )
      .then(({ data }) => data);
  }

  canDeployVsphere(serviceName) {
    return this.$http
      .get(`/dedicatedCloud/${serviceName}/filer`)
      .then(({ data }) => data?.length >= DATASTORES_REQUIRED);
  }
}
