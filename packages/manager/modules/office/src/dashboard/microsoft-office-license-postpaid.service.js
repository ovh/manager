import { POSTPAID_BASE_URL } from './microsoft-office-license.constants';

export default class MicrosoftOfficeLicensePostpaidService {
  /* @ngInject */
  constructor($http, OvhHttp) {
    this.$http = $http;
    this.ovhHttp = OvhHttp;
  }

  get(serviceName) {
    return this.$http.get(`${POSTPAID_BASE_URL}/${serviceName}`);
  }

  edit(serviceName, tenantObj) {
    return this.$http.put(`${POSTPAID_BASE_URL}/${serviceName}`, tenantObj);
  }

  getUsers(serviceName) {
    return this.$http
      .get(`${POSTPAID_BASE_URL}/${serviceName}/user`)
      .then(({ data }) => data);
  }

  getUserDetails(licenseId, userId) {
    return this.$http
      .get(`${POSTPAID_BASE_URL}/${licenseId}/user/${userId}`)
      .then(({ data }) => ({ ...data, serviceName: licenseId }));
  }

  getUsage({ serviceName, from, to }) {
    return this.$http.get(
      `${POSTPAID_BASE_URL}/${serviceName}/usageStatistics`,
      {
        params: {
          from,
          to,
        },
      },
    );
  }

  getServiceInfos(licenseId) {
    return this.ovhHttp.get('/license/office/{serviceName}/serviceInfos', {
      rootPath: 'apiv6',
      urlParams: {
        serviceName: licenseId,
      },
      cache: 'office.license.serviceinfos',
    });
  }

  deleteUser(licenseId, userId) {
    return this.$http.delete(
      `${POSTPAID_BASE_URL}/${licenseId}/user/${userId}`,
    );
  }

  updateUser(serviceName, activationEmail, data) {
    return this.$http.put(
      `${POSTPAID_BASE_URL}/${serviceName}/user/${activationEmail}`,
      data,
    );
  }

  updatePassword(licenseId, activationEmail, data) {
    return this.$http.post(
      `${POSTPAID_BASE_URL}/${licenseId}/user/${activationEmail}/changePassword`,
      data,
    );
  }
}
