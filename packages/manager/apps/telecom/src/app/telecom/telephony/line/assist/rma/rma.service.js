import { MAC_ADDRESS_FORMAT_REGEX, RMA_URL_PREFIX } from './rma.constants';

export default class TelecomTelephonyLineAssistRmaService {
  /* @ngInject */
  constructor($http, $q) {
    this.$http = $http;
    this.$q = $q;
    this.MAC_ADDRESS_FORMAT_REGEX = MAC_ADDRESS_FORMAT_REGEX;
    this.RMA_URL_PREFIX = RMA_URL_PREFIX;
  }

  fetchRma(billingAccount, serviceName) {
    return this.$http
      .get(`/telephony/${billingAccount}/line/${serviceName}/phone/rma`)
      .catch((error) => {
        if (error.status === 404) {
          // line has no phone
          return [];
        }
        return this.$q.reject(error);
      })
      .then(({ data: rmaIds }) =>
        this.$q.all(
          rmaIds.map((id) =>
            this.$http
              .get(
                `/telephony/${billingAccount}/line/${serviceName}/phone/rma/${id}`,
              )
              .then(({ data }) => data)
              .catch((error) => error),
          ),
        ),
      )
      .then((rmaList) =>
        rmaList.map((rma) => {
          return {
            ...rma,
            equipmentReference: this.formatEquipementReference(rma),
            url: this.getPdfUrl(rma),
          };
        }),
      );
  }

  formatEquipementReference(rma) {
    // example : 'AB12345' => 'AB:12:34:5'
    return (
      (rma.equipmentReference || '').match(this.MAC_ADDRESS_FORMAT_REGEX) || []
    ).join(':');
  }

  getPdfUrl(rma) {
    return `${this.RMA_URL_PREFIX}${rma.id}`;
  }

  cancelRma(billingAccount, serviceName, rma) {
    return this.$http
      .delete(
        `/telephony/${billingAccount}/line/${serviceName}/phone/rma/${rma.id}`,
      )
      .then(() => this.$q.resolve())
      .catch((err) => this.$q.reject(err));
  }

  changeType(billingAccount, serviceName, rma, newType) {
    return this.$http.post(
      `/telephony/${billingAccount}/line/${serviceName}/phone/rma/${rma.id}/changeType`,
      {
        type: newType,
      },
    );
  }
}
