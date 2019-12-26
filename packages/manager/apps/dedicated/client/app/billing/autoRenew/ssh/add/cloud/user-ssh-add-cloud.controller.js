import isObject from 'lodash/isObject';
import set from 'lodash/set';

angular
  .module('UserAccount')
  .controller('UserAccount.controllers.ssh.cloud.add', [
    '$scope',
    '$window',
    'atInternet',
    'UseraccountSshService',
    function UserAccountSshCloudAddController(
      $scope,
      $window,
      atInternet,
      UseraccountSshService,
    ) {
      $scope.model = {};
      $scope.data = {
        projects: [],
        selectedProject: null,
        loader: true,
      };

      UseraccountSshService.getCloudProjects()
        .then((projects) => {
          $scope.data.projects = projects;
        })
        .finally(() => {
          $scope.data.loader = false;
        });

      $scope.addCloudSshKey = function addCloudSshKey() {
        $scope.resetAction();
        set(
          $window,
          'location.href',
          UseraccountSshService.getSshCloudUrl($scope.data.selectedProject.id),
        );
        atInternet.trackClick({
          name: 'validation_add_ssh_key',
          type: 'action',
          chapter1: 'account',
          chapter2: 'ssh',
          chapter3: 'cloud',
        });
      };

      $scope.formIsValid = function formIsValid() {
        return isObject($scope.data.selectedProject);
      };
    },
  ]);
