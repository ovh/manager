import template from './FTP.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.hosting.dashboard.ftp', {
    url: '/ftp',
    controller: 'HostingTabFTPCtrl',
    template,
  });
};
