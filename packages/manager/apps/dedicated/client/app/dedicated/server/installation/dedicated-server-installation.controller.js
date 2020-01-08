angular
  .module('App')
  .controller(
    'ServerInstallationFormCtrl',
    ($rootScope, $scope, $stateParams, Server) => {
      $scope.optionForm = null;

      $scope.sshList = {
        model: [],
        error: false,
      };

      function load() {
        $scope.loader.loadingForm = true;
        Server.getSshKey($stateParams.productId).then(
          (data) => {
            $scope.sshList.error = false;
            $scope.sshList.model = data;
            $scope.loader.loadingForm = false;
          },
          () => {
            $scope.sshList.error = true;
            $scope.loader.loadingForm = false;
          },
        );
      }

      $scope.$watch('optionForm.$valid', () => {
        $rootScope.$broadcast(
          'dedicated.informations.reinstall.form.update',
          $scope.optionForm.$valid,
        );
      });

      $scope.nameGabaritValidator = function nameGabaritValidator() {
        $scope.optionForm.gabaritNameSave.$setValidity(
          'pattern',
          !$scope.installation.options.saveGabarit ||
            /^[a-zA-Z0-9-]{1,50}$/.test(
              $scope.installation.options.gabaritNameSave,
            ),
        );
      };

      $scope.postInstallationScriptLinkValidator = function postInstallationScriptLinkValidator() {
        const input = $scope.optionForm.postInstallationScriptLink;
        const val = $scope.installation.options.postInstallationScriptLink;
        const regexpCheckPort = /^(((https|http|ftp|ftps|ftpes)?:\/\/)?(([^:/]*\.?)*))(:(\d+))?(\/|$)/g;
        const regexpUrlContent = /^([a-zA-Z0-9-./_:~% ]+)$/;
        const regexpUrlProtocol = /^((https|http|ftp|ftps|ftpes)?:\/\/).*/;
        const regexpUrlExtension = /.*(\.zip|\.tar\.gz|\.sh|\.pl|\.cgi)$/;
        const infoUrl = regexpCheckPort.exec(val);
        let port;

        if (val) {
          port = infoUrl ? infoUrl[6] : null;

          input.$setValidity(
            'bad_port_script',
            !port || (port >= 0 && port <= 65535),
          );
          input.$setValidity('bad_url_script', regexpUrlContent.test(val));
          input.$setValidity(
            'bad_protocol_script',
            regexpUrlProtocol.test(val),
          );
          input.$setValidity(
            'bad_extension_script',
            regexpUrlExtension.test(val),
          );
        } else {
          input.$setValidity('bad_port_script', true);
          input.$setValidity('bad_url_script', true);
          input.$setValidity('bad_protocol_script', true);
          input.$setValidity('bad_extension_script', true);
        }
      };

      load();
    },
  );
