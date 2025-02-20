import {
  MANUAL_RENEWAL_TYPES,
  CONTRACTS_IDS,
} from './auto-renew-service-modal.constants';

export default class AutoRenewServiceModalService {
  /* @ngInject */
  constructor(
    $http,
    $translate,
    DucUserContractService,
    OvhApiBillingAutorenewServices,
    $q,
  ) {
    this.$http = $http;
    this.$translate = $translate;
    this.DucUserContractService = DucUserContractService;
    this.OvhApiBillingAutorenewServices = OvhApiBillingAutorenewServices;
    this.$q = $q;
  }

  getAvailableRenewPeriods(serviceUrl) {
    return this.$http
      .get(`${serviceUrl}/serviceInfos`)
      .then(({ data }) => [MANUAL_RENEWAL_TYPES, ...data.possibleRenewPeriod])
      .then((periodes) =>
        periodes.map((period) => ({
          period,
          label: this.getPeriodTranslation(period),
        })),
      );
  }

  updateRenew(service, agreements) {
    const agreementsPromise = service.hasAutomaticRenew()
      ? this.DucUserContractService.acceptAgreements(agreements)
      : Promise.resolve([]);

    return agreementsPromise.then(() => {
      const toUpdate = {
        serviceId: service.serviceId,
        serviceType: service.serviceType,
        renew: service.renew,
      };
      toUpdate.route = service.route ? service.route.url : undefined;
      return this.updateServices([toUpdate]);
    });
  }

  getAutorenewAgreements() {
    return this.DucUserContractService.getAgreementsToValidate(
      ({ contractId }) => Object.values(CONTRACTS_IDS).includes(contractId),
    ).then((contracts) =>
      contracts.map(({ code: name, pdf: url, id }) => ({ name, url, id })),
    );
  }

  updateServices(updateList) {
    return this.OvhApiBillingAutorenewServices.Aapi()
      .put({}, { updateList })
      .$promise.then((result) => {
        if (result.state === 'OK') {
          return result;
        }
        return this.$q.reject({ ...result, state: 'ERROR' });
      });
  }

  getPeriodTranslation(months) {
    if (months === MANUAL_RENEWAL_TYPES) {
      return this.$translate.instant(
        'autorenew_service_update_modal_period_manual',
      );
    }
    if (months === 1) {
      return this.$translate.instant(
        'autorenew_service_update_modal_period_every_month',
      );
    }
    if (months === 12) {
      return this.$translate.instant(
        'autorenew_service_update_modal_period_every_year',
      );
    }
    if (months === 24) {
      return this.$translate.instant(
        'autorenew_service_update_modal_period_every_two_years',
      );
    }
    return this.$translate.instant(
      'autorenew_service_update_modal_period_every_x_months',
      { months },
    );
  }
}
