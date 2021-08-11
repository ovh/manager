import Host from './host.class';
import { STATUS } from './constants';

export default class AnthosHostTableCtrl {
  /* @ngInject */
  constructor($translate, AnthosTenantsService) {
    this.$translate = $translate;
    this.AnthosTenantsService = AnthosTenantsService;
    this.STATUS = STATUS;
  }

  loadHosts({ offset, pageSize }) {
    this.error = null;
    return this.AnthosTenantsService.getHosts(
      this.serviceName,
      this.additionalHosts,
      (offset - 1) / pageSize + 1,
      pageSize,
    )
      .then((result) => ({
        data: result.data.map((hostData) => new Host(hostData)),
        meta: {
          totalCount: result.headers('x-pagination-elements'),
        },
      }))
      .catch((err) => {
        this.error = err.data?.message;
        return {
          data: [],
          meta: {
            totalCount: 0,
          },
        };
      });
  }
}
