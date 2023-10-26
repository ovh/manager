import angular from 'angular';
import set from 'lodash/set';

import {
  GLOBAL_DKIM_STATUS,
  DKIM_STATUS,
  DKIM_MATCHING_SCHEMA_STATUS,
} from './emailpro-domain.constants';

export default /* @ngInject */ (
  $scope,
  $http,
  $stateParams,
  $translate,
  EmailPro,
  EmailProDomains,
) => {
  $scope.domainTypeAuthoritative = 'AUTHORITATIVE';
  $scope.domainTypeNonAuthoritative = 'NON_AUTHORITATIVE';
  $scope.stateCreating = EmailPro.stateCreating;
  $scope.stateDeleting = EmailPro.stateDeleting;
  $scope.stateOk = EmailPro.stateOk;
  $scope.GLOBAL_DKIM_STATUS = GLOBAL_DKIM_STATUS;
  $scope.DKIM_STATUS = DKIM_STATUS;

  const init = function init() {
    $scope.loading = false;
    $scope.paginated = null;
    $scope.search = { value: null };
    $scope.canAddDomain = !$scope.exchange.isMXPlan;

    if ($scope.exchange.offer === 'PROVIDER') {
      $scope.cnameRedirection = 'ex-mail.biz';
    } else {
      $scope.cnameRedirection = 'ovh.com';
    }
  };

  function isReseller2010AuthInvalidMx(domain) {
    return (
      $scope.exchange.offer === 'PROVIDER' &&
      $scope.exchange.serverDiagnostic.commercialVersion === '_2010' &&
      domain.type === 'AUTHORITATIVE' &&
      !domain.mxValid
    );
  }

  $scope.updateDomain = function updateDomain(domain) {
    if (
      domain.state === $scope.stateOk &&
      !domain.taskInProgress &&
      !isReseller2010AuthInvalidMx(domain)
    ) {
      set(domain, 'domainTypes', $scope.domainTypes);
      $scope.setAction(
        'emailpro/domain/update/emailpro-domain-update',
        angular.copy(domain),
      );
    }
  };

  $scope.isEditDisabled = function isEditDisabled(domain) {
    return (
      domain.state !== $scope.stateOk ||
      domain.taskInProgress ||
      isReseller2010AuthInvalidMx(domain)
    );
  };

  $scope.isDeleteDisabled = function isDeleteDisabled(domain) {
    return domain.state !== $scope.stateOk || domain.accountsCount > 0;
  };

  $scope.deleteDomain = function deleteDomain(domain) {
    if (domain.state === $scope.stateOk && domain.accountsCount === 0) {
      $scope.setAction('emailpro/domain/remove/emailpro-domain-remove', domain);
    }
  };

  $scope.dkimGlobalStatus = function dkimGlobalStatus({ dkim }) {
    if (dkim.length === 0) {
      return this.GLOBAL_DKIM_STATUS.NOT_CONFIGURED;
    }

    if (
      dkim.find(({ status }) =>
        DKIM_MATCHING_SCHEMA_STATUS.OK.includes(status),
      ) &&
      dkim.find(({ status }) => status === DKIM_STATUS.READY)
    ) {
      return this.GLOBAL_DKIM_STATUS.OK;
    }

    if (
      DKIM_MATCHING_SCHEMA_STATUS.DISABLED.includes(dkim[0].status) &&
      (!dkim[1] ||
        DKIM_MATCHING_SCHEMA_STATUS.DISABLED.includes(dkim[1].status))
    ) {
      return this.GLOBAL_DKIM_STATUS.DISABLED;
    }

    if (
      dkim.find(({ status }) =>
        DKIM_MATCHING_SCHEMA_STATUS.IN_PROGRESS.includes(status),
      )
    ) {
      return this.GLOBAL_DKIM_STATUS.IN_PROGRESS;
    }

    return this.GLOBAL_DKIM_STATUS.NOK;
  };

  function setMxTooltip(domain) {
    if (domain.mxValid) {
      set(
        domain,
        'mxTooltip',
        $translate.instant('emailpro_tab_domain_diagnostic_mx_toolbox_ok'),
      );
    } else {
      set(
        domain,
        'mxTooltip',
        $translate.instant('emailpro_tab_domain_diagnostic_mx_toolbox', {
          t0: $scope.exchange.hostname,
        }),
      );
    }
  }

  function setSrvTooltip(domain) {
    if (domain.srvValid) {
      set(
        domain,
        'srvTooltip',
        $translate.instant('emailpro_tab_domain_diagnostic_srv_toolbox_ok'),
      );
    } else {
      set(
        domain,
        'srvTooltip',
        $translate.instant('emailpro_tab_domain_diagnostic_srv_toolbox', {
          t0: $scope.exchange.hostname,
        }),
      );
    }
  }

  function setSpfTooltip(domain) {
    if (domain.spfValid) {
      set(
        domain,
        'spfTooltip',
        $translate.instant('emailpro_tab_domain_diagnostic_spf_toolbox_ok'),
      );
    } else {
      set(
        domain,
        'spfTooltip',
        $translate.instant('emailpro_tab_domain_diagnostic_spf_toolbox', {
          t0: $scope.exchange.hostname,
        }),
      );
    }
  }

  $scope.setDkimColorClass = function setDkimColorClass(status) {
    switch (status) {
      case this.GLOBAL_DKIM_STATUS.OK:
        return 'oui-badge_success';
      case this.GLOBAL_DKIM_STATUS.DISABLED:
        return 'oui-badge_warning';
      case this.GLOBAL_DKIM_STATUS.NOT_CONFIGURED:
        return 'oui-background-g-100';
      case this.GLOBAL_DKIM_STATUS.IN_PROGRESS:
        return 'oui-badge_info';
      case this.GLOBAL_DKIM_STATUS.NOK:
        return 'oui-badge_error';
      default:
        return '';
    }
  };

  function setTooltips(paginated) {
    if (paginated && paginated.domains && paginated.domains.length) {
      angular.forEach($scope.paginated.domains, (domain) => {
        if ($scope.exchange) {
          setMxTooltip(domain);
          setSrvTooltip(domain);
          setSpfTooltip(domain);
        }
      });
    }
  }

  $scope.getDomains = function getDomains(count, offset) {
    $scope.loading = true;

    return EmailProDomains.getDomains(
      $stateParams.productId,
      count,
      offset,
      $scope.search.value,
    )
      .then((domains) => {
        $scope.paginated = domains;
        $scope.domainTypes = domains.domainTypes;
        setTooltips($scope.paginated);
      })
      .finally(() => {
        $scope.loading = false;
      });
  };

  $scope.$watch('search.value', (search) => {
    if ($scope.search) {
      if ($scope.search.value === search) {
        $scope.$broadcast('paginationServerSide.loadPage', 1, 'domainsTable');
      }
    }
  });

  $scope.containPartial = function containPartial() {
    let i;
    if (
      $scope.paginated &&
      $scope.paginated.domains &&
      $scope.paginated.domains.length
    ) {
      for (i = 0; i < $scope.paginated.domains.length; i += 1) {
        if ($scope.paginated.domains[i].partial) {
          return true;
        }
      }
    }
    return false;
  };

  $scope.$on(EmailPro.events.domainsChanged, () => {
    $scope.$broadcast('paginationServerSide.reload', 'domainsTable');
  });

  init();
};
