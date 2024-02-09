import {
  URL_INFO,
  DISCOVERY_PROJECT_ACTIVATION_PAYLOAD,
  DISCOVERY_PROJECT_ACTIVATION_PLANCODE,
} from './project.constants';
import {
  ORDER_FOLLOW_UP_STEP_ENUM,
  ORDER_FOLLOW_UP_HISTORY_STATUS_ENUM,
} from '../projects.constant';

export default class {
  /* @ngInject */
  constructor($http, iceberg, coreConfig) {
    this.project = {};
    this.$http = $http;
    this.iceberg = iceberg;
    this.coreConfig = coreConfig;
  }

  getProjectInfo() {
    return this.project;
  }

  isManuallyReviewedByAntiFraud() {
    return this.$http
      .get(`/cloud/order/?planCode=project.2018`)
      .then(({ data: orders }) => {
        const validatingOrder = orders.find(
          (order) =>
            order.status.toLowerCase() ===
            ORDER_FOLLOW_UP_STEP_ENUM.DELIVERING.toLowerCase(),
        );

        return validatingOrder
          ? this.getOrderFollowUp(validatingOrder?.orderId)
          : false;
      })
      .then((orderFollowUp) => {
        if (orderFollowUp) {
          const deliveringStep = orderFollowUp?.find(
            (element) => element.step === ORDER_FOLLOW_UP_STEP_ENUM.VALIDATING,
          );
          return (
            deliveringStep?.history.find(
              (event) =>
                event.label ===
                ORDER_FOLLOW_UP_HISTORY_STATUS_ENUM.FRAUD_MANUAL_REVIEW,
            ) || false
          );
        }
        return false;
      })
      .catch(() => {
        return false;
      });
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
      `/services/${serviceId}/upgrade/${DISCOVERY_PROJECT_ACTIVATION_PLANCODE}/execute`,
      {
        ...DISCOVERY_PROJECT_ACTIVATION_PAYLOAD,
        autoPayWithPreferredPaymentMethod: autoPay,
      },
    );
  }

  simulateActivateDiscoveryProject(serviceId) {
    return this.$http.post(
      `/services/${serviceId}/upgrade/${DISCOVERY_PROJECT_ACTIVATION_PLANCODE}/simulate`,
      DISCOVERY_PROJECT_ACTIVATION_PAYLOAD,
    );
  }

  claimVoucher(projectId, data) {
    return this.$http.post(`/cloud/project/${projectId}/credit`, data);
  }
}
