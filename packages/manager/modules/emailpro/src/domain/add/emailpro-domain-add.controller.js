import clone from 'lodash/clone';
import filter from 'lodash/filter';
import head from 'lodash/head';
import punycode from 'punycode';
import {
  ADD_STATES,
  CONFIGURATION_MODE,
  DEFAULT_OVH_TARGET_SERVER_URL,
  DOMAIN_MODE,
} from './add.constants';

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
      srvParam: true,
      mxParam: true,
      configureSPF: true,
      configureDKIM: true,
      domainType: $scope.ovhDomain,
      mxRelay: '',
      configMode: CONFIGURATION_MODE.RECOMMENDED,
    };
    $scope.isOvhDomain = true;
    $scope.CONFIGURATION_MODE = CONFIGURATION_MODE;
    $scope.DEFAULT_OVH_TARGET_SERVER_URL = DEFAULT_OVH_TARGET_SERVER_URL;
  };

  const prepareData = function prepareData(data) {
    $scope.loading = false;
    $scope.availableDomains = data.availableDomains;
    $scope.availableDomainsBuffer = data.availableDomains;
    $scope.availableTypes = data.types;
    $scope.availableMainDomains = data.mainDomains;

    if ($scope.availableDomains.length === 0) {
      $scope.model.domainType = $scope.nonOvhDomain;
      $scope.isOvhDomain = false;
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

  const shouldConfigureRecord = function shouldConfigure(value) {
    return (
      (!!value || $scope.model.configMode === CONFIGURATION_MODE.RECOMMENDED) &&
      $scope.isOvhDomain
    );
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
    $scope.model.configureDKIM = shouldConfigureRecord(
      $scope.model.configureDKIM,
    );
    $scope.model.autoEnableDKIM = !!$scope.model.configureDKIM;
    $scope.model.configureSPF = shouldConfigureRecord(
      $scope.model.configureSPF,
    );
    $scope.model.srvParam = shouldConfigureRecord($scope.model.srvParam);
    $scope.model.mxParam = shouldConfigureRecord($scope.model.mxParam);

    $scope.model.type = $scope.model.mxRelay
      ? DOMAIN_MODE.NON_AUTHORITATIVE
      : DOMAIN_MODE.AUTHORITATIVE;

    delete $scope.model.displayName;
    delete $scope.model.domainType;
    delete $scope.model.isUTF8Domain;
    delete $scope.model.configMode;
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
        $scope.closeModal();
        $scope.setMessage(
          $translate.instant('emailpro_tab_domain_add_failure'),
          failure,
        );
      },
    );

    check2010Provider();
  };

  $scope.checkDomain = function checkDomain() {
    $scope.loading = true;
    // check if domain has MxPlan already configured
    EmailProDomains.checkMxPlan($scope.model.name)
      .then(() => {
        $scope.model.mxRelay = DEFAULT_OVH_TARGET_SERVER_URL;
        $scope.loading = false;
      })
      .catch(() => {
        // check zimbra only if MxPlan not configured
        // because zimbra domain call is slow
        EmailProDomains.checkZimbra($scope.model.name)
          .then((found) => {
            if (found) {
              $scope.model.mxRelay = DEFAULT_OVH_TARGET_SERVER_URL;
            }
          })
          .finally(() => {
            $scope.loading = false;
          });
      });
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
    $scope.closeModal();
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

  $scope.onChangeDomainType = () => {
    $scope.resetName();
    $scope.isOvhDomain = $scope.model.domainType === $scope.ovhDomain;
    $scope.model.configMode = CONFIGURATION_MODE.RECOMMENDED;
    $scope.model.mxRelay = '';
  };

  $scope.changeName = function changeName() {
    $scope.nonOvhDomainPristine = false;
    $scope.model.name = punycode.toASCII($scope.model.displayName);
    $scope.model.isUTF8Domain = $scope.model.displayName !== $scope.model.name;
  };

  $scope.isNonOvhDomainValid = function isNonOvhDomainValid() {
    return (
      $scope.isOvhDomain || WucValidator.isValidDomain($scope.model.displayName)
    );
  };

  $scope.closeModal = () => {
    if (Object.values(ADD_STATES).includes($state.current?.name)) {
      $state.go('^');
    } else {
      $scope.setAction(false);
    }
  };
};
