import map from 'lodash/map';
import set from 'lodash/set';

export default class {
  /* @ngInject */
  constructor($http, $q, $stateParams) {
    this.$http = $http;
    this.$q = $q;
    this.$stateParams = $stateParams;
  }

  getDirectory() {
    return this.$http
      .get(
        `/telephony/${this.$stateParams.billingAccount}/service/${this.$stateParams.serviceName}/directory`,
      )
      .then(({ data }) => data)
      .catch(({ data }) => this.$q.reject(data.message));
  }

  putDirectory(params) {
    return this.$http
      .put(
        `/telephony/${this.$stateParams.billingAccount}/service/${this.$stateParams.serviceName}/directory`,
        params,
      )
      .then(({ data }) => data)
      .catch(({ data }) => this.$q.reject(data.message));
  }

  fetchEntrepriseInformations(entrepriseNumber) {
    return this.$http
      .post(
        `/telephony/${this.$stateParams.billingAccount}/service/${this.$stateParams.serviceName}/directory/fetchEntrepriseInformations`,
        {
          entrepriseNumber,
        },
      )
      .then(({ data }) => {
        return data;
      })
      .catch(() => null);
  }

  fetchDirectoryServiceCode(apeCode) {
    return this.$http
      .get(
        `/telephony/${this.$stateParams.billingAccount}/service/${this.$stateParams.serviceName}/directory/getDirectoryServiceCode`,
        {
          params: {
            apeCode,
          },
        },
      )
      .then(({ data }) => {
        return map(data, (info) => {
          set(
            info,
            'directoryServiceCode',
            `${info.directoryServiceCode || ''}`,
          );
          return info;
        });
      });
  }

  getPostCodeAvailable(number, country) {
    return this.$http
      .get('/telephony/directories/availableZipCodes', {
        params: {
          country,
          number,
        },
      })
      .then(({ data }) => data)
      .catch(() => null);
  }

  getCityAvailable(zipCode, country) {
    return this.$http
      .get('/telephony/directories/cities', {
        params: {
          country,
          zipCode,
        },
      })
      .then(({ data }) => data)
      .catch(() => null);
  }

  getStreetsAvailable(inseeCode) {
    return this.$http
      .post('/connectivity/eligibility/search/streets', {
        inseeCode,
      })
      .then(({ data }) => data)
      .catch(() => null);
  }
}
