angular.module('App').controller('FeedBackCtrl', [
  '$scope',
  'OvhHttp',
  '$location',
  'constants',
  ($scope, OvhHttp, $location, constants) => {
    $scope.feedback = null;

    $scope.initForm = () => {
      $scope.feedback = {
        subject: '',
        body: '',
      };
    };

    $scope.isSending = false;

    $scope.sendFeedBack = () => {
      if ($scope.feedBackForm.$valid) {
        $scope.isSending = true;
        $scope.feedback.body = [
          $scope.feedback.body,
          '------------------------------------------',
          `univers : ${constants.UNIVERS}`,
          `location : ${$location.path()}`,
          `userAgent : ${window.navigator.userAgent}`,
        ].join('\n');
        OvhHttp.post('/me/feedback', {
          rootPath: 'apiv6',
          data: $scope.feedback,
        }).finally(() => {
          $scope.initForm();
          $('#feedback').modal('toggle');
          $scope.isSending = false;
        });
      }
    };

    $scope.closeModal = () => {
      $('#feedback').modal('toggle');
    };

    $scope.initForm();
  },
]);
