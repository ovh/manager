angular.module('managerApp').controller('PackDomainActivationController', function ($scope, $stateParams, $translate, $q, $state, $timeout, OvhApiPackXdslDomainActivation, TucToast, OvhApiMe, OvhSimpleCountryList) {
  const self = this;

  function getUser() {
    return OvhApiMe.v6().get().$promise;
  }

  function loadAvailableTlds() {
    return OvhApiPackXdslDomainActivation.v6().getTlds({
      packId: $scope.locker.packName,
    }, (data) => {
      $scope.locker.tldList = [];
      _.each(data, (elt) => {
        $scope.locker.tldList.push({
          value: elt,
          label: `.${elt}`,
        });
      });
      $scope.model.tld = _.first(data);
    }).$promise;
  }

  function loadActivatedDomains() {
    return OvhApiPackXdslDomainActivation.v6().getServices({
      packId: $scope.locker.packName,
    }, (data) => {
      $scope.locker.activatedDomains = data;
    }).$promise;
  }

  function init() {
    /* Only for submitted data */
    $scope.model = {
      action: null, // Enum: [create | transfert | trade]
      authInfo: null,
      domain: null,
      tld: null,
    };

    /* All data who should not be in the model (not submitted) */
    $scope.locker = {
      packName: null,
      tldList: [],
      activatedDomains: null,
      fqdn: null, // Fully Qualified Domain Name (domain.tld)
    };

    /* State machine used to manipulate the view */
    $scope.toggles = {
      domainStatus: null,
      domainLoading: false,
      domainIsActivable: false,
      transfertWanted: false,
      authMethod: null,
    };

    if (_.isEmpty($stateParams.packName)) {
      TucToast.error($translate.instant('domain_activation_total_error'));
      return $q.when(null);
    }

    $scope.locker.packName = $stateParams.packName;
    $scope.locker.activatedDomains = [];

    self.countries = OvhSimpleCountryList.asDataForSelect;

    self.isLoading = true;
    return $q.all([
      getUser(),
      loadActivatedDomains(),
      loadAvailableTlds(),
    ]).catch((error) => {
      TucToast.error([$translate.instant('domain_activation_total_error'), _.get(error, 'data.message')].join(' '));
      return $q.reject(error);
    }).finally(() => {
      self.isLoading = false;
    });
  }

  const setDomainIsAvailable = function () {
    $scope.toggles.domainStatus = 'available';
    $scope.model.action = 'create';
  };

  const setDomainIsNotAvailable = function () {
    $scope.toggles.domainStatus = 'unavailable';
    $scope.model.action = 'transfer';
  };

  (function () {
    let to = null;
    $scope.scheduleCheckDomainDisponibility = function () {
      if (to) {
        $timeout.cancel(to);
      }
      to = $timeout($scope.checkDomainDisponibility, 800);
    };
  }());

  $scope.checkDomainDisponibility = function () {
    /* we have to reset some previous setting to avoid some strange… things */
    $scope.toggles.transfertWanted = false;
    $scope.toggles.domainStatus = null;
    $scope.toggles.authMethod = null;
    $scope.toggles.domainLoading = false;

    if (!$scope.model.domain) {
      $scope.locker.fqdn = null;
      return;
    }

    $scope.locker.fqdn = [$scope.model.domain, $scope.model.tld].join('.');

    if (~$scope.locker.activatedDomains.indexOf($scope.locker.fqdn)) { // eslint-disable-line
      $scope.toggles.domainStatus = 'alreadyActivated';
    } else {
      $scope.toggles.domainLoading = true;

      OvhApiPackXdslDomainActivation.Aapi().checkDisponibility({
        packId: $stateParams.packName,
        domain: $scope.model.domain,
        language: 'fr',
      }).$promise.then((data) => {
        // if the model still match the request
        if (data && data.domain === $scope.model.domain) {
          if (!data.search) {
            TucToast.error($translate.instant('domain_activation_error_on_check_disponibility'));
            return;
          }

          setDomainIsNotAvailable();
          _.each(data.search, (search) => {
            if (search.available && search.tld === $scope.model.tld) {
              setDomainIsAvailable();
            }
          });

          // TODO: IF NOT $scope.toggles.domainStatus THEN ERROR !!
        }
      }).catch((err) => {
        TucToast.error([$translate.instant('domain_activation_error_on_check_disponibility'), _.get(err, 'data.message')].join(' '));
        return $q.reject(err);
      }).finally(() => {
        $scope.toggles.domainLoading = false;
      });
    }
  };

  $scope.toggleTransfertWanted = function () {
    $scope.toggles.transfertWanted = !$scope.toggles.transfertWanted;
  };

  $scope.submit = function () {
    const data = _.pick($scope.model, ['packName', 'action', 'authInfo', 'domain', 'tld']);

    self.isActivating = true;
    OvhApiPackXdslDomainActivation.v6().postServices({
      packId: $scope.locker.packName,
    }, data).$promise.then(() => {
      TucToast.success($translate.instant('domain_activation_domain_is_saved'));

      $timeout(() => {
        $state.go('telecom.pack', {
          packName: $stateParams.packName,
        });
      }, 2000);
    }).catch((err) => {
      TucToast.error([$translate.instant('domain_activation_unable_to_save_domain'), _.get(err, 'data.message')].join(' '));
      return $q.reject(err);
    }).finally(() => {
      self.isActivating = false;
    });
  };

  init();
});
