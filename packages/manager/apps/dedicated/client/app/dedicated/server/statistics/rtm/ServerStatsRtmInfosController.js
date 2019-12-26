angular
  .module('controllers')
  .controller(
    'controllers.Server.Stats.Info',
    ($scope, $stateParams, Server) => {
      $scope.loading = true;

      function init() {
        Server.getInfosServer($stateParams.productId).then((data) => {
          $scope.loading = false;
          $scope.infoRtm = data;
        });

        $scope.updateRtmLinkForCurrentLang = Server.getRtmHowtoUrl();
      }

      init();
    },
  );
