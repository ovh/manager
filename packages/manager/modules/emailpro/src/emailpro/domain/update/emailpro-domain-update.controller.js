angular.module('Module.emailpro.controllers')
  .controller('EmailProUpdateDomainCtrl', (
    $scope,
    $stateParams,
    $translate,
    EmailPro,
    $rootScope,
    EmailProDomains,
    WucValidator,
  ) => {
    const trimMxRelay = function (mxRelay) {
      if (mxRelay && mxRelay[mxRelay.length - 1] === '.') {
        return mxRelay.substring(0, mxRelay.length - 1);
      }
      return mxRelay;
    };

    $scope.nonAuthoritativeEmail = [
      'mx0.mail.ovh.net',
      'mx1.mail.ovh.net',
      'mx2.mail.ovh.net',
      'mx3.mail.ovh.net',
      'pro1.mail.ovh.net',
    ];

    $scope.selectedDomain = {
      name: $scope.currentActionData.name,
      type: $scope.currentActionData.type,
      mxRelay: $scope.currentActionData.mxRelay,
    };
    $scope.domainTypes = $scope.currentActionData.domainTypes;

    $scope.cancel = function () {
      // Make sure the type in the select widget is reset to its initial value
      $rootScope.$broadcast(EmailPro.events.domainsChanged);
      $scope.resetAction();
    };

    $scope.checkMxRelay = function () {
      if ($scope.selectedDomain.type === 'AUTHORITATIVE' && $scope.selectedDomain.mxRelay) {
        $scope.mxRelayBuffer = $scope.selectedDomain.mxRelay;
        $scope.selectedDomain.mxRelay = null;
      }
      if ($scope.selectedDomain.type === 'NON_AUTHORITATIVE' && $scope.mxRelayBuffer) {
        $scope.selectedDomain.mxRelay = $scope.mxRelayBuffer;
        $scope.mxRelayBuffer = null;
      }
    };

    /**
     * Hide mxRelay option for 2010 providers
     * @returns {boolean}
     */
    $scope.isMxRelayVisible = function () {
      return !($scope.exchange.offer === 'PROVIDER' && $scope.exchange.serverDiagnostic.version === 14);
    };

    /**
     * Check for infinite loop condition (redirection towards its own hostname)
     * @returns {boolean} True if infinite loop condition detected
     */
    $scope.checkLoopWarning = function () {
      return $scope.getHostname() === $scope.selectedDomain.mxRelay || `${$scope.getHostname()}.` === $scope.selectedDomain.mxRelay;
    };

    /**
     * Check if a domain have more than 255 characters
     * @returns {boolean} True if more than 255 characters
     */
    $scope.checkLengthWarning = function () {
      return $scope.selectedDomain.mxRelay && $scope.selectedDomain.mxRelay.length > 255;
    };

    $scope.isValid = function () {
      if ($scope.selectedDomain.type === 'AUTHORITATIVE') {
        return true;
      } if ($scope.currentActionData
            && $scope.currentActionData.type === $scope.selectedDomain.type
            && $scope.currentActionData.mxRelay === $scope.selectedDomain.mxRelay) {
        return false;
      } if ($scope.isMxRelayVisible()) {
        return $scope.selectedDomain.mxRelay
                && !$scope.checkLengthWarning()
                && !$scope.checkLoopWarning()
                && $scope.isValidMxRelay($scope.selectedDomain.mxRelay);
      }
      return true;
    };

    $scope.isValidMxRelay = function () {
      let mxRelayBuffer = $scope.selectedDomain.mxRelay;
      if (mxRelayBuffer && $scope.selectedDomain.mxRelay[$scope.selectedDomain.mxRelay.length - 1] === '.') {
        mxRelayBuffer = $scope.selectedDomain.mxRelay
          .substring(0, $scope.selectedDomain.mxRelay.length - 1);
      }
      return WucValidator.isValidDomain(mxRelayBuffer);
    };

    $scope.submit = function () {
      $scope.resetAction();
      if ($scope.selectedDomain.type === 'AUTHORITATIVE') {
        $scope.selectedDomain.mxRelay = null;
      } else {
        $scope.selectedDomain.mxRelay = trimMxRelay($scope.selectedDomain.mxRelay);
      }

      EmailProDomains
        .updateDomain($stateParams.organization, $stateParams.productId, $scope.selectedDomain)
        .then(() => {
          $scope.setMessage($translate.instant('emailpro_tab_domain_modify_success'), 'true');
        })
        .catch((failure) => {
          // Make sure the type in the select widget is reset to its initial value
          $rootScope.$broadcast(EmailPro.events.domainsChanged);
          $scope.setMessage(`${$translate.instant('emailpro_tab_domain_modify_failure')} : ${failure.message}`, { status: 'error' });
        });
    };

    $scope.getHostname = function () {
      return $scope.exchange.hostname;
    };
  });
