import map from 'lodash/map';
import set from 'lodash/set';

export default class ContactService {
  /* @ngInject */
  constructor($http, $q) {
    this.$http = $http;
    this.$q = $q;
  }

  getDirectory(billingAccount, serviceName) {
    return this.$http
      .get(`/telephony/${billingAccount}/service/${serviceName}/directory`)
      .then(({ data }) => data)
      .catch(({ data }) => this.$q.reject(data.message));
  }

  putDirectory(billingAccount, serviceName, params) {
    return this.$http
      .put(
        `/telephony/${billingAccount}/service/${serviceName}/directory`,
        params,
      )
      .then(({ data }) => data)
      .catch(({ data }) => this.$q.reject(data.message));
  }

  fetchEntrepriseInformations(billingAccount, serviceName, entrepriseNumber) {
    return this.$http
      .post(
        `/telephony/${billingAccount}/service/${serviceName}/directory/fetchEntrepriseInformations`,
        {
          entrepriseNumber,
        },
      )
      .then(({ data }) => data)
      .catch(() => null);
  }

  fetchDirectoryServiceCode(billingAccount, serviceName, apeCode) {
    return this.$http
      .get(
        `/telephony/${billingAccount}/service/${serviceName}/directory/getDirectoryServiceCode`,
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
