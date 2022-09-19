import get from 'lodash/get';

export default class {
  /* @ngInject */
  constructor(DedicatedCloud) {
    this.DedicatedCloud = DedicatedCloud;
  }

  $onInit() {
    this.selectedUser = null;
    this.loading = {
      init: true,
    };

    return this.DedicatedCloud.getUserDetail(this.productId, this.userId)
      .then((details) => {
        this.selectedUser = details;
      })
      .finally(() => {
        this.loading.init = false;
      });
  }

  loadUserRights({ offset, pageSize }) {
    return this.DedicatedCloud.getUserRights(
      this.productId,
      this.userId,
      pageSize,
      offset - 1,
    ).then((results) => ({
      data: get(results, 'list.results'),
      meta: {
        totalCount: results.count,
      },
    }));
  }
}
