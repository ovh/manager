export default /* @ngInject */ function sshkeySwitchDirective(ducSshkeyRegex) {
  return {
    template:
      '<div><span class="label label-default ml-2" data-ng-class="{\'label-primary\': selectedType == keytype.name}" data-ng-repeat="keytype in keytypes" data-ng-bind="keytype.name"></span></div>',
    restrict: 'A',
    require: '?ngModel',
    replace: true,
    scope: {
      isValid: '=ngModel',
      sshkeySwitchKey: '@ducSshkeySwitchKey',
    },
    link: function postLink($scope) {
      $scope.isValid = false;
      $scope.selectedType = false;
      $scope.keytypes = ducSshkeyRegex;

      let i = 0;
      let found = false;

      $scope.$watch('sshkeySwitchKey', (val) => {
        found = false;
        const valTrimmed = val.trim().replace(/\n/, '');
        /* eslint-disable */
          for (i = ducSshkeyRegex.length; i--; ) {
            if (ducSshkeyRegex[i].regex.test(valTrimmed)) {
              found = ducSshkeyRegex[i].name;
              break;
            }
          }
          /* eslint-enable */
        $scope.selectedType = found;
        $scope.isValid = !!found;
      });
    },
  };
}
