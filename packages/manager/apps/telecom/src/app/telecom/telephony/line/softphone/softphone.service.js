import { SOFTPHONE_TYPE } from './softphone.constants';

export default class SofpthoneService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  modifyDevice(billingAccount, serviceName, name, deviceId) {
    return this.$http
      .put(
        `/telephony/${billingAccount}/line/${serviceName}/devices/${deviceId}`,
        {
          name,
        },
      )
      .then(({ data }) => data);
  }

  createDevice(billingAccount, serviceName, name) {
    return this.$http
      .post(`/telephony/${billingAccount}/line/${serviceName}/devices`, {
        name,
        type: SOFTPHONE_TYPE,
      })
      .then(({ data }) => data);
  }

  enroll(billingAccount, serviceName, deviceId) {
    return this.$http
      .post(
        `/telephony/${billingAccount}/line/${serviceName}/devices/${deviceId}/enroll`,
      )
      .then(({ data }) => data);
  }
}
