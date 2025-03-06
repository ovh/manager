import {
  SERVICE_RENEW_MODES,
  CONTRACTS_IDS,
} from './auto-renew-service-modal.constants';
import { SERVICE_TYPES_USING_V6_SERVICES } from '../utils/constants';

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

  getAvailableRenewPeriods(service) {
    const fetchPeriods = SERVICE_TYPES_USING_V6_SERVICES.includes(
      service.serviceType,
    )
      ? this.$http
          .get(`/services/${service.id}/renewPeriodCapacities`)
          .then(({ data }) => [
            SERVICE_RENEW_MODES.MANUAL,
            ...data.map(
              (period) => Number(period.match(/\d+/)?.[0]) || 'to_be_defined',
            ),
          ])
      : this.$http
          .get(`${service.route.url}/serviceInfos`)
          .then(({ data }) => [
            SERVICE_RENEW_MODES.MANUAL,
            ...data.possibleRenewPeriod,
          ]);

    return fetchPeriods.then((periods) =>
      periods.map((period) => ({
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
      if (SERVICE_TYPES_USING_V6_SERVICES.includes(service?.serviceType)) {
        const mode = service?.renew?.automatic
          ? SERVICE_RENEW_MODES.AUTOMATIC
          : SERVICE_RENEW_MODES.MANUAL;

        const period = Number.isInteger(service?.renew?.period)
          ? `P${service?.renew?.period || 1}M`
          : service?.renew?.period;

        return this.putServiceV6(service, {
          renew: {
            mode,
            ...(mode === SERVICE_RENEW_MODES.AUTOMATIC && {
              period,
            }),
          },
        });
      }

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

  putServiceV6(service, data = {}) {
    return this.$http.put(`/services/${service.id}`, data);
  }

  getPeriodTranslation(months) {
    if (months === SERVICE_RENEW_MODES.MANUAL) {
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
