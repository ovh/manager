import isFunction from 'lodash/isFunction';

export default class BMServerComponentsInterventionsController {
  /* @ngInject */
  constructor(serverIntervention) {
    this.serverIntervention = serverIntervention;
  }

  getInterventions({ offset, pageSize }) {
    return this.serverIntervention
      .fetchInterventions(this.serviceName, { pageSize, offset })
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

  handleError(error) {
    if (isFunction(this.onError)) {
      this.onError({ error });
    }
  }
}
