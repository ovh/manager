export default class TelecomTelephonyAliasPortabilitiesService {
  /* @ngInject */
  constructor($http, $q, iceberg) {
    this.$http = $http;
    this.$q = $q;
    this.iceberg = iceberg;
  }

  fetchPortability(billingAccount) {
    return this.iceberg(`/telephony/${billingAccount}/portability`)
      .query()
      .expand('CachedObjectList-Pages')
      .sort('creationDate', 'ASC')
      .execute()
      .$promise.then(({ data: portabilities }) => {
        return this.$q.all(
          portabilities.map((porta) => {
            return this.$q
              .all({
                steps: this.portabilityStatus(billingAccount, porta.id),
                canBeCancelled: this.canBeCancelled(billingAccount, porta.id),
                documentAttached: this.documentAttached(
                  billingAccount,
                  porta.id,
                ),
                changeRequired: porta.error
                  ? this.changeRequired(billingAccount, porta.id)
                  : false,
              })
              .then((results) => {
                return { ...porta, ...results };
              });
          }),
        );
      });
  }

  portabilityStatus(billingAccount, id) {
    return this.$http
      .get(`/telephony/${billingAccount}/portability/${id}/status`)
      .then(({ data }) => data);
  }

  canBeCancelled(billingAccount, id) {
    return this.$http
      .get(`/telephony/${billingAccount}/portability/${id}/canBeCancelled`)
      .then(({ data }) => data);
  }

  cancelPortability(billingAccount, id) {
    return this.$http
      .post(`/telephony/${billingAccount}/portability/${id}/cancel`)
      .then(({ data }) => data)
      .catch((error) => this.$q.reject(error));
  }

  documentAttached(billingAccount, id) {
    return this.$http
      .get(`/telephony/${billingAccount}/portability/${id}/document`)
      .then(({ data }) => {
        if (data.length > 0) {
          return this.$q.all(
            data.map((documentId) =>
              this.$http
                .get(
                  `/telephony/${billingAccount}/portability/${id}/document/${documentId}`,
                )
                .then(({ data: documents }) => documents),
            ),
          );
        }
        return null;
      });
  }

  changeRequired(billingAccount, id) {
    return this.$http
      .get(`/telephony/${billingAccount}/portability/${id}/relaunch`)
      .then(({ data }) => data);
  }
}
