export default class SiretService {
  /* @ngInject */
  constructor($http, $locale) {
    this.$http = $http;
    this.$locale = $locale;
  }

  getSiret(params) {
    return this.$http
      .get('/me/suggest/company', { params })
      .then(({ data }) => data)
      .catch((err) => {
        if (err?.status === 404) {
          return {
            error: false,
            searched: params.identifier,
            entryList: [],
          };
        }
        return {
          error: true,
          message: err?.data?.message,
        };
      });
  }

  dateFormat() {
    return this.$locale.DATETIME_FORMATS.shortDate
      .replace('dd', 'd')
      .replace('MM', 'm')
      .replace('y', 'Y');
  }
}
