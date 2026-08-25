export default class HostingSpoofingUnblockService {
  /* @ngInject */
  constructor($q, Apiv2Service) {
    this.$q = $q;
    this.Apiv2Service = Apiv2Service;
  }

  /**
   * Delete every spoofed sender domain (resolve the anomaly)
   * @param {string} serviceName
   * @param {string[]} senderDomains
   */
  deleteSpoofing(serviceName, senderDomains) {
    return this.$q.all(
      (senderDomains || []).map((senderDomain) =>
        this.Apiv2Service.httpApiv2({
          method: 'delete',
          url: `/engine/api/v2/webhosting/resource/${serviceName}/spoofing/${senderDomain}`,
        }),
      ),
    );
  }
}
