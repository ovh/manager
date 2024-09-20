import angular from 'angular';
import set from 'lodash/set';

import {
  DKIM_STATUS,
  DKIM_STATUS_CLASS,
  DKIM_STATUS_CLASS_MXPLAN,
} from './emailpro-domain.constants';

export default /* @ngInject */ (
  $scope,
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
  $scope.DKIM_STATUS = DKIM_STATUS;
  $scope.DKIM_STATUS_CLASS = DKIM_STATUS_CLASS;
  $scope.DKIM_STATUS_CLASS_MXPLAN = DKIM_STATUS_CLASS_MXPLAN;

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

  $scope.getDkimColouredChipClass = function getDkimColouredChipClass(
    exchange,
    domain,
  ) {
    return exchange.isMXPlan
      ? DKIM_STATUS_CLASS_MXPLAN[$scope.getDkimForMxPlan(domain)]
      : DKIM_STATUS_CLASS[domain.dkimDiag.state];
  };

  $scope.getDkimForMxPlan = function getDkimForMxPlan(domain) {
    if (domain.dkim.status !== DKIM_STATUS.DISABLED) {
      return domain.dkim.status;
    }
    const otherStatusThanSet =
      domain.dkim.selectors.filter((selector) => selector.status !== 'set')
        .length > 0;
    return otherStatusThanSet
      ? DKIM_STATUS.DISABLED_NO_SET
      : DKIM_STATUS.DISABLED;
  };

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
