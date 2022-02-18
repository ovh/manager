const inProgressStatuses = ['doing', 'todo', 'waiting_for_customer'];

export default class {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  isProcedureRequired() {
    return this.$http
      .get('/telephony/procedure/required')
      .then(({ data: required }) => required);
  }

  getLastInProgressProcedure() {
    return this.$http
      .get('/telephony/procedure', {
        headers: {
          Pragma: 'no-cache', // needed if a procedure has been cancelled within the last 5 min
          'X-Pagination-Mode': 'CachedObjectList-Pages',
          'X-Pagination-Sort': 'id',
          'X-Pagination-Sort-Order': 'DESC',
          'X-Pagination-Size': 1,
        },
      })
      .then(({ data: [procedure] }) =>
        inProgressStatuses.includes(procedure?.status) ? procedure : null,
      );
  }

  createProcedure(data) {
    return this.$http
      .post('/telephony/procedure', data)
      .then(({ data: procedure }) => procedure);
  }

  cancelProcedure(id) {
    return this.$http.post(`/telephony/procedure/${id}/cancel`);
  }
}
