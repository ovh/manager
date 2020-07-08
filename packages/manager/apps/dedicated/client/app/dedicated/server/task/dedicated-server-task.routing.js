export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated.server.task', {
    url: '/task',
    views: {
      'tabView@app.dedicated.server': 'dedicatedServerTask',
    },
  });
};
