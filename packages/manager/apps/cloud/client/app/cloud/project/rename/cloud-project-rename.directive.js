angular.module('managerApp').directive('cloudProjectRename', () => ({
  restrict: 'E',
  templateUrl: 'app/cloud/project/rename/cloud-project-rename.html',
  controller: 'CloudProjectRenameController',
  controllerAs: 'ctrl',
  bindToController: true,
  scope: {
    projectId: '=',
  },
}));
