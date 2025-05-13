import {
  URL_INFO,
  DISCOVERY_PROJECT_ACTIVATION_PAYLOAD,
  FULL_PROJECT_PLANCODE,
  LOCAL_ZONE_REGION,
} from './project.constants';
import {
  ORDER_FOLLOW_UP_STEP_ENUM,
  ORDER_FOLLOW_UP_HISTORY_STATUS_ENUM,
} from '../projects.constant';

export default class {
  /* @ngInject */
  constructor($http, $q, iceberg, coreConfig) {
    this.project = {};
    this.$http = $http;
    this.$q = $q;
    this.iceberg = iceberg;
    this.coreConfig = coreConfig;
    this.LOCAL_ZONE_REGION = LOCAL_ZONE_REGION;
  }

  getProjectInfo() {
    return this.project;
  }

  getProjectOrderStatus(projectId) {
    const { VALIDATING } = ORDER_FOLLOW_UP_STEP_ENUM;
    const {
      FRAUD_MANUAL_REVIEW,
      FRAUD_REFUSED,
      PAYMENT_INITIATED,
      PAYMENT_RECEIVED,
    } = ORDER_FOLLOW_UP_HISTORY_STATUS_ENUM;

    const status = {
      orderId: null,
      isActivating: false,
      isManuallyReviewedByAntiFraud: false,
      isRefusedByAntiFraud: false,
      voucher: '',
    };

    return this.$http
      .get(`/cloud/order/?planCode=${FULL_PROJECT_PLANCODE}`)
      .then(({ data: orders }) => {
        const order = orders
          .sort(({ date: dateA }, { date: dateB }) => (dateB > dateA ? 1 : -1))
          .find(({ serviceName }) => serviceName === projectId);

        if (order) {
          status.orderId = order.orderId;

          return this.$q
            .all({
              vouchers: this.getVouchersCreditDetails(projectId),
              followUp: this.getOrderFollowUp(order.orderId),
            })
            .then(({ followUp, vouchers: [firstVoucher] }) => {
              const labels =
                followUp
                  .find(({ step }) => step === VALIDATING)
                  ?.history.map(({ label }) => label) || [];

              status.voucher = firstVoucher?.voucher || '';
              status.isRefusedByAntiFraud = labels.some(
                (label) => label === FRAUD_REFUSED,
              );
              status.isManuallyReviewedByAntiFraud =
                !status.isRefusedByAntiFraud &&
                labels.some((label) => label === FRAUD_MANUAL_REVIEW);
              status.isActivating =
                !status.isRefusedByAntiFraud &&
                !status.isManuallyReviewedByAntiFraud &&
                labels.some((label) =>
                  [PAYMENT_INITIATED, PAYMENT_RECEIVED].includes(label),
                );

              return status;
            });
        }

        return status;
      })
      .catch(() => status);
  }

  getOrderFollowUp(orderId) {
    return this.$http
      .get(`/me/order/${orderId}/followUp`)
      .then(({ data }) => data);
  }

  getDocumentUrl(type) {
    const { ovhSubsidiary } = this.coreConfig.getUser();
    return URL_INFO[type][ovhSubsidiary] || URL_INFO[type].DEFAULT;
  }

  getLocalZones(customerRegions = []) {
    return customerRegions?.filter(({ type }) =>
      type.includes(this.LOCAL_ZONE_REGION),
    );
  }

  // eslint-disable-next-line class-methods-use-this
  checkIsLocalZone(localZones, regionName) {
    return localZones.some((region) => region.name === regionName);
  }

  setProjectInfo(project = {}) {
    this.project = project;
  }

  getServiceInfo(serviceName) {
    return this.$http
      .get(`/cloud/project/${serviceName}/serviceInfos`)
      .then(({ data }) => data)
      .catch(() => ({}));
  }

  getCustomerRegions(serviceName, withPaginationMode = false) {
    const requestHeader = withPaginationMode
      ? {
          'X-Pagination-Mode': 'CachedObjectList-Pages',
          'X-Pagination-Size': 5000,
        }
      : null;
    return this.$http
      .get(`/cloud/project/${serviceName}/region`, {
        headers: requestHeader,
      })
      .then(({ data: regions }) => regions);
  }

  getStorageRegions(projectId, regionCapacity) {
    return this.getCustomerRegions(projectId, true).then((regions) => {
      return regions.filter(({ services }) =>
        services.find(({ name }) => name === regionCapacity),
      );
    });
  }

  getS3StorageRegions(projectId, regionCapacity) {
    return this.getCustomerRegions(projectId, true).then((regions) => {
      return regions.filter(({ services }) =>
        services.find(
          ({ name }) =>
            name === regionCapacity[0] || name === regionCapacity[1],
        ),
      );
    });
  }

  getVouchersCreditDetails(serviceName) {
    return this.iceberg(`/cloud/project/${serviceName}/credit`)
      .query()
      .expand('CachedObjectList-Pages')
      .execute(null, true)
      .$promise.then(({ data }) => data)
      .catch(() => []);
  }

  activateDiscoveryProject(serviceId, autoPay = true) {
    return this.$http.post(
      `/services/${serviceId}/upgrade/${FULL_PROJECT_PLANCODE}/execute`,
      {
        ...DISCOVERY_PROJECT_ACTIVATION_PAYLOAD,
        autoPayWithPreferredPaymentMethod: autoPay,
      },
    );
  }

  simulateActivateDiscoveryProject(serviceId) {
    return this.$http.post(
      `/services/${serviceId}/upgrade/${FULL_PROJECT_PLANCODE}/simulate`,
      DISCOVERY_PROJECT_ACTIVATION_PAYLOAD,
    );
  }

  claimVoucher(projectId, data) {
    return this.$http.post(`/cloud/project/${projectId}/credit`, data);
  }
}
