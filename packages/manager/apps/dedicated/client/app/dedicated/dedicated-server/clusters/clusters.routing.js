export default /* @ngInject */ ($stateProvider) => {
  const name = 'app.dedicated-cluster.index';

  $stateProvider.state(name, {
    url: '/cluster?page&pageSize&sort&sortOrder&filter',
    params: {
      page: {
        value: '1',
        squash: true,
      },
      pageSize: {
        value: '25',
        squash: true,
      },
      sort: {
        value: 'name',
        squash: true,
      },
      sortOrder: {
        value: 'ASC',
        squash: true,
      },
      filter: {
        value: '[]',
        squash: true,
      },
    },
    resolve: {},
  });
};
