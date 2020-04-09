export default class {
  /* @ngInject */
  constructor($http, $q, OvhHttp) {
    this.$http = $http;
    this.$q = $q;
    this.OvhHttp = OvhHttp;

    this.swsProxypassPath = 'apiv6';
  }

  getIpOrganisation() {
    return this.$http
      .get([this.swsProxypassPath, 'me/ipOrganisation'].join('/'))
      .then((data) => {
        const queue = [];
        const organisations = [];
        angular.forEach(data.data, (orgId) => {
          queue.push(
            this.getIpOrganisationDetails(orgId).then((data2) => {
              organisations.push(data2);
            }),
          );
        });
        return this.$q.all(queue).then(
          () => organisations,
          (http) => this.$q.reject(http.data),
        );
      })
      .catch((http) => this.$q.reject(http.data));
  }

  getIpOrganisationDetails(orgId) {
    return this.$http
      .get([this.swsProxypassPath, 'me/ipOrganisation', orgId].join('/'))
      .then((data) => data.data);
  }

  getAccountRegexp(country, ovhSubsidiary) {
    return this.$http
      .get([this.swsProxypassPath, 'newAccount/creationRules'].join('/'), {
        params: {
          country,
          legalform: 'individual',
          ovhCompany: 'ovh',
          ovhSubsidiary,
        },
      })
      .then((data) => data.data)
      .catch((http) => this.$q.reject(http.data));
  }

  postOrganisation(params) {
    return this.$http
      .post([this.swsProxypassPath, 'me/ipOrganisation'].join('/'), params)
      .then((data) => data.data)
      .catch((http) => this.$q.reject(http.data));
  }

  putOrganisation(params) {
    const paramsToSend = angular.copy(params);
    delete paramsToSend.organisationId;
    return this.$http
      .put(
        [
          this.swsProxypassPath,
          `me/ipOrganisation/${params.organisationId}`,
        ].join('/'),
        params,
      )
      .then((data) => data.data)
      .catch((http) => this.$q.reject(http.data));
  }

  changeOrganisation(params) {
    return this.OvhHttp.post('/ip/{ip}/changeOrg', {
      rootPath: 'apiv6',
      urlParams: {
        ip: params.ipBlock,
      },
      data: {
        organisation: params.organisationId,
      },
    });
  }
}
