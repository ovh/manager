export default class TelecomSearchResultsService {
  /* @ngInject */
  constructor($http, $q, OvhApiTelephony) {
    this.$http = $http;
    this.OvhApiTelephony = OvhApiTelephony;
    this.$q = $q;
  }

  findTelephonyService(axiom) {
    return this.$http
      .get(`/telephony/searchServices?axiom=${axiom}`)
      .then(({ data }) => {
        if (data) {
          return this.$q.all(
            data.map((item) => {
              const { billingAccount, domain } = item;
              return this.OvhApiTelephony.Service()
                .v6()
                .get({
                  billingAccount,
                  serviceName:
                    domain.indexOf('-') !== -1 // If there is a range of numbers we take only the first one.
                      ? domain.slice(0, domain.indexOf('-'))
                      : domain,
                })
                .$promise.then((result) => {
                  return { value: result, billingAccount };
                });
            }),
          );
        }
        return null;
      })
      .catch(() => null);
  }
}
