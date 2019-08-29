import template from './ovh-password.html';

export default () => ({
  restrict: 'EA',
  scope: {
    ovhPwd: '=',
    ovhPwdConfirm: '=',
  },
  replace: true,
  template,
  link($scope) {
    // We use an isolate scope, so define here some properties.
    $scope.password = {};
    $scope.password.value = $scope.ovhPwd;
    $scope.password.confirm = $scope.ovhPwdConfirm;

    $scope.$watch('password.value', (newValue) => {
      $scope.ovhPwd = newValue;
    });

    $scope.$watch('password.confirm', (newValue) => {
      $scope.ovhPwdConfirm = newValue;
    });
  },
});
