export default /* @ngInject */ ($q, $translate, BillingOrderStatusEnum) => {
  let filterConfig;

  function initFilterConfig() {
    return BillingOrderStatusEnum.getEnum().then((statusEnum) => [
      {
        id: 'all',
        label: $translate.instant('orders_order_status_filter_all'),
        statusList: [],
      },
      {
        id: 'in-progress',
        label: $translate.instant('orders_order_status_filter_progress'),
        statusList: [
          statusEnum.CANCELLING,
          statusEnum.CHECKING,
          statusEnum.DELIVERING,
          statusEnum.DOCUMENTS_REQUESTED,
          statusEnum.UNKNOWN,
        ],
      },
      {
        id: 'unpaid',
        label: $translate.instant('orders_order_status_not_paid'),
        statusList: [statusEnum.NOT_PAID],
        getFilter() {
          return {
            'expirationDate:gt': moment().format(),
          };
        },
      },
      {
        id: 'terminated',
        label: $translate.instant('orders_order_status_filter_terminated'),
        statusList: [statusEnum.DELIVERED, statusEnum.CANCELLED],
      },
    ]);
  }

  return {
    getFilterConfig() {
      if (filterConfig) {
        return $q.when(filterConfig);
      }

      return initFilterConfig().then((filters) => {
        filterConfig = filters;
        return filterConfig;
      });
    },
  };
};
