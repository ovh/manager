import {
  STATE_DOING,
  STATE_ERROR,
  STATE_DONE,
  STATE_CANCELLED,
  STATE_TODO,
  MAILING_LIST,
  REDIRECTION,
} from './emailpro-task.constants';

angular.module('Module.emailpro.controllers')
  .controller('EmailProTabTasksCtrl', ($scope, $stateParams, $translate, EmailPro) => {
    $scope.tasksList = null;
    $scope.stateDoing = STATE_DOING;
    $scope.stateError = STATE_ERROR;
    $scope.stateDone = STATE_DONE;
    $scope.stateCancelled = STATE_CANCELLED;
    $scope.stateTodo = STATE_TODO;
    $scope.mailinglist = MAILING_LIST;
    $scope.redirection = REDIRECTION;
    $scope.loadPaginated = function ({ pageSize, offset }) {
      return EmailPro.getTasks(
        $stateParams.productId,
        pageSize,
        offset - 1,
        $scope.exchange.associatedDomainName,
      ).then((tasks) => {
        $scope.tasksList = _.flatten(tasks);
        return {
          data: $scope.tasksList,
          meta: {
            totalCount: $scope.tasksList.length,
          },
        };
      }).catch((failure) => {
        $scope.setMessage($translate.instant('emailpro_tab_TASKS_error_message'), failure.data);
        return { data: null, meta: { totalCount: 0 } };
      });
    };

    $scope.$on(EmailPro.events.tasksChanged, () => {
      $scope.$broadcast('paginationServerSide.reload', 'tasksTable');
    });

    $scope.refreshTable = function () {
      $scope.$broadcast('paginationServerSide.reload', 'tasksTable');
    };
  });
