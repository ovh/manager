import { SOFTPHONE_TYPE } from './softphone.constants';

export default class SofpthoneService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  generateLink(billingAccount, serviceName, name) {
    return this.$http
      .post(`/telephony/${billingAccount}/line/${serviceName}/devices`, {
        name,
        type: SOFTPHONE_TYPE,
      })
      .then(({ data: { deviceId } }) =>
        this.$http.post(
          `/telephony/${billingAccount}/line/${serviceName}/devices/${deviceId}/enroll`,
        ),
      )
      .then(({ data }) => data);
  }
}
