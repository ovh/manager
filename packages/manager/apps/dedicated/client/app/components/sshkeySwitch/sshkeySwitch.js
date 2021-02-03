import './sshkeySwitch.css';

const SSH_REGEX = [
  {
    name: 'RSA',
    regex: /^(ssh-rsa)\s+(A{4}[0-9A-Za-z +/]+[=]{0,3})\s+(\S+)$/,
  },
  {
    name: 'ECDSA',
    regex: /^(ecdsa-sha2-nistp[0-9]+)\s+(A{4}[0-9A-Za-z +/]+[=]{0,3})\s+(\S+)$/,
  },
  {
    name: 'ED25519',
    regex: /^(ssh-ed25519)\s+(A{4}[0-9A-Za-z +/]+[=]{0,3})\s+(\S+)$/,
  },
];

angular.module('App').directive('sshkeySwitch', [
  function sshkeySwitchDirective() {
    return {
      template:
        '<div><span class="label label-default ml-2" data-ng-class="{\'label-primary\': selectedType == keytype.name}" data-ng-repeat="keytype in keytypes" data-ng-bind="keytype.name"></span></div>',
      restrict: 'A',
      require: '?ngModel',
      replace: true,
      scope: {
        isValid: '=ngModel',
        sshkeySwitchKey: '@sshkeySwitchKey',
      },
      link: function postLink($scope) {
        $scope.isValid = false;
        $scope.selectedType = false;
        $scope.keytypes = SSH_REGEX;

        let i = 0;
        let found = false;

        $scope.$watch('sshkeySwitchKey', (val) => {
          found = false;
          const valTrimmed = val.trim().replace(/\n/, '');
          /* eslint-disable */
          for (i = SSH_REGEX.length; i--; ) {
            if (SSH_REGEX[i].regex.test(valTrimmed)) {
              found = SSH_REGEX[i].name;
              break;
            }
          }
          /* eslint-enable */
          $scope.selectedType = found;
          $scope.isValid = !!found;
        });
      },
    };
  },
]);
