import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

export default /* @ngInject */ ($http, $timeout, iceberg) => ({
  getDocument(serviceName, from, to, batchId = null) {
    return $http({
      url: `/sms/${serviceName}/document`,
      method: 'GET',
      params: {
        batchID: batchId,
        'creationDatetime.from': from,
        'creationDatetime.to': to,
        wayType: 'outgoing',
      },
    }).then(({ data: documentId }) => {
      // 1. We need to poll to know if the size of the document is not empty.
      const tryGetDocument = () => {
        return $http
          .get(`/me/document/${documentId}`)
          .then(({ data: document }) => {
            if (document.size > 0) {
              // 2. Then we set a timeout to be sure that we have data.
              return $timeout(() => document, 5000);
            }
            return $timeout(tryGetDocument, 1000);
          });
      };
      return tryGetDocument().then((document) => {
        window.location.href = document.getUrl;
      });
    });
  },

  getAccountList() {
    return iceberg('/sms')
      .query()
      .expand('CachedObjectList-Pages')
      .sort('description', 'ASC')
      .execute(null, true)
      .$promise.then(({ data }) => data);
  },

  postCreditTransfer(serviceName, params) {
    return $http
      .post(`/sms/${serviceName}/transferCredits`, params)
      .then(({ data }) => data);
  },

  getSmppSettings(serviceName) {
    return $http
      .get(`/sms/${serviceName}/smpp/settings`)
      .then(({ data }) => data);
  },

  postResetSmppPassword(serviceName) {
    return $http
      .post(`/sms/${serviceName}/smpp/password`)
      .then(({ data }) => data);
  },

  getAllowedIps(serviceName) {
    return $http
      .get(`/sms/${serviceName}/smpp/allowedIPs`)
      .then(({ data }) => data);
  },

  putAllowedIps(serviceName, params) {
    return $http
      .put(`/sms/${serviceName}/smpp/allowedIPs`, params)
      .then(({ data }) => data);
  },

  deleteBatchHistory(serviceName, batchId) {
    return $http
      .delete(`/sms/${serviceName}/batches/${batchId}`)
      .then(({ data }) => data);
  },

  getBlacklistedNumber(serviceName) {
    return iceberg(`/sms/${serviceName}/blacklists`)
      .query()
      .expand('CachedObjectList-Pages')
      .execute(null, true)
      .$promise.then(({ data }) => data);
  },

  getOutgoingSms(serviceName, icebergParams = {}, apiParams = {}) {
    const newIcebergParams = { ...icebergParams };
    let newApiParams = { ...apiParams };
    const creationDatetime = icebergParams.filters.filter(
      (filter) => filter.field === 'creationDatetime',
    );
    if (creationDatetime.length > 0) {
      newApiParams = {
        ...apiParams,
        ...creationDatetime.reduce((acc, current) => {
          let newAcc = { ...acc };
          const [date] = current.reference;
          const fromDate = moment(`${date}T00:00:00`).toISOString();
          const toDate = moment(`${date}T23:59:59`).toISOString();
          switch (current.comparator) {
            case 'is':
              newAcc = {
                ...acc,
                'creationDatetime.from': fromDate,
                'creationDatetime.to': toDate,
              };
              break;
            case 'isBefore':
              newAcc = {
                ...acc,
                'creationDatetime.to': toDate,
              };
              break;
            case 'isAfter':
              newAcc = {
                ...acc,
                'creationDatetime.from': fromDate,
              };
              break;
            default:
              newAcc = { ...acc };
          }
          return newAcc;
        }, {}),
      };
      newIcebergParams.filters = icebergParams.filters.filter(
        (filter) => filter.field !== 'creationDatetime',
      );
    }
    return this.icebergQuery(
      `/sms/${serviceName}/outgoing`,
      newIcebergParams,
      newApiParams,
    );
  },

  icebergQuery(url, icebergParams, apiParams = {}) {
    const {
      filters,
      pageSize,
      offset,
      sort,
      sortOrder,
      defaultFilterColumn,
    } = icebergParams;

    let request = iceberg(url, apiParams)
      .query()
      .expand('CachedObjectList-Pages')
      .limit(pageSize)
      .offset(Math.ceil(offset / (pageSize || 1)))
      .sort(sort || defaultFilterColumn, sortOrder);

    if (filters?.length > 0) {
      request = this.filterIceberg(request, filters);
    }

    return request.execute(null).$promise.then(({ data, headers }) => ({
      data,
      meta: {
        totalCount: headers['x-pagination-elements'],
        currentOffset:
          headers['x-pagination-number'] * headers['X-Pagination-Size'],
        pageCount: headers['x-pagination-total'],
        pageSize: headers['x-pagination-size'],
      },
    }));
  },

  filterIceberg(request, filters) {
    let filterRequest = request;
    filters.forEach(({ field, comparator, reference }) => {
      filterRequest = filterRequest.addFilter(
        field,
        ListLayoutHelper.FILTER_OPERATORS[comparator],
        ListLayoutHelper.mapFilterForIceberg(comparator, reference),
      );
    });
    return filterRequest;
  },

  getContactInfo(serviceName, number) {
    return $http
      .get(`/sms/${serviceName}/virtualNumbers/${number}/time2chat/contact`)
      .then(({ data }) => data);
  },

  getAutoResponseMessage(serviceName, number) {
    return $http
      .get(
        `/sms/${serviceName}/virtualNumbers/${number}/time2chat/autoResponse`,
      )
      .then(({ data }) => data);
  },

  getKyc(serviceName, number) {
    return $http
      .get(`/sms/${serviceName}/virtualNumbers/${number}/time2chat/kyc`)
      .then(({ data }) => data);
  },

  updateContactInfo(serviceName, number, params) {
    return $http
      .put(
        `/sms/${serviceName}/virtualNumbers/${number}/time2chat/contact`,
        params,
      )
      .then(({ data }) => data);
  },

  updateAutoResponseMessage(serviceName, number, params) {
    return $http
      .put(
        `/sms/${serviceName}/virtualNumbers/${number}/time2chat/autoResponse`,
        params,
      )
      .then(({ data }) => data);
  },

  updateKyc(serviceName, number, params) {
    return $http
      .put(`/sms/${serviceName}/virtualNumbers/${number}/time2chat/kyc`, params)
      .then(({ data }) => data);
  },
});
