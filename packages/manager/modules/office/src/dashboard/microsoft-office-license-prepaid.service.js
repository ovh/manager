import { PREPAID_BASE_URL } from './microsoft-office-license.constants';

export default class MicrosoftOfficeLicensePrepaidService {
  /* @ngInject */
  constructor($http, OvhHttp) {
    this.$http = $http;
    this.ovhHttp = OvhHttp;
  }

  get(serviceName) {
    return this.$http.get(`${PREPAID_BASE_URL}/${serviceName}/parentTenant`);
  }

  edit(serviceName, { displayName }) {
    return this.$http.put(`${PREPAID_BASE_URL}/${serviceName}/parentTenant`, {
      displayName,
    });
  }

  getUsers(tenant) {
    return this.$http
      .get(PREPAID_BASE_URL)
      .then((response) =>
        response.data?.filter((service) => service.startsWith(`${tenant}-`)),
      );
  }

  getUserDetails(userId) {
    return this.$http
      .get(`${PREPAID_BASE_URL}/${userId}`)
      .then(({ data }) => data);
  }

  getUsage({ serviceName, from, to }) {
    return this.$http.get(
      `${PREPAID_BASE_URL}/${serviceName}/tenantUsageStatistics`,
      {
        params: {
          from,
          to,
        },
      },
    );
  }

  getServiceInfos(licenseId) {
    return this.ovhHttp.get(
      '/license/officePrepaid/{serviceName}/serviceInfos',
      {
        rootPath: 'apiv6',
        urlParams: {
          serviceName: licenseId,
        },
        cache: 'office.license.serviceinfos',
      },
    );
  }

  deleteUser(serviceName) {
    return this.$http.post(`${PREPAID_BASE_URL}/${serviceName}/unconfigure`);
  }

  updateUser(serviceName, data) {
    return this.$http.put(`${PREPAID_BASE_URL}/${serviceName}`, data);
  }

  updatePassword(licenseId, data) {
    return this.$http.post(
      `${PREPAID_BASE_URL}/${licenseId}/changePassword`,
      data,
    );
  }
}
