angular.module('Module.download').config(($stateProvider) => {
  $stateProvider.state('app.download', {
    url: '/download?type&id&extension',
    templateUrl: 'download/download.html',
    controller: 'DownloadCtrl',
    translations: { value: ['.'], format: 'json' },
  });
});
