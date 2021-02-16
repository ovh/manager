import angular from 'angular';
import get from 'lodash/get';
import isString from 'lodash/isString';
import set from 'lodash/set';

export default /* @ngInject */ function EmailProCtrl(
  $q,
  $rootScope,
  $scope,
  $timeout,
  $location,
  $stateParams,
  $translate,
  accountLink,
  atInternet,
  currentActiveLink,
  disclaimerLink,
  domainLink,
  externalContactLink,
  EmailPro,
  APIEmailPro,
  WucUser,
  informationLink,
  mailingListLink,
  redirectionLink,
  taskLink,
  EMAILPRO_CONFIG,
  coreConfig,
  coreURLBuilder,
) {
  $scope.atInternet = atInternet;
  $scope.currentRegionCA = coreConfig.isRegion('CA');
  $scope.accountTypeDedicated = EmailPro.accountTypeDedicated;
  $scope.accountTypeHosted = EmailPro.accountTypeHosted;
  $scope.accountTypeProvider = EmailPro.accountTypeProvider;

  $scope.alerts = {
    main: 'emailproDashboardAlert',
  };
  $scope.loadingEmailProInformations = true;
  $scope.loadingEmailProError = false;
  $scope.message = null;
  $scope.newDisplayName = {
    value: '',
  };
  $scope.edit = {
    active: false,
  };

  $scope.stepPath = '';
  $scope.currentAction = null;
  $scope.currentActionData = null;
  $scope.displayGuides = null;

  WucUser.getUrlOf('changeOwner').then((link) => {
    $scope.changeOwnerUrl = link;
  });

  $scope.accountLink = accountLink;
  $scope.currentActiveLink = currentActiveLink;
  $scope.disclaimerLink = disclaimerLink;
  $scope.domainLink = domainLink;
  $scope.externalContactLink = externalContactLink;
  $scope.informationLink = informationLink;
  $scope.mailingListLink = mailingListLink;
  $scope.redirectionLink = redirectionLink;
  $scope.taskLink = taskLink;

  const loadATooltip = function loadATooltip(exchange) {
    if (exchange.serverDiagnostic.ip && exchange.serverDiagnostic.isAValid) {
      set(
        exchange,
        'serverDiagnostic.aTooltip',
        $translate.instant('emailpro_dashboard_diag_a_tooltip_ok'),
      );
    } else {
      set(
        exchange,
        'serverDiagnostic.aTooltip',
        $translate.instant('emailpro_dashboard_diag_a_tooltip_error', {
          t0: exchange.hostname,
          t1: exchange.serverDiagnostic.ip,
        }),
      );
    }
  };

  const loadAaaaTooltip = function loadAaaaTooltip(exchange) {
    if (
      exchange.serverDiagnostic.ipV6 &&
      exchange.serverDiagnostic.isAaaaValid
    ) {
      set(
        exchange,
        'serverDiagnostic.aaaaTooltip',
        $translate.instant('emailpro_dashboard_diag_aaaa_tooltip_ok'),
      );
    } else {
      set(
        exchange,
        'serverDiagnostic.aaaaTooltip',
        $translate.instant('emailpro_dashboard_diag_aaaa_tooltip_error', {
          t0: exchange.hostname,
          t1: exchange.serverDiagnostic.ipV6,
        }),
      );
    }
  };

  const loadPtrTooltip = function loadPtrTooltip(exchange) {
    if (exchange.serverDiagnostic.isPtrValid) {
      set(
        exchange,
        'serverDiagnostic.ptrTooltip',
        $translate.instant('emailpro_dashboard_diag_ptr_tooltip_ok'),
      );
    } else {
      set(
        exchange,
        'serverDiagnostic.ptrTooltip',
        $translate.instant('emailpro_dashboard_diag_ptr_tooltip_error'),
      );
    }
  };
  const loadPtrv6Tooltip = function loadPtrv6Tooltip(exchange) {
    if (exchange.serverDiagnostic.isPtrV6Valid) {
      set(
        exchange,
        'serverDiagnostic.ptrv6Tooltip',
        $translate.instant('emailpro_dashboard_diag_ptrv6_tooltip_ok'),
      );
    } else {
      set(
        exchange,
        'serverDiagnostic.ptrv6Tooltip',
        $translate.instant('emailpro_dashboard_diag_ptrv6_tooltip_error'),
      );
    }
  };

  const loadEmailPro = function loadEmailPro() {
    // eslint-disable-next-line consistent-return
    WucUser.getUser().then((data) => {
      try {
        $scope.displayGuides =
          EMAILPRO_CONFIG.URLS.GUIDES.DOCS_HOME[data.ovhSubsidiary];
      } catch (exception) {
        return '';
      }
    });

    $scope.exchange = {};

    return EmailPro.gettingIsServiceMXPlan()
      .then((serviceIsMXPlan) => {
        $scope.exchange.isMXPlan = serviceIsMXPlan;
        $scope.exchange.billingPlan = serviceIsMXPlan
          ? 'emailpro-mxplan'
          : 'emailpro';

        if ($scope.exchange.isMXPlan) {
          $scope.displayGuides = null;

          $scope.MXPLAN_AUTORENEW_URL = coreURLBuilder.buildURL(
            'dedicated',
            '#/billing/autoRenew',
            {
              selectedType: 'EMAIL_DOMAIN',
              searchText: $scope.exchange.associatedDomainName,
            },
          );
        }

        return EmailPro.getSelected(true);
      })
      .then((exchange) => {
        $scope.exchange = Object.assign($scope.exchange, exchange);

        return $scope.exchange.isMXPlan
          ? EmailPro.retrievingAssociatedDomainName($scope.exchange.domain)
          : $q.when();
      })
      .then((associatedDomainName) => {
        $scope.exchange.associatedDomainName = associatedDomainName;
        $scope.newDisplayName.value = $scope.exchange.displayName;
        $scope.loadingEmailProInformations = false;

        if ($scope.exchange.messages && $scope.exchange.messages.length > 0) {
          $scope.setMessage(
            $translate.instant('emailpro_dashboard_loading_error'),
            $scope.exchange,
          );
          if (!$scope.exchange.name) {
            $scope.loadingEmailProError = true;
          }
        }

        if ($scope.is25g()) {
          $scope.exchange.tabs = {
            simple: ['ACCOUNTS'],
            expert: ['ACCOUNTS'],
          };
        }

        if ($scope.exchange.serverDiagnostic) {
          loadATooltip($scope.exchange);
          loadAaaaTooltip($scope.exchange);
          loadPtrTooltip($scope.exchange);
          loadPtrv6Tooltip($scope.exchange);
        }
      })
      .catch((failure) => {
        $scope.loadingEmailProInformations = false;
        $scope.loadingEmailProError = true;
        if (failure) {
          const response = failure.data || failure;
          const data = {
            status: 'ERROR',
            messages: [
              { type: 'ERROR', message: response.message, id: response.id },
            ],
          };
          if (response.code === 460 || response.status === 460) {
            $scope.setMessage(
              $translate.instant('common_service_expired', { t0: response.id }),
              data,
            );
          } else {
            $scope.setMessage(
              $translate.instant('emailpro_dashboard_loading_error'),
              data,
            );
          }
        }
      });
  };

  $scope.reloadEmailPro = function reloadEmailPro() {
    $scope.loadingEmailProInformations = true;
    $scope.loadingEmailProError = false;
    $scope.message = null;
    loadEmailPro();
  };

  $scope.$on('emailpro.dashboard.refresh', () => {
    loadEmailPro();
  });

  $scope.is25g = function is25g() {
    if ($scope.exchange) {
      return (
        $scope.exchange.offer === $scope.accountTypeProvider &&
        $scope.exchange.serverDiagnostic.individual2010 === true
      );
    }
    return false;
  };

  const parseLocationForEmailProData = function parseLocationForEmailProData() {
    // extract "exchange_dedicated"
    // var locationSplit = $location.url().replace("/configuration/", "").split("/");
    return {
      name: $stateParams.productId,
    };
  };

  const init = function init() {
    if ($location.search().action === 'billing') {
      $timeout(() => {
        $rootScope.$broadcast(
          'leftNavigation.selectProduct.fromName',
          parseLocationForEmailProData(),
        );
        loadEmailPro();
      }, 2000);
    } else {
      loadEmailPro();
    }
  };

  $scope.resetAction = function resetAction() {
    $scope.setAction(false);
  };

  $scope.$on('$locationChangeStart', () => {
    $scope.resetAction();
  });

  $scope.resetMessages = function resetMessages() {
    $scope.message = null;
    $scope.messageDetails = null;
  };

  $scope.configureEmailService = function configure() {
    $scope.setAction('emailpro/service/configure/emailpro-service-configure', {
      exchange: $scope.exchange,
    });
  };

  /**
   * If multiple messages set message structure as follow :
   * {
   *   OK: 'message to display when success',
   *   PARTIAL: 'message to display when partial success',
   *   ERROR: 'message to display when fail'
   * }
   * @param message
   * @param failure
   */
  $scope.setMessage = function setMessage(message, failure = '') {
    let messageToSend = message;
    let messageDetails = [];
    let alertType;
    const type = get(failure, 'type', isString(failure) ? failure : '');
    switch (type) {
      case 'error':
        alertType = 'alert alert-danger';
        break;
      case 'success':
        alertType = 'alert alert-success';
        break;
      case 'warning':
        alertType = 'alert alert-warning';
        break;
      default:
        alertType = 'alert alert-info';
        break;
    }

    if (failure) {
      if (failure.message) {
        messageDetails.push({ id: failure.id, message: failure.message });
      } else if (failure.messages) {
        if (failure.messages.length > 0) {
          const state = get(failure, 'state', '').toLowerCase();
          switch (state) {
            case 'error':
              alertType = 'alert alert-danger';
              messageToSend = message.ERROR;
              break;
            case 'partial':
              alertType = 'alert alert-warning';
              messageToSend = message.PARTIAL;
              break;
            case 'ok':
              alertType = 'alert alert-success';
              messageToSend = message.OK;
              break;
            default:
          }
          angular.forEach(
            failure.messages,
            function iteration(value) {
              if (value.type && value.type !== 'INFO') {
                this.push({ id: value.id, message: value.message });
              }
            },
            messageDetails,
          );
        }
      } else if (failure.status) {
        const status = get(failure, 'status', '').toLowerCase();
        switch (status) {
          case 'blocked':
          case 'cancelled':
          case 'paused':
          case 'error':
            alertType = 'alert alert-danger';
            break;
          case 'waitingack':
          case 'waiting_ack':
          case 'warning':
          case 'doing':
            alertType = 'alert alert-warning';
            break;
          case 'todo':
          case 'done':
          case 'success':
            alertType = 'alert alert-success';
            break;
          default:
            alertType = 'alert alert-warning';
        }
      } else if (failure === 'true') {
        alertType = 'alert alert-success';
        messageDetails = null;
      }
    }
    $scope.message = messageToSend;
    $scope.messageDetails = messageDetails;
    $scope.alertType = alertType;
  };

  // TODO work in progress
  $scope.setAction = function setAction(action, data) {
    $scope.currentAction = action;
    $scope.currentActionData = data;
    if (action) {
      $scope.stepPath = `${$scope.currentAction}.html`;
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

  $scope.displayRenewDate = function displayRenewDate() {
    return (
      $scope.exchange &&
      $scope.exchange.expiration &&
      $scope.exchange.serverDiagnostic.version === EmailPro.EmailPro2013Code &&
      $scope.exchange.offer === $scope.accountTypeDedicated
    );
  };

  $scope.displaySslRenew = function displaySslRenew() {
    if (!$scope.exchange) {
      return false;
    }
    if ($scope.exchange.offer === $scope.accountTypeDedicated) {
      return true;
    }
    if (
      $scope.exchange.serverDiagnostic.version === EmailPro.EmailPro2010Code &&
      $scope.exchange.offer !== $scope.accountTypeHosted
    ) {
      return true;
    }
    return false;
  };

  $scope.displayMigration2016 = function displayMigration2016() {
    if (!$scope.exchange) {
      return false;
    }

    if (
      $scope.exchange.serverDiagnostic.commercialVersion === '_2013' &&
      $scope.exchange.offer === $scope.accountTypeHosted &&
      ($scope.exchange.nicType.indexOf('ADMIN') !== -1 ||
        $scope.exchange.nicType.indexOf('BILLING') !== -1)
    ) {
      return true;
    }

    return false;
  };

  $scope.displayOrderDiskSpace = function displayOrderDiskSpace() {
    return (
      $scope.exchange &&
      $scope.exchange.serverDiagnostic.version === EmailPro.EmailPro2010Code &&
      $scope.exchange.offer === $scope.accountTypeProvider &&
      !$scope.is25g()
    );
  };

  $scope.resetDisplayName = function resetDisplayName() {
    $timeout(() => {
      $scope.edit.active = false;
      if ($scope.newDisplayName.value.length < 5) {
        $scope.setMessage(
          $translate.instant('emailpro_dashboard_display_name_min'),
        );
      }
    }, 300);
  };

  $scope.saveDisplayName = function saveDisplayName() {
    if (
      $scope.newDisplayName.value &&
      $scope.newDisplayName.value.length >= 5
    ) {
      const dataToSend = { displayName: $scope.newDisplayName.value };
      APIEmailPro.put('/{exchangeService}', {
        urlParams: {
          exchangeService: $scope.exchange.domain,
        },
        data: dataToSend,
      })
        .then(() => {
          $scope.exchange.displayName = $scope.newDisplayName.value;
          $rootScope.$broadcast('change.displayName', [
            $scope.exchange.domain,
            $scope.newDisplayName.value,
          ]);
          $scope.setMessage(
            $translate.instant('emailpro_ACTION_configure_success'),
            'true',
          );
        })
        .catch((err) => {
          $scope.setMessage(
            $translate.instant('emailpro_ACTION_configure_error'),
            get(err, 'data', ''),
          );
        })
        .finally(() => {
          $scope.edit.active = false;
        });
    } else {
      $scope.edit.active = false;
    }
  };

  $scope.removeEmailProDialog = function removeEmailProDialog(exchange) {
    $scope.atInternet.trackClick({
      name: 'web::email-pro::delete',
      type: 'action',
    });
    $scope.atInternet.trackPage({
      name: 'web::email-pro::delete',
      type: 'navigation',
    });
    $scope.setAction('emailpro/remove/emailpro-remove', exchange);
  };

  $scope.getAutoRenewURL = () =>
    coreURLBuilder.buildURL('dedicated', '#/billing/autoRenew', {
      searchText: $scope.exchange.domain,
    });

  init();
}
