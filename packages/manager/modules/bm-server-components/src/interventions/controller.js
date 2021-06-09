import isFunction from 'lodash/isFunction';
import get from 'lodash/get';

export default class DedicatedServerInterventionsController {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  getInterventions({ offset, pageSize }) {
    return this.loadInterventions(this.serviceName, pageSize, offset)
      .then((interventions) => ({
        data: get(interventions, 'list.results', []),
        meta: {
          totalCount: get(interventions, 'count', 0),
        },
      }))
      .catch((error) => {
        this.handleError(error);
        return {
          data: [],
          meta: {
            totalCount: 0,
          },
        };
      });
  }

  loadInterventions(serviceName, count, offset) {
    return this.$http
      .get(`/sws/dedicated/server/${serviceName}/interventions`, {
        serviceType: 'aapi',
        params: {
          count,
          offset,
        },
      })
      .then(({ data }) => data);
  }

  handleError(error) {
    if (isFunction(this.onError)) {
      this.onError({ error });
    }
  }
}
