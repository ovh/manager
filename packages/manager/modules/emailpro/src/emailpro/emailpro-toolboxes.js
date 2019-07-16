angular.module('Module.emailpro.controllers')
  .controller('EmailProToolboxGroupsCtrl', ['$scope',
    function ($scope) {
      $scope.updateGroup = function (ml) {
        if (ml.state === $scope.stateOk) {
          $scope.setAction('emailpro/group/update/emailpro-group-update', angular.copy(ml));
        }
      };

      $scope.deleteGroup = function (ml) {
        if (ml.state === $scope.stateOk) {
          $scope.setAction('emailpro/group/remove/emailpro-group-remove', angular.copy(ml));
        }
      };

      $scope.addGroupAlias = function (ml) {
        if (ml.state === $scope.stateOk) {
          $scope.setAction('emailpro/group/alias/add/emailpro-group-alias-add', angular.copy(ml));
        }
      };

      $scope.groupDelegation = function (ml) {
        if (ml.state === $scope.stateOk) {
          $scope.setAction('emailpro/group/delegation/emailpro-group-delegation', angular.copy(ml));
        }
      };

      $scope.aliasDisplay = function (ml) {
        if (ml.state === $scope.stateOk) {
          $scope.displayAliasesByGroup(ml);
        }
      };
    },
  ]);

angular.module('Module.emailpro.controllers')
  .controller('EmailProToolboxResourcesCtrl', ['$scope', 'EmailPro',
    function ($scope, EmailPro) {
      $scope.stateOk = EmailPro.stateOk;

      $scope.updateResource = function (resource) {
        if (resource.state === $scope.stateOk) {
          $scope.setAction('emailpro/resource/update/emailpro-resource-update', angular.copy(resource));
        }
      };

      $scope.resourceDelegation = function (resource) {
        if (resource.state === $scope.stateOk) {
          $scope.setAction('emailpro/resource/delegation/emailpro-resource-delegation', angular.copy(resource));
        }
      };

      $scope.deleteResource = function (resource) {
        if (resource.state === $scope.stateOk) {
          $scope.setAction('emailpro/resource/remove/emailpro-resource-remove', angular.copy(resource));
        }
      };
    },
  ]);

angular.module('Module.emailpro.controllers')
  .controller('EmailProToolboxDisclaimerCtrl', ['$scope',
    function ($scope) {
      $scope.updateDisclaimer = function (disclaimer) {
        if (!disclaimer.taskPendingId) {
          $scope.setAction('emailpro/disclaimer/update/emailpro-disclaimer-update', angular.copy(disclaimer));
        }
      };

      $scope.deleteDisclaimer = function (disclaimer) {
        if (!disclaimer.taskPendingId) {
          $scope.setAction('emailpro/disclaimer/remove/emailpro-disclaimer-remove', angular.copy(disclaimer));
        }
      };
    },
  ]);
