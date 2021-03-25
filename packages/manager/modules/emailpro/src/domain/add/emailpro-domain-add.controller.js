import clone from 'lodash/clone';
import filter from 'lodash/filter';
import head from 'lodash/head';
import punycode from 'punycode';

export default /* @ngInject */ (
  $rootScope,
  $scope,
  $state,
  $timeout,
  $stateParams,
  $translate,
  EmailPro,
  EmailProDomains,
  WucValidator,
) => {
  let timeout = null;

  const init = function init() {
    $scope.noDomainAttached = $scope.currentActionData
      ? $scope.currentActionData.noDomainAttached
      : false;
    $scope.loading = false;
    $scope.ovhDomain = 'ovh-domain';
    $scope.nonOvhDomain = 'non-ovh-domain';
    $scope.orderDomain = 'order-domain';
    $scope.model = {
      name: '',
      displayName: '',
      isUTF8Domain: false,
      srvParam: false,
      mxParam: false,
      domainType: $scope.ovhDomain,
    };
  };

  const prepareData = function prepareData(data) {
    $scope.loading = false;
    $scope.availableDomains = data.availableDomains;
    $scope.availableDomainsBuffer = data.availableDomains;
    $scope.availableTypes = data.types;
    $scope.availableMainDomains = data.mainDomains;
    $scope.model.type = head($scope.availableTypes);

    if ($scope.availableDomains.length === 0) {
      $scope.model.domainType = $scope.nonOvhDomain;
      $scope.model.srvParam = false;
      $scope.model.mxParam = false;
    }
  };

  const check2010Provider = function check2010Provider() {
    if (
      $scope.exchange &&
      $scope.availableMainDomains &&
      $scope.exchange.offer === EmailPro.accountTypeProvider &&
      $scope.exchange.serverDiagnostic.version === EmailPro.EmailPro2010Code
    ) {
      $scope.setOrganization2010 = true;
      if ($scope.availableMainDomains.length === 0) {
        $scope.model.main = true;
        $scope.model.organization2010 = null;
      } else if ($scope.availableMainDomains.length > 0) {
        $scope.model.main = false;
        $scope.model.attachOrganization2010 = head($scope.availableMainDomains);
      }
    }
  };

  const prepareModel = function prepareModel() {
    if ($scope.setOrganization2010) {
      if ($scope.model.main) {
        delete $scope.model.organization2010;
      } else {
        $scope.model.organization2010 =
          $scope.model.attachOrganization2010.name;
      }
      delete $scope.model.attachOrganization2010;
    }

    delete $scope.model.displayName;
    delete $scope.model.domainType;
    delete $scope.model.isUTF8Domain;
  };

  init();

  $scope.loadDomainData = function loadDomainData() {
    $scope.loading = true;

    EmailProDomains.getAddDomainData($stateParams.productId).then(
      (data) => {
        $scope.loading = false;
        prepareData(data);
        check2010Provider();
      },
      (failure) => {
        $scope.resetAction();
        $scope.setMessage(
          $translate.instant('emailpro_tab_domain_add_failure'),
          failure,
        );
      },
    );

    check2010Provider();
  };

  $scope.resetSearchValue = function resetSearchValue() {
    $scope.search.value = null;
    $scope.availableDomains = clone($scope.availableDomainsBuffer);
  };

  $scope.$watch('search.value', (search) => {
    if (search === '') {
      $scope.resetSearchValue();
    }
    $timeout.cancel(timeout);
    if ($scope.search && $scope.search.value) {
      timeout = $timeout(() => {
        if ($scope.search.value === search) {
          $scope.availableDomains = filter(
            $scope.availableDomainsBuffer,
            (n) => n.displayName.indexOf(search) > -1,
          );
        }
      }, 850);
    } else {
      $scope.search = { value: search };
    }
  });

  $scope.addDomain = function addDomain() {
    $scope.resetAction();
    prepareModel();

    EmailProDomains.addDomain($scope.model).then(
      () => {
        $scope.setMessage(
          $translate.instant('emailpro_tab_domain_add_success'),
          { status: 'success' },
        );
      },
      (failure) => {
        $scope.setMessage(
          $translate.instant('emailpro_tab_domain_add_failure'),
          failure,
        );
      },
    );
  };

  $scope.resetName = function resetName() {
    $scope.nonOvhDomainPristine = true;
    $scope.model.displayName = '';
    $scope.model.name = '';
  };

  $scope.checkDomain = function checkDomain() {
    if ($scope.model.domainType === $scope.nonOvhDomain) {
      $scope.model.srvParam = false;
    }
  };

  $scope.changeName = function changeName() {
    $scope.nonOvhDomainPristine = false;
    $scope.model.name = punycode.toASCII($scope.model.displayName);
    $scope.model.isUTF8Domain = $scope.model.displayName !== $scope.model.name;
  };

  $scope.isNonOvhDomainValid = function isNonOvhDomainValid() {
    return (
      $scope.model.domainType !== $scope.nonOvhDomain ||
      WucValidator.isValidDomain($scope.model.displayName)
    );
  };

  $scope.resetAction = () => $state.go('^');
};
