export default /* @ngInject */ ($scope, $timeout) => {
  $scope.resetAction = () => {
    $scope.setAction(false);
  };

  $scope.$on('$locationChangeStart', () => {
    $scope.resetAction();
    $scope.message = null;
  });

  $scope.setMessage = (message, data) => {
    let messageToSend = message;
    let i = 0;

    $scope.alertType = '';
    if (data) {
      if (data.message) {
        messageToSend += ` (${data.message})`;
        switch (data.type) {
          case 'ERROR':
            $scope.alertType = 'alert-danger';
            break;
          case 'WARNING':
            $scope.alertType = 'alert-warning';
            break;
          case 'INFO':
            $scope.alertType = 'alert-success';
            break;
          default:
            break;
        }
      } else if (data.messages) {
        if (data.messages.length > 0) {
          switch (data.state) {
            case 'ERROR':
              $scope.alertType = 'alert-danger';
              break;
            case 'PARTIAL':
              $scope.alertType = 'alert-warning';
              break;
            case 'OK':
              $scope.alertType = 'alert-success';
              break;
            default:
              break;
          }
          messageToSend += ' (';
          for (i; i < data.messages.length; i += 1) {
            messageToSend += `${data.messages[i].id} : ${
              data.messages[i].message
            }${data.messages.length === i + 1 ? ')' : ', '}`;
          }
        }
      } else if (data.id && data.status) {
        switch (data.state) {
          case 'BLOCKED':
          case 'blocked':
          case 'CANCELLED':
          case 'cancelled':
          case 'PAUSED':
          case 'paused':
          case 'ERROR':
          case 'error':
            $scope.alertType = 'alert-danger';
            break;
          case 'WAITING_ACK':
          case 'waitingAck':
          case 'DOING':
          case 'doing':
            $scope.alertType = 'alert-warning';
            break;
          case 'TODO':
          case 'todo':
          case 'DONE':
          case 'done':
            $scope.alertType = 'alert-success';
            break;
          default:
            break;
        }
      } else if (data === true) {
        $scope.alertType = 'alert-success';
      }
    }
    $scope.message = messageToSend;
  };

  $scope.setAction = function setAction(action, data) {
    if (action) {
      $scope.currentAction = action;
      $scope.currentActionData = data;
      $scope.stepPath = `cdn/dedicated/${$scope.currentAction}.html`;
      $('#currentAction').modal({
        keyboard: true,
        backdrop: 'static',
      });
    } else {
      $('#currentAction').modal('hide');
      $scope.currentActionData = null;
      $timeout(() => {
        $scope.stepPath = '';
      }, 300);
    }
  };
};
